import type { WindField } from '@/services/wind/types';
import jsonRaw from '@/mocks/wind.json';
interface GfsRecord {
    header: {
        nx: number;
        ny: number;
        lo1: number;
        la1: number;
        lo2: number;
        la2: number;
        dx: number;
        dy: number;
        refTime: string;
        parameterNumber: number;
    };
    data: number[];
}
// const res = await fetch('/wind/wind.json');
// const records = await res.json() as GfsRecord[];
const records = jsonRaw as GfsRecord[];


const u = new Float32Array(records[0]!.data);
const v = new Float32Array(records[1]!.data);

console.assert(records[0]!.header.nx === records[1]!.header.nx, 'U/V grid mismatch');
console.assert(records[0]!.header.ny === records[1]!.header.ny, 'U/V grid mismatch');
console.assert(records[0]!.header.lo1 === records[1]!.header.lo1, 'U/V grid mismatch');

const windField: WindField = {
    meta: {
        bounds: {
            lo1: records[0]!.header.lo1,
            la1: records[0]!.header.la1,
            lo2: records[0]!.header.lo2,
            la2: records[0]!.header.la2,
        },
        nx: records[0]!.header.nx,
        ny: records[0]!.header.ny,
        dx: records[0]!.header.dx,
        dy: records[0]!.header.dy,
        timestamp: records[0]!.header.refTime,
        lonRange: records[0]!.header.lo1 < 0 ? '-180-180' : '0-360',
    },
    u,
    v,
};

// 降采样

// 输出 6 个文件：wind_0.25.bin / wind_0.5.bin / wind_1.0.bin
// 每个一个 header.json + data.bin（或者 header 嵌在 bin 头部）