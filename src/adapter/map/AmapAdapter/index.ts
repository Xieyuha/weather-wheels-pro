import type { IMapAdapter, MapType } from "../types";
import AMap from "@amap/amap-jsapi-loader";
import plugins from "./plugins";
import { MAP_CONFIG } from "@/config";

class AmapAdapter implements IMapAdapter {
    private map: any;
    container: string;
    mapType: MapType;

    constructor(options: IMapAdapter) {
        this.container = options.container;
        this.mapType = options.mapType;
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
            console.error('Failed to load AMap JSAPI', error);
        }
    }
}
export default AmapAdapter;