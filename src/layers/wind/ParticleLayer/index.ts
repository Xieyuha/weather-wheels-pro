import type { IMapAdapter } from "@/adapter/map/types";
import type { IWindRenderer } from "./renderers/types";
import type { WindField, WindBounds } from "@/services/wind/types";
import { WindParticleSystem } from "@/services/wind/WindParticleSystem";
import { CanvasWindRenderer } from './renderers/CanvasWindRenderer'

type ParticleSettings = {
    count: number; scale: number; fadeOpacity: number; lineWidth: number; maxAlpha: number
}

const ANCHORS: (ParticleSettings & { height: number })[] = [
    // scale和maxAlpha的关系：scale越大，粒子移动越快，maxAlpha应该适当降低以避免过于密集时过亮；fadeOpacity和lineWidth的关系：fadeOpacity越大，粒子残影越明显，可以适当增加lineWidth以增强视觉效果
    { height: 15_000_000, count: 10000, scale: 0.008, fadeOpacity: 0.96, lineWidth: 1.5, maxAlpha: 0.85 },
    { height:  5_000_000, count:  5000, scale: 0.024, fadeOpacity: 0.94, lineWidth: 1.8, maxAlpha: 0.75 },
    // 最大三百万？？
    { height:  1_500_000, count:  3000, scale: 0.004, fadeOpacity: 0.90, lineWidth: 2.0, maxAlpha: 0.65 },
    { height:    500_000, count:  2000, scale: 0.008, fadeOpacity: 0.86, lineWidth: 2.4, maxAlpha: 0.55 },
    // 
    { height:          0, count:  1500, scale: 0.0001, fadeOpacity: 0.82, lineWidth: 3.0, maxAlpha: 0.45 },
]
// 通过相机高度动态调整粒子系统的参数，以兼顾性能与视觉效果
function lerp(a: number, b: number, t: number) { return a + t * (b - a) }

function settingsByHeight(cameraHeight: number): ParticleSettings {
    console.log('AN-height', cameraHeight)
    // anchors 按 height 降序排列，找第一个 height ≤ cameraHeight 的（下锚点）
    const lowerIdx = ANCHORS.findIndex(a => a.height <= cameraHeight)

    if (lowerIdx <= 0) {
        // 相机高于或等于最高锚点（lowerIdx===0），或低于地面（lowerIdx===-1）
        return ANCHORS[Math.max(lowerIdx, 0)]!
    }

    const lower = ANCHORS[lowerIdx]!
    const upper = ANCHORS[lowerIdx - 1]!
    const t = (cameraHeight - lower.height) / (upper.height - lower.height)

    return {
        count:       Math.round(lerp(lower.count,       upper.count,       t)),
        scale:                  lerp(lower.scale,       upper.scale,       t),
        fadeOpacity:            lerp(lower.fadeOpacity, upper.fadeOpacity, t),
        lineWidth:              lerp(lower.lineWidth,   upper.lineWidth,   t),
        maxAlpha:               lerp(lower.maxAlpha,   upper.maxAlpha,    t),
    }
}

export class ParticleLayer {
    private system: WindParticleSystem
    private mapAdapter: IMapAdapter
    private renderer: IWindRenderer
    private rafId = 0
    private unsubscribeViewChange?: () => void
    private settings: ParticleSettings
    private currentSpawnBounds?: WindBounds

    constructor(windField: WindField, mapAdapter: IMapAdapter, spawnBounds?: WindBounds) {
        this.mapAdapter = mapAdapter
        this.currentSpawnBounds = spawnBounds
        this.settings = settingsByHeight(mapAdapter.getViewHeight())
        this.system = new WindParticleSystem(windField, this.settings.count, this.settings.scale, this.settings.maxAlpha, spawnBounds)
        this.renderer = new CanvasWindRenderer({ fadeOpacity: this.settings.fadeOpacity, lineWidth: this.settings.lineWidth })
        this.unsubscribeViewChange = mapAdapter.onViewChange(bounds => {
            this.currentSpawnBounds = bounds
            this.system.updateSpawnBounds(bounds)
        })
    }

    updateByHeight(cameraHeight: number) {
        this.settings = settingsByHeight(cameraHeight)
        console.log(`[ParticleLayer] height=${(cameraHeight / 1000).toFixed(0)}km`, this.settings)
    }

    start = () => {
        const container = this.mapAdapter.getOverlayContainer()
        const { w, h } = this.mapAdapter.getViewportSize()
        this.renderer.init(container, w, h)
        this.rafId = requestAnimationFrame(this.frame)
    }

    stop() {
        cancelAnimationFrame(this.rafId)
    }

    destroy() {
        this.stop()
        this.unsubscribeViewChange?.()
    }

    private frame = () => {
        const commands = this.system.step()
        const projector = this.mapAdapter.getProjector()
        this.renderer.beginFrame()
        for (const cmd of commands) {
            const from = projector.project(cmd.prevLon, cmd.prevLat)
            const to = projector.project(cmd.lon, cmd.lat)
            const r = 255, g = 255, b = 255
            if (from == null || to == null) continue
            this.renderer.addSegment(from.x, from.y, to.x, to.y, r, g, b, cmd.alpha)
        }
        this.renderer.endFrame()
        this.rafId = requestAnimationFrame(this.frame)
    }

    updateWindField(windField: WindField, cameraHeight?: number) {
        if (cameraHeight !== undefined) this.updateByHeight(cameraHeight)
        const { count, scale, maxAlpha, fadeOpacity, lineWidth } = this.settings
        this.system = new WindParticleSystem(windField, count, scale, maxAlpha, this.currentSpawnBounds)
        this.renderer.updateOptions({ fadeOpacity, lineWidth })
    }
}
