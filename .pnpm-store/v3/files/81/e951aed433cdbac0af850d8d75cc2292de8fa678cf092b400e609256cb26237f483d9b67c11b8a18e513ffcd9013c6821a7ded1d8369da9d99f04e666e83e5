"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaletteColor = void 0;
const registry_1 = require("./registry");
const getPaletteColor = (args = [], indexes, total) => {
    var _a;
    const palette = typeof args === 'string' ? (0, registry_1.getPalette)(args) || [] : args;
    const index = (_a = indexes[0]) !== null && _a !== void 0 ? _a : 0;
    if (typeof palette === 'function') {
        const ratio = total ? index / total : 0;
        return palette(ratio, index, total !== null && total !== void 0 ? total : 0);
    }
    if (Array.isArray(palette)) {
        if (palette.length === 0)
            return;
        return palette[index % palette.length];
    }
};
exports.getPaletteColor = getPaletteColor;
