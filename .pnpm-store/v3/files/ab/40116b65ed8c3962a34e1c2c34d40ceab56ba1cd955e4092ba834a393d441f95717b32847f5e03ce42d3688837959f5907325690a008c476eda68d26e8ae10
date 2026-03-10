import { __awaiter } from '../node_modules/tslib/tslib.es6.js';
import { wrap } from '../node_modules/comlink/dist/esm/comlink.js';

class Supervisor {
    constructor() {
        this.worker = null;
        this.workerApi = null;
    }
    /**
     * Execute layout in worker
     */
    execute(layoutId, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.worker) {
                yield this.initWorker();
            }
            if (!this.workerApi) {
                throw new Error('Worker API not initialized');
            }
            return yield this.workerApi.execute(layoutId, data, options);
        });
    }
    /**
     * Destroy worker
     */
    destroy() {
        if (this.workerApi) {
            this.workerApi.destroy();
        }
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
            this.workerApi = null;
        }
    }
    /**
     * Initialize worker
     */
    initWorker() {
        return __awaiter(this, void 0, void 0, function* () {
            const workerPath = this.resolveWorkerPath();
            const isESM = workerPath.includes('/lib/') || workerPath.endsWith('.mjs');
            const type = isESM ? 'module' : 'classic';
            this.worker = new Worker(workerPath, { type });
            this.workerApi = wrap(this.worker);
        });
    }
    /**
     * Resolve worker script path which works in both ESM and UMD environments
     */
    resolveWorkerPath() {
        const scriptUrl = (() => {
            if (typeof document === 'undefined')
                return null;
            const currentScript = document.currentScript;
            if (currentScript === null || currentScript === void 0 ? void 0 : currentScript.src)
                return currentScript.src;
            const scripts = document.getElementsByTagName('script');
            for (let i = scripts.length - 1; i >= 0; i--) {
                const src = scripts[i].src;
                if (!src)
                    continue;
                if (src.includes('index.js') || src.includes('index.min.js')) {
                    return src;
                }
            }
            return null;
        })();
        if (scriptUrl) {
            if (scriptUrl.includes('index.js') || scriptUrl.includes('index.min.js')) {
                const asIndex = scriptUrl.replace(/index(\.min)?\.(m?js)(\?.*)?$/, 'worker.js');
                if (asIndex !== scriptUrl)
                    return asIndex;
            }
            // e.g. `.../lib/runtime/supervisor.js` -> `.../lib/worker.js`
            const asRoot = scriptUrl.replace(/\/runtime\/[^/]+\.(m?js)(\?.*)?$/, '/worker.js');
            if (asRoot !== scriptUrl)
                return asRoot;
            // Fallback: keep legacy behavior (same directory)
            const asSibling = scriptUrl.replace(/\/[^/]+\.(m?js)(\?.*)?$/, '/worker.js');
            if (asSibling !== scriptUrl)
                return asSibling;
        }
        return './worker.js';
    }
}

export { Supervisor };
//# sourceMappingURL=supervisor.js.map
