import gfsJson from '@/mocks/wind.json';
import type { WindField } from './types';

interface GfsRecord {
    header: {
        nx: number; ny: number;
        lo1: number; la1: number; lo2: number; la2: number;
        dx: number; dy: number;
        refTime: string;
        parameterNumber: number;
    };
    data: number[];
}

class WindService {
    async getWindData(): Promise<WindField> {
        const records = gfsJson as unknown as GfsRecord[];
        const u = records.find(r => r.header.parameterNumber === 2)!;
        const v = records.find(r => r.header.parameterNumber === 3)!;
        const h = u.header;
        return {
            meta: {
                bounds: { lo1: h.lo1, la1: h.la1, lo2: h.lo2, la2: h.la2 },
                nx: h.nx, ny: h.ny, dx: h.dx, dy: h.dy,
                timestamp: h.refTime,
                lonRange: h.lo1 < 0 ? '-180-180' : '0-360',
            },
            u: new Float32Array(u.data) as any,
            v: new Float32Array(v.data) as any,
        };
    }
}

export default WindService;