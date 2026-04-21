import type { IProjector } from "@/adapter/map/types";
import type { IWindRenderer } from "./renderers/types";
import type { WindBounds, WindField } from "./types";
import { WindParticleSystem } from "./WindParticleSystem";

export class WindLayer {
    // 调用system初始化粒子
    private system: WindParticleSystem
    // projection统一投影与屏幕坐标
    private projector: IProjector
    // 调用render内对应渲染方法
    // TODO: renderer的实例化位置
    private renderer: IWindRenderer
    private rafId = 0
    constructor(
        windField: WindField,
        renderer: IWindRenderer,
        projector: IProjector
    ) {
        this.system = new WindParticleSystem(windField)
        this.renderer = renderer
        this.projector = projector
    }
    start = () => {
        this.rafId = requestAnimationFrame(this.frame)
    }
    stop() {
        cancelAnimationFrame(this.rafId)
    }
    // 有projector方法，有
    private frame = () => {
        const commands = this.system.step()
        this.renderer.beginFrame()
        for (const cmd of commands) {
            const from = this.projector.project(cmd.prevLon, cmd.prevLat)
            const to = this.projector.project(cmd.lon, cmd.lat)
            this.renderer.addSegment(
                from.x, from.y,
                to.x, to.y,
                255, 255, 255, cmd.alpha)
        }
        this.renderer.endFrame()
        requestAnimationFrame(this.frame)
    }
}