// GFS-GRIB2 ->二进制转换 -> GFS JSON
const GFSJSON = [
    {
        "header": {
            "parameterNumber": 2,   // U 分量（东西风）
            "lo1": 0, "la1": 90,  // 起始经纬度
            "dx": 1.0, "dy": 1.0,  // 格点步长（度）
            "nx": 360, "ny": 181   // 格点数量
        },
        "data": [/* nx*ny 个 float，按行展开 */]
    },
    {
        "header": {
            "parameterNumber": 3    // V 分量（南北风）
        },
        "data": [/* 同上 */]
    }
]

export interface WindField {
    meta: {
        // 起始经度(左边界)、起始维度(上边界)、结束经度、结束维度
        // 左上开始逐行扫描
        bounds: { lo1: number; la1: number; lo2: number; la2: number };
        nx: number;      // 经度方向格点数
        ny: number;      // 纬度方向格点数
        dx: number;      // 经度步长（度）
        dy: number;      // 纬度步长（度）
        timestamp: string;
        lonRange: '0-360' | '-180-180';
    };
    // 表示在格点交界的数据
    u: Float32Array;       // 东西风分量 m/s，正=向东
    v: Float32Array;       // 南北风分量 m/s，正=向北
    // 3D 场景可选，W 分量通常极小
    w?: Float32Array;      // 垂直风分量 m/s  
}

export type WindBounds = WindField['meta']['bounds']
// 粒子
export interface Particle {
    lon: number;
    lat: number;
    age: number;
    maxAge: number;
}

// 绘制指令（WindParticleSystem 输出，渲染层消费）
export interface DrawCommand {
    prevLon: number; prevLat: number;
    lon: number;     lat: number;
    speed: number;   // 用于着色
    alpha: number;   // 生命周期透明度
}

export type Resolution = 1.0 | 0.5 | 0.25;