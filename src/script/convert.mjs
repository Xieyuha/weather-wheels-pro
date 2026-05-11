// scripts/convert-wind.mjs
import { readFileSync, writeFileSync } from 'fs';

const raw = JSON.parse(readFileSync('./src/mocks/wind_0.25deg.json', 'utf-8'));

const u = new Float32Array(raw[0].data);
const v = new Float32Array(raw[1].data);
const h = raw[0].header;

function downsample(field, nx, ny, factor) {
    const newNx = Math.floor(nx / factor);
    const newNy = Math.floor(ny / factor);
    const out = new Float32Array(newNx * newNy);
    for (let iy = 0; iy < newNy; iy++) {
        for (let ix = 0; ix < newNx; ix++) {
            out[iy * newNx + ix] = field[iy * factor * nx + ix * factor];
        }
    }
    return { data: out, nx: newNx, ny: newNy };
}

const levels = [
    { resolution: 0.5,  factor: 2 },
    { resolution: 1.0,  factor: 4 },
];

for (const { resolution, factor } of levels) {
    const su = downsample(u, h.nx, h.ny, factor);
    const sv = downsample(v, h.nx, h.ny, factor);
    const header = { ...h, nx: su.nx, ny: su.ny, dx: resolution, dy: resolution };
    const output = [
        { header: { ...header, parameterNumber: 2 }, data: Array.from(su.data) },
        { header: { ...header, parameterNumber: 3 }, data: Array.from(sv.data) },
    ];
    const path = `./src/mocks/wind_${resolution}deg.json`;
    writeFileSync(path, JSON.stringify(output));
    console.log(`[done] ${path}  nx=${su.nx} ny=${su.ny}`);
}