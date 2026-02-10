import type { MapType, IMapAdapter } from './types';
import AmapAdapter from './AmapAdapter';

class MapAdapter {
    private mapType: MapType;
    private options: IMapAdapter;
    private map: AmapAdapter | null = null;

    constructor(options: IMapAdapter) {
        this.options = options;
        this.mapType = options.mapType;
    }

    static create(options: IMapAdapter): MapAdapter {
        return new MapAdapter(options);
    }

    async init(): Promise<void> {
        switch (this.mapType) {
            case 'cesium':
                break;
            case 'amap':
                this.map = new AmapAdapter(this.options);
                await this.map.init();
                break;
            default:
                throw new Error('Unsupported map type');
        }
    }
    getMap() {
        return this.map;
    }
    destroy() {
        this.map = null;
        console.log(`${this.mapType} manager destroyed`)
    }
}

export default MapAdapter;