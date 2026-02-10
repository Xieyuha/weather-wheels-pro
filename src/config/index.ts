export const MAP_CONFIG = {
    amap: {
        key: import.meta.env.VITE_AMAP_KEY || '',
        securityCode: import.meta.env.VITE_AMAP_SECURITY_CODE || '',
    },
    cesium: {
        token: import.meta.env.VITE_CESIUM_TOKEN || '',
    },
    isDev: import.meta.env.DEV,
}