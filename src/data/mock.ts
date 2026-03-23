// scripts/generateMockWind.ts
import type { WindField } from "@/services/wind/types";

function generateMockWindField(options: {
  bounds: { lo1: number; la1: number; lo2: number; la2: number };
  nx: number;
  ny: number;
  baseSpeed: number;    // 基础风速 m/s
  direction: number;    // 主风向（度，0=北，90=东）
}): WindField {
  const { bounds, nx, ny, baseSpeed, direction } = options;
  const rad = (direction * Math.PI) / 180;
  
  // 基础 U/V 分量
  const baseU = baseSpeed * Math.sin(rad);
  const baseV = baseSpeed * Math.cos(rad);

  const u: number[] = [];
  const v: number[] = [];

  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) {
      // 加扰动，模拟自然风场的不均匀性
      const noise = Math.sin(x * 0.3) * Math.cos(y * 0.4) * 2;
      u.push(baseU + noise);
      v.push(baseV + noise * 0.5);
    }
  }

  return {
    meta: {
      bounds,
      nx, ny,
      dx: (bounds.lo2 - bounds.lo1) / (nx - 1),
      dy: (bounds.la1 - bounds.la2) / (ny - 1),
      timestamp: new Date().toISOString(),
    },
    u, v,
  };
}
// # 生成北京地区 50x50 格点，西北风 8m/s 的 mock 数据
// npx ts-node scripts/generateMockWind.ts \
//   --bounds "115,41,117,39" --nx 50 --ny 50 \
//   --speed 8 --direction 315 \
//   --output src/mocks/wind_beijing.json
