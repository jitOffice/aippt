import type { IInteraction, InteractionInitOptions } from '../types';
import { Interaction } from './base';
export declare class BrushSelect extends Interaction implements IInteraction {
    name: string;
    private brush?;
    private startPoint?;
    private pointerId?;
    private shiftKey;
    private completeInteraction?;
    private dragging;
    private dragThreshold;
    init(options: InteractionInitOptions): void;
    destroy(): void;
    private handleStart;
    private handleMove;
    private handleEnd;
    private ensureBrush;
    private updateBrush;
    private clearBrush;
    private collectSelection;
    private hasElementAtStart;
}
