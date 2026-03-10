"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Extension = void 0;
class Extension {
    constructor() {
        this.extensions = new Map();
    }
    register(name, extension, options) {
        if (!(options === null || options === void 0 ? void 0 : options.override) && this.extensions.has(name)) {
            throw new Error(`Extension "${name}" already registered`);
        }
        this.extensions.set(name, extension);
    }
    get(name) {
        return this.extensions.get(name);
    }
    has(name) {
        return this.extensions.has(name);
    }
    getAll() {
        return this.extensions;
    }
    forEach(callback) {
        this.extensions.forEach((extension, name) => {
            callback(extension, name);
        });
    }
    [Symbol.iterator]() {
        return this.extensions.entries();
    }
    unregister(name) {
        return this.extensions.delete(name);
    }
    destroy() {
        this.extensions.forEach((extension) => {
            if (extension && typeof extension.dispose === 'function') {
                extension.dispose();
            }
        });
        this.extensions.clear();
    }
}
exports.Extension = Extension;
