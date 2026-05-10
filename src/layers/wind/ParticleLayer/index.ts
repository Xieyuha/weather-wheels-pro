import type { IMapAdapter } from "@/adapter/map/types";
import type { IWindRenderer } from "./renderers/types";
import { speedToRGB } from "@/services/wind/color";
import type { WindField, WindBounds } from "@/services/wind/types";
import { WindParticleSystem } from "@/services/wind/WindParticleSystem";
import { CanvasWindRenderer } from './renderers/CanvasWindRenderer'
export class ParticleLayer {
    private system: WindParticleSystem
    private mapAdapter: IMapAdapter
    private renderer: IWindRenderer
    private rafId = 0
    private unsubscribeViewChange?: () => void
    private fadeOpacity = 0
    private lineWidth = 0
    private meterperDegree = 50
    private particleCount = 2000
    private speedFactor = 0.008
    private currentSpawnBounds?: WindBounds
    constructor(
        windField: WindField,
        mapAdapter: IMapAdapter,
        level: number,
        spawnBounds?: WindBounds,
    ) {
        this.mapAdapter = mapAdapter
        this.currentSpawnBounds = spawnBounds
        this.updateByLevel(level)
        this.system = new WindParticleSystem(windField, this.particleCount, this.speedFactor, spawnBounds, this.meterperDegree)
        this.renderer = new CanvasWindRenderer(
            { fadeOpacity: this.fadeOpacity, lineWidth: this.lineWidth },
        )
        this.unsubscribeViewChange = mapAdapter.onViewChange(bounds => {
            this.system.updateSpawnBounds(bounds)
        })
    }

    // 根据level调整粒子数量、速度和线宽
    private updateByLevel(level: number) {
        // 根据level调整粒子数量、速度和线宽
        const map: Record<number, { count: number, speedFactor: number, fadeOpacity: number, lineWidth: number, meterperDegree: number }> = {
            0: { count: 2000, speedFactor: 0.008, fadeOpacity: 0.88, lineWidth: 1.5 ,meterperDegree: 50},
            1: { count: 3000, speedFactor: 0.01, fadeOpacity: 0.85, lineWidth: 2 ,meterperDegree: 50},
            2: { count: 4000, speedFactor: 0.012, fadeOpacity: 0.8, lineWidth: 2.5 ,meterperDegree: 50},
        }
        if (level in map) {
            const settings = map[level]!
            this.fadeOpacity = settings.fadeOpacity
            this.lineWidth = settings.lineWidth
            this.meterperDegree = settings.meterperDegree
            this.particleCount = settings.count
            this.speedFactor = settings.speedFactor
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
            // const [r, g, b] = speedToRGB(cmd.speed)
            const r = 255, g = 255, b = 255
            if (from == null || to == null) continue
            this.renderer.addSegment(
                from.x, from.y,
                to.x, to.y,
                r, g, b, cmd.alpha)
        }
        this.renderer.endFrame()
        this.rafId = requestAnimationFrame(this.frame)
    }

    updateWindField(windField: WindField, level: number) {
        this.updateByLevel(level)
        this.system = new WindParticleSystem(windField, this.particleCount, this.speedFactor, this.currentSpawnBounds, this.meterperDegree)
        this.renderer.updateOptions({ fadeOpacity: this.fadeOpacity, lineWidth: this.lineWidth })
    }
}