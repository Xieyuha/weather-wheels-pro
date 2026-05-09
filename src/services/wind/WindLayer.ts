import type { IMapAdapter } from "@/adapter/map/types";
import type { IWindRenderer } from "./renderers/types";
import { speedToRGB } from "./color";
import type { WindField, WindBounds } from "./types";
import { WindParticleSystem } from "./WindParticleSystem";

export class WindLayer {
    private system: WindParticleSystem
    private mapAdapter: IMapAdapter
    private renderer: IWindRenderer
    private rafId = 0
    private unsubscribeViewChange?: () => void

    constructor(
        windField: WindField,
        renderer: IWindRenderer,
        mapAdapter: IMapAdapter,
        spawnBounds?: WindBounds,
    ) {
        this.system = new WindParticleSystem(windField, 2000, 0.008, spawnBounds)
        this.renderer = renderer
        this.mapAdapter = mapAdapter
        this.unsubscribeViewChange = mapAdapter.onViewChange(bounds => {
            this.system.updateSpawnBounds(bounds)
        })
    }

    start = () => {
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
}