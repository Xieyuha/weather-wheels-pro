import { defineStore } from 'pinia';
import { markRaw } from 'vue';
import { MapType } from '@/adapter/map/types';
import type { IMapAdapter } from '@/adapter/map/types';

interface IMapStore {
    mapInstance: IMapAdapter | null;
    mapType: MapType;
    isMapLoading: boolean;
    isMapReady: boolean;
}

export const useMapStore = defineStore('map', {
    state: (): IMapStore => ({
        mapInstance: null as IMapAdapter | null,
        mapType: MapType.Cesium,
        isMapLoading: false,
        isMapReady: false,
    }),
    actions: {
        async setMap(adapter: IMapAdapter) {
            this.mapInstance = markRaw(adapter);
            this.isMapLoading = true;
            this.isMapReady = false;
            await adapter.init();
            this.isMapLoading = false;
            this.isMapReady = true;
            console.log(this.isMapReady)
            console.log(`===map ready===${Date.now()}`)
        },
        destroyMap() {
            this.mapInstance?.destroy();
            this.mapInstance = null;
            this.isMapLoading = false;
            this.isMapReady = false;
        }
    },
});