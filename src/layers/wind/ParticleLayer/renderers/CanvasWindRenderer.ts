import type { IWindRenderer } from './types';

export class CanvasWindRenderer implements IWindRenderer {
    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;
    private fadeOpacity: number;
    private lineWidth: number;
    private buckets: number[][] = [[], [], [], []]; // 4个桶，根据alpha分级
    private strokeStyles!:[string, string, string, string];
    constructor(
        options: { fadeOpacity: number; lineWidth: number },
    ) {
        // TODO
        this.fadeOpacity = options.fadeOpacity
        this.lineWidth = options.lineWidth
        const make = (i: number) => `rgba(255,255,255,${this.fadeOpacity * (i + 1) / 4})`
        this.strokeStyles = [make(0), make(1), make(2), make(3)]
    }

    init(container: HTMLElement, width: number, height: number) {
        this.canvas = document.createElement('canvas')
        if (!this.canvas) {
            throw new Error('Failed to create canvas element');
        }
        Object.assign(this.canvas.style, {
            position: 'absolute', top: '0', left: '0',
            pointerEvents: 'none',
        })
        this.canvas.width = width;
        this.canvas.height = height;
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d')!;
        if (!this.ctx) {
            throw new Error('Failed to get 2D context');
        }

    }

    resize(w: number, h: number) {
        this.canvas.width = w;
        this.canvas.height = h;
    }

    updateOptions(options: { fadeOpacity: number; lineWidth: number }) {
        this.fadeOpacity = options.fadeOpacity
        this.lineWidth = options.lineWidth
        const make = (i: number) => `rgba(255,255,255,${this.fadeOpacity * (i + 1) / 4})`
        this.strokeStyles = [make(0), make(1), make(2), make(3)]
    }

    beginFrame() {
        const ctx = this.ctx;
        ctx.globalCompositeOperation = 'destination-in'
        ctx.fillStyle = `rgba(0,0,0,${this.fadeOpacity})`;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        // 清空桶?如果中断就把这里删除
        this.buckets.forEach(bucket => bucket.length = 0)
    }
    // TODO:添加linewidth参数，从lod结构的level获得，传入
    // fromX: number, fromY: number, toX: number, toY: number,
    //   r: number, g: number, b: number, a: number
    addSegment(fromX: number, fromY: number, toX: number, toY: number,
        r: number, g: number, b: number, a: number) {
        const ALPHA_BUCKETS = 4
        
        // 根据alpha的值给定不同的key
        // 根据最小值划分,然后放进篮子
        // 然后按照key分类，把坐标存进数组，遍历4次
        // canvas draw四次
        const key = Math.min(3, Math.floor(a / 0.35 * 4))
        this.buckets[key]!.push(fromX, fromY, toX, toY)



    }

    endFrame() {
        // Canvas 2D 不需要 flush
        const ctx = this.ctx;
        ctx.lineWidth = this.lineWidth;
        for (const [i, bucket] of this.buckets.entries()) {
            ctx.strokeStyle = this.strokeStyles[i]!;
            ctx.beginPath();
            for (let j = 0; j < bucket.length; j += 4) {
                ctx.moveTo(bucket[j]!, bucket[j + 1]!);
                ctx.lineTo(bucket[j + 2]!, bucket[j + 3]!);
            }
            ctx.stroke();
        }
    }

    destroy() {
        this.canvas.remove();
    }
}
