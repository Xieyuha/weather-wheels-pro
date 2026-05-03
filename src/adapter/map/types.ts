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
// ── 投影器接口（每帧由适配器创建一次，粒子层逐点调用）──
export interface IProjector {
    project(lon: number, lat: number): { x: number; y: number } | null;
}

// 地图适配器接口
export interface IMapAdapter {
    init(): Promise<void>;
    destroy(): void;
    getMap(): unknown;

    // ── 粒子系统需要的三个方法 ──
    // 每帧调一次，返回一个投影器（内部缓存了当前相机状态）
    getProjector(): IProjector;
    // canvas 挂载到哪个 DOM 节点
    getOverlayContainer(): HTMLElement;
    // 当前视口尺寸
    getViewportSize(): { w: number; h: number };
    // 当前相机可见范围（经纬度，-180~180 系统），用于约束粒子撒点区域
    // 可选：不实现时粒子回退到风场全局 bounds
    getViewBounds?(): { lo1: number; la1: number; lo2: number; la2: number } | undefined;

    onViewChange(callback: (bounds: Bounds) => void): () => void;
}

export type Bounds = { lo1: number; la1: number; lo2: number; la2: number }


declare global {
    interface Window {
        _AMapSecurityConfig: {
            securityJsCode: string;
        };
    }
}
