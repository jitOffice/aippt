import type { ParsedInfographicOptions, UpdatableInfographicOptions } from '../../options';
import type { Element, IEventEmitter, ItemDatum } from '../../types';
import type { ElementProps, ICommandManager, IEditor, IStateManager, StateManagerInitOptions } from '../types';
export declare class StateManager implements IStateManager {
    emitter: IEventEmitter;
    editor: IEditor;
    command: ICommandManager;
    options: ParsedInfographicOptions;
    init(options: StateManagerInitOptions): void;
    addItemDatum(indexes: number[], datum: ItemDatum | ItemDatum[]): void;
    updateItemDatum(indexes: number[], datum: Partial<ItemDatum>): void;
    removeItemDatum(indexes: number[], count?: number): void;
    updateData(key: string, value: any): void;
    updateElement(element: Element, props: Partial<ElementProps>): void;
    updateOptions(options: UpdatableInfographicOptions, execOptions?: {
        bubbleUp?: boolean;
    }): void;
    getOptions(): ParsedInfographicOptions;
    /**
     * 不包含文本内容、图标类型更新
     */
    private updateBuiltInElement;
    destroy(): void;
}
