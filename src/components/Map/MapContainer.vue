<template>
    <div id="mapContainer"></div>
</template>

<script setup lang="ts">
    import { onMounted, onUnmounted, shallowRef } from 'vue';
    import MapAdapter from '@/adapter/map';

    const map = shallowRef<MapAdapter | null>(null);
    onMounted(() => {
        map.value = new MapAdapter({
            container: 'mapContainer',
            // 组件通信传递mapType
            mapType: 'amap',
            init: async () => {
            }
        });
        map.value?.init();
    });
    onUnmounted(() => {
        map.value?.destroy();
    });
</script>

<style scoped>
    #mapContainer {
        width: 100%;
        height: 100%;
    }
</style>