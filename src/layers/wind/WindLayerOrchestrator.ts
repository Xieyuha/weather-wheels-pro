import type { WindField } from "@/services/wind/types";
import type { IMapAdapter } from "@/adapter/map/types";
import { ParticleLayer } from "./ParticleLayer";
import { HeatmapLayer } from "./HeatmapLayer";
export class WindLayerOrchestrator {
    private mapadapter: IMapAdapter
    private windField: WindField
    private level: number = 0
    private particleLayer: ParticleLayer | null = null
    private heatmapLayer: HeatmapLayer | null = null

    constructor(
        mapAdapter: IMapAdapter,
        windField: WindField,
    ) {
        this.windField = windField
        this.mapadapter = mapAdapter

    }

    async start() {
        const spawnBounds = this.mapadapter.getViewBounds?.() ?? this.windField.meta.bounds;
        this.particleLayer = new ParticleLayer(
            this.windField,
            this.mapadapter,
            this.level,
            spawnBounds
        )
        this.particleLayer.start()
    }


    // lod切换时更新风场数据
    updateWindField(windField: WindField) {
        this.windField = windField
        // store那里根据视口传入level，这里把level私有化，再传给各个图层
        // 图层内部进行判断，改变线宽与移动速度
        this.level = 1
        this.particleLayer?.updateWindField(windField, this.level)
    }

    destroy() {
        this.particleLayer?.destroy()
        this.particleLayer = null
        this.heatmapLayer = null
    }
}