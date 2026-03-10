import type { IPlugin, PluginInitOptions } from '../types';
import { Plugin } from './base';
export interface ResetViewBoxOptions {
    style?: Partial<CSSStyleDeclaration>;
    className?: string;
    getContainer?: HTMLElement | (() => HTMLElement);
}
export declare class ResetViewBox extends Plugin implements IPlugin {
    private options?;
    name: string;
    private originViewBox;
    private resetButton?;
    private viewBoxChanged;
    private unregisterSync?;
    constructor(options?: ResetViewBoxOptions | undefined);
    init(options: PluginInitOptions): void;
    destroy(): void;
    private handleResize;
    private updateOriginViewBox;
    private handleViewBoxChange;
    protected getOrCreateResetButton: () => HTMLButtonElement;
    /** Get CSS transform scale of an element */
    private getTransformScale;
    /** Find the nearest stable overflow container */
    private findStableContainer;
    private placeButton;
    private updatePosition;
    private resetViewBox;
    private showButton;
    private hideButton;
    private removeButton;
    private ensureButtonStyle;
}
