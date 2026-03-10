"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreSyncPlugin = void 0;
const utils_1 = require("../../utils");
const base_1 = require("./base");
class CoreSyncPlugin extends base_1.Plugin {
    constructor() {
        super(...arguments);
        this.name = 'core-sync';
        this.unregisters = [];
    }
    init(options) {
        super.init(options);
        const svg = this.editor.getDocument();
        // viewBox Sync
        this.unregisters.push(this.editor.registerSync('viewBox', (val) => {
            if (val) {
                svg.setAttribute('viewBox', val);
            }
            else {
                svg.removeAttribute('viewBox');
            }
        }, { immediate: true }));
        // padding Sync
        this.unregisters.push(this.editor.registerSync('padding', (val) => {
            if (val !== undefined)
                (0, utils_1.setSVGPadding)(svg, (0, utils_1.parsePadding)(val));
        }, { immediate: true }));
    }
    destroy() {
        this.unregisters.forEach((fn) => fn());
    }
}
exports.CoreSyncPlugin = CoreSyncPlugin;
