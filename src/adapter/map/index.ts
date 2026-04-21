import type { IMapAdapter, IMapConfig} from './types';
import AmapAdapter from './AmapAdapter';
import CesiumAdapter from './CesiumAdapter';
import { sw } from 'element-plus/es/locales.mjs';

export function createMapAdapter(config: IMapConfig): IMapAdapter {
    switch (config.mapType) {
        case 'cesium':
            return new CesiumAdapter(config);
        case 'amap':
            return new AmapAdapter(config);
        default:
            throw new Error('Unsupported map type');
    }
}