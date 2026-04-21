<template>
    <div class="mapwrapper">
        <div id="mapContainer"></div>
        <Header class="header"/>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, onUnmounted, shallowRef, watch } from 'vue';
    import { storeToRefs } from 'pinia';
    import MapAdapter from '@/adapter/map';
    import Header from '../Panels/Header.vue';
    import { useMapStore } from '@/stores/useMapStore';
    import { createWindLayer } from '@/services/wind/index'
    const map = shallowRef<MapAdapter | null>(null);
    const mapStore = useMapStore();
    const { mapType } = storeToRefs(mapStore);
    onMounted(async () => {
        if (map.value) return;
        map.value = new MapAdapter({
            container: 'mapContainer',
            // 组件通信传递mapType
            mapType: mapType.value,
        });
        await mapStore.setMap(map.value);
        
        createWindLayer(map.value);

    });
    onUnmounted(() => {
        map.value = null;
        mapStore.destroyMap()
    });

    watch(mapType, (newMapType) => {
        mapStore.destroyMap()
        map.value = new MapAdapter({
            container: 'mapContainer',
            mapType: newMapType,
        });
        mapStore.setMap(map.value);

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