<template>
    <div class="mapwrapper" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
        <div id="mapContainer"></div>
        <WindLegend />
    </div>
</template>

<script setup lang="ts">
    import { onMounted, onUnmounted, shallowRef, watch } from 'vue';
    import { storeToRefs } from 'pinia';
    import { createMapAdapter } from '@/adapter/map/index';
    import type { IMapAdapter } from '@/adapter/map/types';
    import { useMapStore } from '@/stores/useMapStore';
    import { useWindStore } from '@/stores/useWindStore';
    import { createWindLayer } from '@/layers/wind/index';
    import { useWindLOD } from '@/composable/useWindLod';
    import WindService from '@/services/wind/WindService';
    import { MapType } from '@/adapter/map/types';
    import { sampleWind } from '@/services/wind/interpolate';
    import WindLegend from './WindLegend.vue';

    const map = shallowRef<IMapAdapter | null>(null);
    const mapStore = useMapStore();
    const windStore = useWindStore();
    const { mapType } = storeToRefs(mapStore);

    const windLayer = shallowRef<any | null>(null);
    let windField: Awaited<ReturnType<WindService['getWindData']>> | undefined;

    onMounted(async () => {
        if (map.value) return;
        windField = await new WindService().getWindData(0.25);
        map.value = createMapAdapter({
            container: 'mapContainer',
            mapType: mapType.value,
        });
        await mapStore.setMap(map.value);
        windLayer.value = await createWindLayer(map.value, windField);
        windStore.setOrchestrator(windLayer.value, windField);
        useWindLOD(map.value, windLayer.value);
        if (mapType.value === MapType.Openlayers) {
            // new WindHeatmapLayer(windField, map.value as OlAdapter);
        }
    });

    onUnmounted(() => {
        windLayer.value?.destroy();
        windLayer.value = null;
        windStore.clearOrchestrator();
        mapStore.destroyMap();
        map.value = null;
    });

    watch(mapType, async (newMapType) => {
        windLayer.value?.destroy();
        windLayer.value = null;
        windStore.clearOrchestrator();
        mapStore.destroyMap();
        map.value = createMapAdapter({
            container: 'mapContainer',
            mapType: newMapType,
        });
        await mapStore.setMap(map.value);
        if (!windField) return;
        windLayer.value = await createWindLayer(map.value, windField);
        windStore.setOrchestrator(windLayer.value, windField);
        useWindLOD(map.value, windLayer.value);
    });

    function onMouseMove(e: MouseEvent) {
        const adapter = map.value;
        if (!adapter?.getCoordinateAtPixel || !windStore.windField) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const coord = adapter.getCoordinateAtPixel(x, y);
        if (!coord) return;
        const wind = sampleWind(windStore.windField, coord.lon, coord.lat);
        windStore.setHoverWindSpeed(wind ? Math.sqrt(wind.u ** 2 + wind.v ** 2) : null);
    }

    function onMouseLeave() {
        windStore.setHoverWindSpeed(null);
    }
</script>

<style scoped>
    .mapwrapper {
        width: 100%;
        height: 100%;
        position: relative;
    }

    #mapContainer {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: absolute;
    }
</style>
