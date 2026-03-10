import type { IInteraction, InteractionInitOptions } from '../types';
import { Interaction } from './base';
export interface ZoomWheelOptions {
    minViewBoxSize?: number;
    maxViewBoxSize?: number;
}
export declare class ZoomWheel extends Interaction implements IInteraction {
    name: string;
    private minViewBoxSize;
    private maxViewBoxSize;
    constructor(options?: ZoomWheelOptions);
    private initialViewBox;
    private handleKeyUp;
    private wheelListener;
    private getMousePoint;
    private getCenterPoint;
    private shouldZoom;
    init(options: InteractionInitOptions): void;
    destroy(): void;
}
