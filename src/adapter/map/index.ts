import type { IMapAdapter, IMapConfig} from './types';
import CesiumAdapter from './CesiumAdapter';
import OlAdapter from './OlAdapter';

export function createMapAdapter(config: IMapConfig): IMapAdapter {
    switch (config.mapType) {
        case 'cesium':
            return new CesiumAdapter(config);
        case 'openlayers':
            return new OlAdapter(config);
        default:
            throw new Error('Unsupported map type');
    }
}