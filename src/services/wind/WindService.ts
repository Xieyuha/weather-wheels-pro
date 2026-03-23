// import mock 数据
import mockWindData from '@/mocks/wind_beijing.json';
import type { WindField } from './types';

class WindService {
    async getWindData(): Promise<WindField> {
        return mockWindData;
    }
}

export default WindService;