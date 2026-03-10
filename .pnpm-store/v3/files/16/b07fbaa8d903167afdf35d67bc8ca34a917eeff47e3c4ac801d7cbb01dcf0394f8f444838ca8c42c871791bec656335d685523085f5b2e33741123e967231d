import type { IInteraction, IInteractionManager, InteractionManagerInitOptions, Selection, SelectMode } from '../types';
export declare class InteractionManager implements IInteractionManager {
    private extensions;
    private emitter;
    private editor;
    private commander;
    private state;
    private interactions;
    private active;
    private running;
    private concurrentInteractions;
    private selection;
    init(options: InteractionManagerInitOptions): void;
    isActive(): boolean;
    select(items: Selection, mode: SelectMode): void;
    getSelection(): import("../../types").Element[];
    isSelected(item: Selection[number]): boolean;
    clearSelection(): void;
    private handleClick;
    private activate;
    private deactivate;
    /**
     * 执行互斥交互操作（同一时间只能有一个互斥交互在进行）
     */
    executeExclusiveInteraction(instance: IInteraction, callback: () => Promise<void>): Promise<void>;
    /**
     * 执行协同交互操作（允许多个协同交互同时进行）
     */
    executeConcurrentInteraction(instance: IInteraction, callback: () => Promise<void>): Promise<void>;
    private getOrCreateTransientContainer;
    appendTransientElement<T extends SVGElement>(element: T): T;
    destroy(): void;
}
