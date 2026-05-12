import { useMapStore } from "@/stores/useMapStore"
import type { IMapAdapter } from "@/adapter/map/types"
import { WindLayerOrchestrator } from "@/layers/wind/WindLayerOrchestrator"
import { onUnmounted } from "vue"
import  WindService  from "@/services/wind/WindService"
import type { Resolution } from "@/services/wind/types"
export function useWindLOD(adapter: IMapAdapter, orchestrator: WindLayerOrchestrator) {
    const mapStore = useMapStore()

    const unsubscribe = adapter.onLodChange?.(async (level) => {
        // lod统一三层级，level越大粒子越密集
        mapStore.setZoomLevel(level)                          // 更新 store 状态
        const resolution = [1.0, 0.5, 0.25][level] as Resolution
        const windField = await new WindService().getWindData(resolution)
        const height = adapter.getViewHeight()
        orchestrator.updateByHeight(height) // 更新粒子层的设置
        orchestrator.updateWindField(windField)
    })

    onUnmounted(() => unsubscribe?.())
}