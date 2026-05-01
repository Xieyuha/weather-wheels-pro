<template>
    <div class="mapwrapper">
        <div id="mapContainer"></div>
        <Header class="header"/>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, onUnmounted, shallowRef, watch } from 'vue';
    import { storeToRefs } from 'pinia';
    import { createMapAdapter } from '@/adapter/map/index';
    import type { IMapAdapter } from '@/adapter/map/types';
    import Header from '../Panels/Header.vue';
    import { useMapStore } from '@/stores/useMapStore';
    import { createWindLayer } from '@/services/wind/index'
import type { WindLayer } from '@/services/wind/WindLayer';
    const map = shallowRef<IMapAdapter | null>(null);
    const mapStore = useMapStore();
    const { mapType } = storeToRefs(mapStore);

    const windLayer = shallowRef<WindLayer | null>(null);
    onMounted(async () => {
        if (map.value) return;
        map.value = createMapAdapter({
            container: 'mapContainer',
            // 组件通信传递mapType
            mapType: mapType.value,
        });
        await mapStore.setMap(map.value);

        windLayer.value = await createWindLayer(map.value);

    });
    onUnmounted(() => {
        windLayer.value?.stop()
        windLayer.value = null
        mapStore.destroyMap()
        map.value = null;
    });

    watch(mapType, async(newMapType) => {
        windLayer.value?.stop()
        windLayer.value = null
        mapStore.destroyMap()
        map.value = createMapAdapter({
            container: 'mapContainer',
            mapType: newMapType,
        });
        await mapStore.setMap(map.value);
        windLayer.value = await createWindLayer(map.value);
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

    .header {
        position: absolute;
        top: 0;
        right: 5%;
        z-index: 10;
        width: 20%;
        height: 10%;
    }
</style>