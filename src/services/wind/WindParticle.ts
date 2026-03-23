import type { WindField } from './types';
import { sampleWind } from './interpolate';

export interface Particle {
    lon: number;
    lat: number;
    age: number;
    maxAge: number;
}
// 随机撒点
export function createParticle(bounds: WindField['meta']['bounds']): Particle {
    return {
        lon: bounds.lo1 + Math.random() * (bounds.lo2 - bounds.lo1),
        lat: bounds.la2 + Math.random() * (bounds.la1 - bounds.la2),
        age: Math.floor(Math.random() * 40),   // 随机初始年龄，避免同步闪烁
        maxAge: 30 + Math.floor(Math.random() * 60),
    };
}
// 粒子移动
export function stepParticle(
    p: Particle,
    windField: WindField,
    // 包含时间步长、缩放系数两个概念，todo：手动根据效果调整
    speedFactor = 0.008   // 粒子移动速度/每帧模拟多少秒的风场时间
): boolean {
    const wind = sampleWind(windField, p.lon, p.lat);

    if (!wind || p.age >= p.maxAge) return false; // 刷新

    // 单位换算：m/s → 度/帧
    // 1° 纬度 ≈ 111km, 1° 经度 ≈ 111km * cos(lat)
    const cosLat = Math.cos((p.lat * Math.PI) / 180);
    p.lon += (wind.u * speedFactor) / (111000 * cosLat);
    p.lat += (wind.v * speedFactor) / 111000;
    p.age++;

    return true;
}
