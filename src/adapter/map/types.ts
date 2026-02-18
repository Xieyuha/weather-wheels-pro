export enum MapType {
    Cesium = 'cesium',
    Leaflet = 'leaflet',
    Openlayers = 'openlayers',
    Amap = 'amap',
}
// 地图配置接口
export interface IMapConfig {
    container: string;
    mapType: MapType;
    //init(): Promise<void>;
}
// 地图适配器接口
export interface IMapAdapter {
    init(): Promise<void>;
    destroy(): void;
    getMap(): any;
}
declare global {
    interface Window {
        _AMapSecurityConfig: {
            securityJsCode: string;
        };
    }
}
