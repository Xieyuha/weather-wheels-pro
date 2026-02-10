import { defineStore } from 'pinia';
import { markRaw } from 'vue';
import type { IMapAdapter } from '@/adapter/map/types';

export const useMapStore = defineStore('map', {
    state: () => ({
        mapInstance: null as IMapAdapter | null,
        isMapLoading: false,
        isMapReady: false,
    }),
    actions: {
        setMap(adapter: IMapAdapter) {
            this.mapInstance = markRaw(adapter);
            this.isMapLoading = true;
            this.isMapReady = false;
            adapter.init().then(() => {
                this.isMapLoading = false;
                this.isMapReady = true;
            });
        },
    },
});