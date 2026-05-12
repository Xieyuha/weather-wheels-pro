import type { IMapAdapter } from "@/adapter/map/types";
import type { IWindRenderer } from "./renderers/types";
import type { WindField, WindBounds } from "@/services/wind/types";
import type { WindUserOptions } from "@/layers/wind/WindLayerOrchestrator";
import { WindParticleSystem } from "@/services/wind/WindParticleSystem";
import { CanvasWindRenderer } from './renderers/CanvasWindRenderer'

type ParticleSettings = {
    count: number; scale: number; fadeOpacity: number; lineWidth: number; maxAlpha: number
}

const ANCHORS: (ParticleSettings & { height: number })[] = [
    { height: 15_000_000, count: 10000, scale: 0.008,  fadeOpacity: 0.96, lineWidth: 1.5, maxAlpha: 0.85 },
    { height:  5_000_000, count:  5000, scale: 0.024,  fadeOpacity: 0.94, lineWidth: 1.8, maxAlpha: 0.75 },
    { height:  1_500_000, count:  3000, scale: 0.004,  fadeOpacity: 0.90, lineWidth: 2.0, maxAlpha: 0.65 },
    { height:    500_000, count:  2000, scale: 0.008,  fadeOpacity: 0.86, lineWidth: 2.4, maxAlpha: 0.55 },
    { height:          0, count:  1500, scale: 0.0001, fadeOpacity: 0.82, lineWidth: 3.0, maxAlpha: 0.45 },
]

function lerp(a: number, b: number, t: number) { return a + t * (b - a) }

function settingsByHeight(cameraHeight: number): ParticleSettings {
    const lowerIdx = ANCHORS.findIndex(a => a.height <= cameraHeight)
    if (lowerIdx <= 0) return ANCHORS[0]!
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

    // user overrides — null means "follow LOD"
    private userSpeedMultiplier = 1.0
    private userParticleCount: number | null = null
    private userFadeOpacity: number | null = null

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

    // LOD 高度变化时重新计算基础参数，同时保留用户覆盖值
    updateByHeight(cameraHeight: number) {
        this.settings = settingsByHeight(cameraHeight)
        this.system.setScale(this.settings.scale * this.userSpeedMultiplier)
        if (this.userParticleCount !== null) this.system.setCount(this.userParticleCount)
        this.renderer.updateOptions({
            fadeOpacity: this.userFadeOpacity ?? this.settings.fadeOpacity,
            lineWidth: this.settings.lineWidth,
        })
    }

    setUserOptions(opts: WindUserOptions) {
        if (opts.speedMultiplier !== undefined) {
            this.userSpeedMultiplier = opts.speedMultiplier
            this.system.setScale(this.settings.scale * opts.speedMultiplier)
        }
        if (opts.particleCount !== undefined) {
            this.userParticleCount = opts.particleCount
            this.system.setCount(opts.particleCount)
        }
        if (opts.fadeOpacity !== undefined) {
            this.userFadeOpacity = opts.fadeOpacity
            this.renderer.updateOptions({ fadeOpacity: opts.fadeOpacity, lineWidth: this.settings.lineWidth })
        }
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
            if (from == null || to == null) continue
            this.renderer.addSegment(from.x, from.y, to.x, to.y, 255, 255, 255, cmd.alpha)
        }
        this.renderer.endFrame()
        this.rafId = requestAnimationFrame(this.frame)
    }

    updateWindField(windField: WindField, cameraHeight?: number) {
        if (cameraHeight !== undefined) this.updateByHeight(cameraHeight)
        const count = this.userParticleCount ?? this.settings.count
        const scale = this.settings.scale * this.userSpeedMultiplier
        const fade = this.userFadeOpacity ?? this.settings.fadeOpacity
        this.system = new WindParticleSystem(windField, count, scale, this.settings.maxAlpha, this.currentSpawnBounds)
        this.renderer.updateOptions({ fadeOpacity: fade, lineWidth: this.settings.lineWidth })
    }
}
