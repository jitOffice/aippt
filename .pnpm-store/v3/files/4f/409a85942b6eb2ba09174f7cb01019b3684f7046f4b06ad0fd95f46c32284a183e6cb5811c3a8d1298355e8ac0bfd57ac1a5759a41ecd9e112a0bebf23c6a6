import type { ParsedInfographicOptions } from '../options';
import type { IEventEmitter } from '../types';
import { InteractionManager } from './managers';
import type { ICommandManager, IEditor, IPluginManager, IStateManager, ISyncRegistry, SyncHandler } from './types';
export declare class Editor implements IEditor {
    private emitter;
    private document;
    private options;
    state: IStateManager;
    commander: ICommandManager;
    plugin: IPluginManager;
    interaction: InteractionManager;
    syncRegistry: ISyncRegistry;
    constructor(emitter: IEventEmitter, document: SVGSVGElement, options: ParsedInfographicOptions);
    registerSync(path: string, handler: SyncHandler, options?: {
        immediate?: boolean;
    }): () => void;
    getDocument(): SVGSVGElement;
    destroy(): void;
}
