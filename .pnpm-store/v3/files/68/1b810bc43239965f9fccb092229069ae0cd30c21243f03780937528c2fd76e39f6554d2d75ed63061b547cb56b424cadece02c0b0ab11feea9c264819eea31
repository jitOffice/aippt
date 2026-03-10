"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncRegistry = void 0;
const lodash_es_1 = require("lodash-es");
class SyncRegistry {
    constructor(getOptions) {
        this.getOptions = getOptions;
        this.handlers = new Map();
        // lock to prevent recursive updates
        this.isDispatching = false;
        this.isDestroyed = false;
    }
    register(path, handler, options) {
        if (!this.handlers.has(path)) {
            this.handlers.set(path, new Set());
        }
        this.handlers.get(path).add(handler);
        if (options === null || options === void 0 ? void 0 : options.immediate) {
            const currentVal = (0, lodash_es_1.get)(this.getOptions(), path);
            handler(currentVal, undefined);
        }
        return () => {
            const set = this.handlers.get(path);
            if (set) {
                set.delete(handler);
                if (set.size === 0) {
                    this.handlers.delete(path);
                }
            }
        };
    }
    trigger(path, newVal, oldVal) {
        if (this.isDestroyed || this.isDispatching) {
            if (this.isDispatching) {
                console.warn(`[SyncRegistry] Recursive update detected on ${path}. Skipped to prevent loop.`);
            }
            return;
        }
        const handlers = this.handlers.get(path);
        if (handlers) {
            this.isDispatching = true;
            try {
                handlers.forEach((fn) => fn(newVal, oldVal));
            }
            finally {
                this.isDispatching = false;
            }
        }
    }
    destroy() {
        this.isDestroyed = true;
        this.handlers.clear();
    }
}
exports.SyncRegistry = SyncRegistry;
