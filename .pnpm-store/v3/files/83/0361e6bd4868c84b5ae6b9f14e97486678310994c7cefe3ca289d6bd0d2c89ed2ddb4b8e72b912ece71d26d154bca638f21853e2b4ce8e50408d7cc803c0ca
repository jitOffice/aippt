interface ClickHandlerOptions {
    delay?: number;
    dragThreshold?: number;
}
export declare class ClickHandler {
    private element;
    private delay;
    private dragThreshold;
    private clickTimer;
    private singleClickCallback;
    private doubleClickCallback;
    private pointerId;
    private startX;
    private startY;
    private skipClick;
    private dragged;
    constructor(element: SVGSVGElement, options?: ClickHandlerOptions);
    private init;
    private handleClick;
    private handleDoubleClick;
    private handlePointerDown;
    private handlePointerMove;
    private handlePointerUp;
    onClick(callback: (e: MouseEvent) => void): this;
    onDoubleClick(callback: (e: MouseEvent) => void): this;
    destroy(): void;
}
export {};
