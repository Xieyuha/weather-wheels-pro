import type { WindField } from './types';
/**
 * 双线性插值得到指定经纬度的风速
 * @param windField 风场数据
 * @param lon 纬度
 * @param lat 经度
 * @returns u,v 风速矢量分量
 */
export function sampleWind(
    windField: WindField,
    lon: number,
    lat: number
): { u: number; v: number } | null {
    const { meta, u, v } = windField;
    const { bounds, nx, ny, dx, dy } = meta;

    // 将粒子经度归一化到数据的经度系统，避免跨系统越界误判
    // 场景：视口 bounds 是 -180~180，数据是 0-360，粒子经度可能为负
    if (meta.lonRange === '0-360' && lon < 0) {
        lon += 360;
    } else if (meta.lonRange === '-180-180' && lon > 180) {
        lon -= 360;
    }

    // 越界返回 null，粒子在边界处死亡
    // la1北边界，更大
    if (lon < bounds.lo1 || lon > bounds.lo2 ||
        lat < bounds.la2 || lat > bounds.la1) {
        return null;
    }

    // 计算格点内的小数坐标
    const gx = (lon - bounds.lo1) / dx;
    const gy = (bounds.la1 - lat) / dy;

    const x0 = Math.floor(gx), x1 = Math.min(x0 + 1, nx - 1);
    const y0 = Math.floor(gy), y1 = Math.min(y0 + 1, ny - 1);
    const fx = gx - x0;
    const fy = gy - y0;

    // 双线性插值（取周围 4 个格点加权）
    const w00 = (1 - fx) * (1 - fy);
    const w10 = fx * (1 - fy);
    const w01 = (1 - fx) * fy;
    const w11 = fx * fy;

    const idx = (xi: number, yi: number) => yi * nx + xi;

    return {
        u: u[idx(x0, y0)]! * w00 + u[idx(x1, y0)]! * w10 + u[idx(x0, y1)]! * w01 + u[idx(x1, y1)]! * w11,
        v: v[idx(x0, y0)]! * w00 + v[idx(x1, y0)]! * w10 + v[idx(x0, y1)]! * w01 + v[idx(x1, y1)]! * w11,
    };
}
