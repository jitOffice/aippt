import { getPalette } from './registry.js';
export const getPaletteColor = (args = [], indexes, total) => {
    var _a;
    const palette = typeof args === 'string' ? getPalette(args) || [] : args;
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
