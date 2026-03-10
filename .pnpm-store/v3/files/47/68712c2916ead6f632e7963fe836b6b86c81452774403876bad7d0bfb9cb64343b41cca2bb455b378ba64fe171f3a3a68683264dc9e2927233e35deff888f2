declare const create: (dom: HTMLElement) => {
    dom: HTMLElement;
    moved: boolean;
    mousedown: boolean;
    handleMouseMove(e: MouseEvent): void;
    handleMouseDown(e: MouseEvent): void;
    handleClear(e: MouseEvent): void;
    cb: ((deltaX: number, deltaY: number) => void) | null;
    init(map: HTMLElement, cb: (deltaX: number, deltaY: number) => void): void;
    destory(map: HTMLElement): void;
    clear(): void;
};
declare const LinkDragMoveHelper: {
    create: (dom: HTMLElement) => {
        dom: HTMLElement;
        moved: boolean;
        mousedown: boolean;
        handleMouseMove(e: MouseEvent): void;
        handleMouseDown(e: MouseEvent): void;
        handleClear(e: MouseEvent): void;
        cb: ((deltaX: number, deltaY: number) => void) | null;
        init(map: HTMLElement, cb: (deltaX: number, deltaY: number) => void): void;
        destory(map: HTMLElement): void;
        clear(): void;
    };
};
export type LinkDragMoveHelperInstance = ReturnType<typeof create>;
export default LinkDragMoveHelper;
