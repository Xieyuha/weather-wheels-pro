import { WindLayerOrchestrator } from "./WindLayerOrchestrator";
import type { IMapAdapter } from '@/adapter/map/types';
import type { WindField } from '@/services/wind/types';
export async function createWindLayer (mapAdapter: IMapAdapter, windField: WindField) {
    const orchestrator = new WindLayerOrchestrator(mapAdapter, windField)
    await orchestrator.start()
    return orchestrator
}