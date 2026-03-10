import { IInteraction, InteractionInitOptions, KeyCode } from '../types';
import { Interaction } from './base';
export interface DragCanvasOptions {
    trigger?: KeyCode[];
}
export declare class DragCanvas extends Interaction implements IInteraction {
    name: string;
    /**
     * 触发交互的按键代码。
     * 参考标准的 KeyboardEvent.code 值：
     * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
     * @default ['Space']
     */
    trigger: KeyCode[];
    constructor(options?: DragCanvasOptions);
    private isTriggerPressed;
    private pointerId?;
    private startPoint?;
    private document;
    private startViewBoxString?;
    private completeInteraction?;
    private isHovering;
    init(options: InteractionInitOptions): void;
    destroy(): void;
    private handleKeyDown;
    private handlePointerDown;
    private handlePointerMove;
    private handlePointerUp;
    private handleKeyUp;
    private stopDrag;
    private setCursor;
    private handleBlur;
    private onMouseEnter;
    private onMouseLeave;
}
