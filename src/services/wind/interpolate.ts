import type { WindField } from './types';
/**
 * @description: 双线性插值得到指定经纬度的风速
 * @params windField: WindField
 * @params lon: number
 * @params lat: number
 * @returns u: number; v: number  | null
**/
export function sampleWind(
    windField: WindField,
    lon: number,
    lat: number
): { u: number; v: number } | null {
    const { meta, u, v } = windField;
    const { bounds, nx, ny, dx, dy } = meta;

    // 越界返回 null，粒子在边界处死亡
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
