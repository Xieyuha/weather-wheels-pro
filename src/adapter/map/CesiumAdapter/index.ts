import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import type { IMapAdapter, MapType, IMapConfig } from '../types';

// cesium地图适配器类
class CesiumAdapter implements IMapAdapter {
    private map: Cesium.Viewer | null = null;
    private container: string;

    constructor(config: IMapConfig) {
        this.container = config.container;
    }

    async init(): Promise<void> {
        try {
            const viewer = new Cesium.Viewer(this.container, {
                geocoder: false,
                infoBox: false,
                terrain: Cesium.Terrain.fromWorldTerrain(),
                timeline: false,
                animation: false,
                baseLayerPicker: false, // 禁用底图选择器减少UI开销
                fullscreenButton: false,
                homeButton: false,
                sceneModePicker: false, // 禁用场景模式选择器
                selectionIndicator: false, // 禁用选择指示器
                navigationHelpButton: false,
                // 性能优化：按需渲染
                requestRenderMode: true,
                maximumRenderTimeChange: Infinity,
            });
            //(viewer.cesiumWidget.creditContainer as HTMLElement).style.display = 'none';
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(116.397428, 39.90923, 50000),
            })
            this.map = viewer;
        } catch (error) {
            console.error('Failed to initialize Cesium', error);
        }
    }

    destroy(): void {
        if (this.map) {
            this.map.destroy();
            this.map = null;
        }
    }
    getMap(): Cesium.Viewer | null {
        return this.map;
    }
}

export default CesiumAdapter;