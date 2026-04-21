// TODO: 实现 createProjector() — 提取 MVP 矩阵，返回 IProjector
// TODO: 实现 getOverlayContainer() — 返回 viewer.container
// TODO: 实现 getViewportSize() — 返回 viewer.canvas 尺寸
// TODO: addWindLayer() 改为使用 WindLayer + CanvasWindRenderer（不再直接 new WindParticleLayer）
// TODO: requestRenderMode 下需在帧循环中调 scene.requestRender()

import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import type { IMapAdapter, IMapConfig, IProjector } from '../types';

class CesiumAdapter implements IMapAdapter {
    private map: Cesium.Viewer | null = null;
    private container: string;

    constructor(config: IMapConfig) {
        this.container = config.container;
    }

    async init(): Promise<void> {
        Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;
        try {
            const viewer = new Cesium.Viewer(this.container, {
                geocoder: false,
                infoBox: false,
                terrain: Cesium.Terrain.fromWorldTerrain(),
                timeline: false,
                animation: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                homeButton: false,
                sceneModePicker: false,
                selectionIndicator: false,
                navigationHelpButton: false,
                requestRenderMode: true,
            });
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(116.397428, 39.90923, 50000),
            })
            this.map = viewer;
        } catch (error) {
            console.error('Failed to initialize Cesium', error);
        }
    }

    // TODO: 提取 MVP 矩阵，构造快速投影器
    // 每帧调一次（取矩阵），project() 每粒子调一次（纯数学）
    getProjector(): IProjector {
        return {
            project: (lon: number, lat: number) => {
                if (!this.map) return null;
                const cartesian = Cesium.Cartesian3.fromDegrees(lon, lat);
                const screen = Cesium.SceneTransforms.worldToWindowCoordinates(
                    this.map.scene, cartesian
                );
                if (!screen) return null;
                return { x: screen.x, y: screen.y };
            }
        };
    }

    getOverlayContainer(): HTMLElement {
        return this.map!.container as HTMLElement;
    }

    getViewportSize(): { w: number; h: number } {
        return {
            w: this.map!.container.clientWidth,
            h: this.map!.container.clientHeight,
        };
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
