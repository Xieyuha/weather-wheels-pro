export interface IWindRenderer {
    init(container: HTMLElement, width: number, height: number): void;
    resize(width: number, height: number): void;
    beginFrame(): void,
    addSegment(
        fromX: number, fromY: number,
        toX: number, toY: number,
        r: number, g: number, b: number, a: number,
    ): void;
    endFrame(): void,
    updateOptions(options: { fadeOpacity: number; lineWidth: number }): void,
    destroy(): void
}