import type { IMapConfig } from "../types";
import type { IMapAdapter, IProjector, Bounds } from "../types";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { ImageTile } from "ol/source";
import { fromLonLat, transformExtent } from "ol/proj";
class OlAdapter implements IMapAdapter {
    private map: Map | null = null;
    private container: string;

    constructor(config: IMapConfig) {
        this.container = config.container;
    }

    private getMapInstance(): Map {
        if (!this.map) {
            throw new Error('Map not initialized. Call init() first.');
        }
        return this.map;
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

    getProjector(): IProjector {
        const R = 6378137;  // 地球半径 WGS84
        const deg2rad = Math.PI / 180;

        const map = this.getMapInstance();
        const view = map.getView();
        const res = view.getResolution()!;
        const size = map.getSize() as [number, number];

        const invRes = 1 / res;
        const halfW = size[0] / 2;
        const halfH = size[1] / 2;
        const [centerX, centerY] = view.getCenter() as [number, number];
        return {
            project: (lon: number, lat: number) => {
                // 将经纬度转换为 Web Mercator 坐标
                const mx = R * lon * deg2rad;
                const my = R * Math.log(Math.tan(Math.PI / 4 + lat * deg2rad / 2));
                const screenX = (mx - centerX) * invRes + halfW;
                const screenY = (centerY - my) * invRes + halfH;
                return { x: screenX, y: screenY };
            }
        };
    }

    getViewBounds(): Bounds | undefined {
        if (!this.map) return undefined;
        const size = this.map.getSize();
        if (!size) return undefined;
        const extent = this.map.getView().calculateExtent(size);
        // extent 是 EPSG:3857，转换到 EPSG:4326 [minLon, minLat, maxLon, maxLat]
        const [lo1, la2, lo2, la1] = transformExtent(extent, 'EPSG:3857', 'EPSG:4326') as [number, number, number, number];
        return { lo1, la1, lo2, la2 };
    }

    getOverlayContainer(): HTMLElement {
        return this.getMapInstance().getTargetElement() as HTMLElement;
    }

    getViewportSize(): { w: number; h: number } {
        const size = this.getMapInstance().getSize() ?? [0, 0];
        return { w: size[0]!, h: size[1]! };
    }

    onViewChange(callback: (bounds: Bounds | undefined) => void): () => void {
        const map = this.getMapInstance();
        const handler = () => callback(this.getViewBounds());
        // OL 用 moveend 事件
        map.on('moveend', handler);
        return () => map.un('moveend', handler);
    }

    destroy(): void {
        if (!this.map) return;
        this.map.dispose();
        this.map = null;
    }

    getMap(): Map | null {
        return this.map;
    }
}

export default OlAdapter;