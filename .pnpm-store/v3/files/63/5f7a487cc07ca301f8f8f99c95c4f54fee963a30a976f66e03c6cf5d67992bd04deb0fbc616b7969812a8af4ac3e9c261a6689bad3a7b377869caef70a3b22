"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginManager = void 0;
const utils_1 = require("../utils");
class PluginManager {
    constructor() {
        this.extensions = new utils_1.Extension();
    }
    init(options, plugins = []) {
        Object.assign(this, options);
        plugins.forEach((plugin) => {
            this.registerPlugin(plugin);
        });
    }
    getPlugin(name) {
        return this.extensions.get(name);
    }
    getPlugins() {
        return this.extensions.getAll();
    }
    registerPlugin(plugin) {
        this.extensions.register(plugin.name, plugin);
        const pluginInitOptions = {
            emitter: this.emitter,
            editor: this.editor,
            commander: this.commander,
            plugin: this,
            state: this.state,
        };
        plugin.init(pluginInitOptions);
        this.emitter.emit('plugin:registered', plugin);
    }
    unregisterPlugin(name) {
        const plugin = this.extensions.get(name);
        if (plugin) {
            plugin.destroy();
            this.extensions.unregister(name);
            this.emitter.emit('plugin:unregistered', plugin);
        }
    }
    destroy() {
        this.extensions.getAll().forEach((plugin) => {
            this.unregisterPlugin(plugin.name);
            this.emitter.emit('plugin:destroyed', plugin);
        });
        this.extensions.destroy();
    }
}
exports.PluginManager = PluginManager;
