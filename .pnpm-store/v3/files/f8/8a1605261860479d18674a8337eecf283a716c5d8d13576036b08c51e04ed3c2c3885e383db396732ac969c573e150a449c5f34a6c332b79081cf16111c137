import type { InfographicOptionPath } from '../../options';
import { ISyncRegistry, SyncHandler } from '../types';
type OptionsGetter = () => any;
export declare class SyncRegistry implements ISyncRegistry {
    private getOptions;
    private handlers;
    private isDispatching;
    private isDestroyed;
    constructor(getOptions: OptionsGetter);
    register(path: InfographicOptionPath | (string & {}), handler: SyncHandler, options?: {
        immediate?: boolean;
    }): () => void;
    trigger(path: string, newVal: any, oldVal: any): void;
    destroy(): void;
}
export {};
