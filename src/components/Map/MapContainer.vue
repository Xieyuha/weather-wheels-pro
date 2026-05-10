<template>
    <div class="mapwrapper">
        <div id="mapContainer"></div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, onUnmounted, shallowRef, watch } from 'vue';
    import { storeToRefs } from 'pinia';
    import { createMapAdapter } from '@/adapter/map/index';
    import type { IMapAdapter } from '@/adapter/map/types';
    import { useMapStore } from '@/stores/useMapStore';
    import { createWindLayer } from '@/layers/wind/index';
    
    import WindService from '@/services/wind/WindService';
    import { WindHeatmapLayer } from '@/services/wind/WindHeatmapLayer';
    import { MapType } from '@/adapter/map/types';
    import type OlAdapter from '@/adapter/map/OlAdapter';

    const map = shallowRef<IMapAdapter | null>(null);
    const mapStore = useMapStore();
    const { mapType } = storeToRefs(mapStore);

    const windLayer = shallowRef<any | null>(null);
    let windField: Awaited<ReturnType<WindService['getWindData']>> | undefined;
    onMounted(async () => {
        if (map.value) return;
        windField = await new WindService().getWindData();
        map.value = createMapAdapter({
            container: 'mapContainer',
            // 组件通信传递mapType
            mapType: mapType.value,
        });
        await mapStore.setMap(map.value);
        windLayer.value = await createWindLayer(map.value, windField);
        if (mapType.value === MapType.Openlayers) {
            // new WindHeatmapLayer(windField, map.value as OlAdapter);
        }
    });
    onUnmounted(() => {
        windLayer.value?.destroy()
        windLayer.value = null
        mapStore.destroyMap()
        map.value = null;
    });

    watch(mapType, async (newMapType) => {
        windLayer.value?.destroy()
        windLayer.value = null
        mapStore.destroyMap()
        map.value = createMapAdapter({
            container: 'mapContainer',
            mapType: newMapType,
        });
        await mapStore.setMap(map.value);
        if (!windField) return;
         windLayer.value = await createWindLayer(map.value, windField);

    });
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
