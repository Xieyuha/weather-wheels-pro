// 返回 [r, g, b] 数组而不是 CSS 字符串，方便 Canvas 和 WebGL 共用
// css: return `rgba(${r},${g},${b},${alpha})`;

export function speedToRGB(speed: number): [number, number, number] {
    try {
        // [速度,r,g,b]
        const levels: [number, number, number, number][] = [
            [5, 0, 0, 255],
            [6, 0, 200, 255],
            [7, 0, 255, 150],
            [8, 180, 255, 0],
            [9, 255, 150, 0],
            [10, 255, 0, 0],
        ];

        let i = levels.findIndex(l => speed < l[0]);
        // 处理左右边界
        if (i === -1) i = levels.length - 1;
        if (i === 0) i = 1;

        const [s0, r0, g0, b0] = levels[i - 1]!;
        const [s1, r1, g1, b1] = levels[i]!;
        const t = (speed - s0) / (s1 - s0);

        const r = Math.round(r0 + (r1 - r0) * t);
        const g = Math.round(g0 + (g1 - g0) * t);
        const b = Math.round(b0 + (b1 - b0) * t);
        return [r, g, b]
    }
    catch (e) {
        throw new Error('Not implemented');
    }

}
