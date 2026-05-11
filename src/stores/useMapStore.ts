import { defineStore } from 'pinia';
import { markRaw } from 'vue';
import { MapType } from '@/adapter/map/types';
import type { IMapAdapter } from '@/adapter/map/types';
interface IMapStore {
    mapInstance: IMapAdapter | null;
    mapType: MapType;
    isMapLoading: boolean;
    isMapReady: boolean;
    zoomLevel: number;
}

export const useMapStore = defineStore('map', {
    state: (): IMapStore => ({
        mapInstance: null as IMapAdapter | null,
        mapType: MapType.Openlayers,
        isMapLoading: false,
        isMapReady: false,
        zoomLevel: 0,
    }),
    actions: {
        async setMap(adapter: IMapAdapter) {
            this.mapInstance = markRaw(adapter);
            this.isMapLoading = true;
            this.isMapReady = false;
            await adapter.init().then(
                () => {
                    this.isMapLoading = false;
                    this.isMapReady = true;
                }
            )
                .catch((error) => {
                    console.error('Failed to initialize map adapter', error);
                    this.mapInstance = null;
                    this.isMapLoading = false;
                    this.isMapReady = false;
                });
        },
        setZoomLevel(level: 0 | 1 | 2) {
            this.zoomLevel = level;
        },
        destroyMap() {
            this.mapInstance?.destroy();
            this.mapInstance = null;
            this.isMapLoading = false;
            this.isMapReady = false;
        }
    },
});