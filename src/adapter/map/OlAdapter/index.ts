import type { IMapConfig } from "../types";
import type { IMapAdapter, IProjector } from "../types";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { ImageTile } from "ol/source";
import OSM from 'ol/source/OSM';
import { fromLonLat } from "ol/proj";
class OlAdapter implements IMapAdapter {
    private map: Map | null = null;
    private container: string;

    constructor(config: IMapConfig) {
        this.container = config.container;
    }

    async init(): Promise<void> {
        try {
            const map = new Map({
                target: this.container,
                layers: [
                    new TileLayer({
                        source: new ImageTile({
                            url: 'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
                        })
                    })
                ],
                view: new View({
                    // 北京
                    center: fromLonLat([116.4074, 39.9042]),
                    zoom: 10
                })
            });
            this.map = map;

        } catch (error) {
            console.error('Failed to initialize OpenLayers', error);
            throw error
        }
    }

    // TODO: 提取 MVP 矩阵，构造快速投影器
    // 每帧调一次（取矩阵），project() 每粒子调一次（纯数学）
    getProjector(): IProjector {
        return {
            project: (lon: number, lat: number) => {
                if (!this.map) return null;
                // const view = this.map.getView();
                const screen = this.map.getPixelFromCoordinate(fromLonLat([lon, lat])) as [number, number] | undefined;
                if (!screen) return null;
                return { x: screen[0], y: screen[1] };
            }
        };
    }

    getOverlayContainer(): HTMLElement {
        return this.map!.getTargetElement() as HTMLElement;
    }

    getViewportSize(): { w: number; h: number } {
        return {
            w: this.map!.getTargetElement().clientWidth,
            h: this.map!.getTargetElement().clientHeight,
        };
    }

    destroy(): void {
        if (this.map) {
            this.map.dispose();
            this.map = null;
        }
    }

    getMap(): Map | null {
        return this.map;
    }
}

export default OlAdapter;