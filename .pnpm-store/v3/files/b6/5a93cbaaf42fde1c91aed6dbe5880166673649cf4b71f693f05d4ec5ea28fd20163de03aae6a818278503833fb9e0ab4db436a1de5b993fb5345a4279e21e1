"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = void 0;
const managers_1 = require("./managers");
const sync_registry_1 = require("./managers/sync-registry");
const plugins_1 = require("./plugins");
class Editor {
    constructor(emitter, document, options) {
        this.emitter = emitter;
        this.document = document;
        this.options = options;
        if (!document.isConnected) {
            throw new Error('The provided document is not connected to the DOM.');
        }
        document.style.userSelect = 'none';
        const commander = new managers_1.CommandManager();
        const state = new managers_1.StateManager();
        const plugin = new managers_1.PluginManager();
        const interaction = new managers_1.InteractionManager();
        const syncRegistry = new sync_registry_1.SyncRegistry(() => state.getOptions());
        this.commander = commander;
        this.state = state;
        this.plugin = plugin;
        this.interaction = interaction;
        this.syncRegistry = syncRegistry;
        commander.init({ state, emitter });
        state.init({
            emitter,
            editor: this,
            commander,
            options,
        });
        // Load core plugin: CoreSyncPlugin (handles viewBox/padding sync)
        const corePlugin = new plugins_1.CoreSyncPlugin();
        const userPlugins = options.plugins || [];
        plugin.init({
            emitter,
            editor: this,
            commander,
            state,
        }, [corePlugin, ...userPlugins]);
        interaction.init({
            emitter,
            editor: this,
            commander,
            state,
            interactions: options.interactions,
        });
    }
    registerSync(path, handler, options) {
        return this.syncRegistry.register(path, handler, options);
    }
    getDocument() {
        return this.document;
    }
    destroy() {
        this.document.style.userSelect = '';
        this.interaction.destroy();
        this.plugin.destroy();
        this.commander.destroy();
        this.state.destroy();
        this.syncRegistry.destroy();
    }
}
exports.Editor = Editor;
