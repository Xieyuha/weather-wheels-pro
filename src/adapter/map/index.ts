import type { IMapAdapter, IMapConfig, IProjector} from './types';
import { MapType } from './types';
import AmapAdapter from './AmapAdapter';
import CesiumAdapter from './CesiumAdapter';

class MapAdapter implements IMapAdapter {
    private adapter: IMapAdapter | null = null;
    private config: IMapConfig;

    constructor(config: IMapConfig) {
        this.config = config;
    }

    static create(config: IMapConfig): MapAdapter {
        return new MapAdapter(config);
    }
    // 可以优化为注册表结构
    async init(): Promise<void> {
        switch (this.config.mapType) {
            case 'cesium':
                this.adapter = new CesiumAdapter(this.config);
                await this.adapter.init();
                break;
            case 'amap':
                this.adapter = new AmapAdapter(this.config);
                await this.adapter.init();
                break;
            default:
                throw new Error('Unsupported map type');
        }
    }
    getProjector(): IProjector {
        return this.adapter!.getProjector!();
    }

    getOverlayContainer(): HTMLElement {
        return this.adapter!.getOverlayContainer!();
    }

    getViewportSize(): { w: number; h: number } {
        return this.adapter!.getViewportSize!();
    }

    getMap() {
        return this.adapter?.getMap();
    }

    destroy() {
        this.adapter?.destroy();
        this.adapter = null;
    }
}

export default MapAdapter;