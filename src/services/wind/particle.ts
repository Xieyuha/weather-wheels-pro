import type { WindField, WindBounds, Particle } from './types';
import { sampleWind } from './interpolate';

const METERS_PER_DEGREE = 111000;

/**
 * 随机撒点
 * @param bounds 风场粒子边界
 * @returns 初始化的单个粒子
 */
export function createParticle(bounds: WindBounds): Particle {
    return {
        lon: bounds.lo1 + Math.random() * (bounds.lo2 - bounds.lo1),
        lat: bounds.la2 + Math.random() * (bounds.la1 - bounds.la2),
        age: Math.floor(Math.random() * 90),
        maxAge: 30 + Math.floor(Math.random() * 60),
    };
}

/**
 * 粒子移动
 * @param p 待更新的粒子
 * @param windField 风场数据
 * @param speedFactor m/s → 度/帧 的换算系数
 * @returns 粒子存活返回 true，越界或寿命耗尽返回 false
 * @todo speedFactor需要根据地理尺度动态调整
 */
export function stepParticle(
    p: Particle,
    windField: WindField,
    speedFactor = 0.008
): boolean {
    const wind = sampleWind(windField, p.lon, p.lat);
    if (!wind || p.age >= p.maxAge) return false;
    const cosLat = Math.cos((p.lat * Math.PI) / 180);
    p.lon += (wind.u * speedFactor) / (METERS_PER_DEGREE * cosLat);
    p.lat += (wind.v * speedFactor) / METERS_PER_DEGREE;
    p.age++;
    return true;
}
