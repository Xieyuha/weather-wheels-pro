import AMapAdapter from "./AmapAdapter";
import CesiumAdapter from "./CesiumAdapter";
import { MapType } from "./types";

const MapRegistry = {
    [MapType.Amap]: AMapAdapter,
    [MapType.Cesium]: CesiumAdapter,
}

export default MapRegistry;