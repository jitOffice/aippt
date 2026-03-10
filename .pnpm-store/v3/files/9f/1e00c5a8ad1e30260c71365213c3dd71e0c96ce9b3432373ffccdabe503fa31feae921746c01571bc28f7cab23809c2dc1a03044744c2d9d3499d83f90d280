import type { IPlugin, IPluginManager, PluginManagerInitOptions } from '../types';
export declare class PluginManager implements IPluginManager {
    private extensions;
    private emitter;
    private editor;
    private commander;
    private state;
    init(options: PluginManagerInitOptions, plugins?: IPlugin[]): void;
    getPlugin<T extends IPlugin>(name: string): T | undefined;
    getPlugins(): ReadonlyMap<string, IPlugin>;
    registerPlugin(plugin: IPlugin): void;
    unregisterPlugin(name: string): void;
    destroy(): void;
}
