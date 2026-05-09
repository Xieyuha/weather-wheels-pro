import type { IWindRenderer } from './types';

export class CanvasWindRenderer implements IWindRenderer {
    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;
    private fadeOpacity: number;
    private lineWidth: number;
    constructor(
        options: { fadeOpacity: number; lineWidth: number },
    ) {
        // TODO
        this.fadeOpacity = options.fadeOpacity
        this.lineWidth = options.lineWidth
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

    beginFrame() {
        const ctx = this.ctx;
        ctx.globalCompositeOperation = 'destination-in'
        ctx.fillStyle = `rgba(0,0,0,${this.fadeOpacity})`;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.globalCompositeOperation = 'source-over';
    }
    // TODO:添加linewidth参数，从lod结构的level获得，传入
    addSegment(fromX: number, fromY: number, toX: number, toY: number,
        r: number, g: number, b: number, a: number) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
        ctx.lineWidth = this.lineWidth;
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
    }

    endFrame() {
        // Canvas 2D 不需要 flush
    }

    destroy() {
        this.canvas.remove();
    }
}
