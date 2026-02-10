enum AmapPluginType {
    Scale = 'AMap.Scale',
    OverView = 'AMap.OverView',
    ToolBar = 'AMap.ToolBar',
    MapType = 'AMap.MapType',
    Geolocation = 'AMap.Geolocation',
    Riding = 'AMap.Riding',
    Driving = 'AMap.Driving',
    AutoComplete = 'AMap.AutoComplete',
    PlaceSearch = 'AMap.PlaceSearch',
    Geocoder = 'AMap.Geocoder',
    Weather = 'AMap.Weather',
    GeometryUtil = 'AMap.GeometryUtil'
}

const plugins: AmapPluginType[] = [
    AmapPluginType.Geolocation,
    AmapPluginType.Riding
];

export default plugins;