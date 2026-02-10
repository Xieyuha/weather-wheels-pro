type MapType = 'cesium' | 'leaflet' | 'openlayers' | 'amap';

interface IMapAdapter {
    container: string;  
    mapType: MapType;
    init(): Promise<void>;
}

declare global {
    interface Window {
        _AMapSecurityConfig: {
            securityJsCode: string;
        };
    }
}
export type {
    MapType,
    IMapAdapter
}