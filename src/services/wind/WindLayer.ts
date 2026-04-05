import type { IWindRenderer } from "./renderers/types";
import type { WindBounds, WindField } from "./types";
import { WindParticleSystem } from "./WindParticleSystem";

export class WindLayer {
    // 调用system初始化粒子
    private system: WindParticleSystem
    // projection统一投影与屏幕坐标
    // 调用render内对应渲染方法
    // TODO: renderer的实例化位置
    private renderer: IWindRenderer
    private bounds: WindBounds
    private width: number
    private height: number
    private rafId = 0
    constructor(
        windField: WindField,
        renderer: IWindRenderer,
        bounds: WindBounds,
        width: number,
        height: number
    ) {
        this.system = new WindParticleSystem(windField)
        this.renderer = renderer
        this.bounds = bounds
        this.width = width
        this.height = height
    }
    start = () => {
        this.rafId = requestAnimationFrame(this.frame)
    }
    stop() {
        cancelAnimationFrame(this.rafId)
    }

    private toScreen = (lon: number, lat: number) => {
        const { lo1, lo2, la1, la2 } = this.bounds;
        return {
            x: (lon - lo1) / (lo2 - lo1) * this.width,
            y: (la1 - lat) / (la1 - la2) * this.height,
        };
    }
    private frame = () => {
        const commands = this.system.step()
        this.renderer.beginFrame()
        for (const cmd of commands) {
            const from = this.toScreen(cmd.prevLon, cmd.prevLat)
            const to = this.toScreen(cmd.lon, cmd.lat)
            this.renderer.addSegment(
                from.x, from.y,
                to.x, to.y,
                255, 255, 255, cmd.alpha)
        }
        this.renderer.endFrame()
        requestAnimationFrame(this.frame)
    }
}