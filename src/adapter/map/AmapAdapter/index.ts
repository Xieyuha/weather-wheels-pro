import type { IMapAdapter, MapType, IMapConfig } from "../types";
import AMap from "@amap/amap-jsapi-loader";
import plugins from "./plugins";
import { MAP_CONFIG } from "@/config";

class AmapAdapter implements IMapAdapter {
    private map: any;
    private container: string;

    constructor(config: IMapConfig) {
        this.container = config.container;
    }

    async init(): Promise<void> {
        window._AMapSecurityConfig = {
            securityJsCode: MAP_CONFIG.amap.securityCode,
        };

        try {
            const amapInstance = await AMap.load({
                key: MAP_CONFIG.amap.key,
                version: '2.0',
            })
            const amap = new amapInstance.Map(this.container, {
                viewMode: '2D',
                zoom: 11,
                center: [116.397428, 39.90923]
            });
            this.map = amap;
        } catch (error) {
            console.error('Failed to initialize AMap', error);
        }
    }
    getMap() {
        return this.map;
    }
    destroy(): void {
        if (this.map) {
            this.map.destroy();
            this.map = null;
        }
    }
}
export default AmapAdapter;