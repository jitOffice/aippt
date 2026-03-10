import { parsePadding, setSVGPadding } from '../../utils/index.js';
import { Plugin } from './base.js';
export class CoreSyncPlugin extends Plugin {
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
                setSVGPadding(svg, parsePadding(val));
        }, { immediate: true }));
    }
    destroy() {
        this.unregisters.forEach((fn) => fn());
    }
}
