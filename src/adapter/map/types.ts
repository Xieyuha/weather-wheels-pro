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
    // 添加各种方法的组装与暴露，manage管理子文件夹
    // 要素、图层、
    // 事件总线：缩放->请求(优化)
    // 视角
    destroy(): void;
    getMap(): void;
}
declare global {
    interface Window {
        _AMapSecurityConfig: {
            securityJsCode: string;
        };
    }
}
