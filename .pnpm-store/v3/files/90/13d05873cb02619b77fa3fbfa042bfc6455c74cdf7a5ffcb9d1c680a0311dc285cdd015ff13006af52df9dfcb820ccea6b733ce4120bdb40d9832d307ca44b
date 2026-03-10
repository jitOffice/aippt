import { getPaletteColor as _getPaletteColor } from '../../renderer/index.js';
import { generateThemeColors } from '../../themes/index.js';
import { isDarkColor } from '../../utils/index.js';
const DEFAULT_COLOR = '#FF356A';
export function getColorPrimary(options) {
    var _a;
    return ((_a = options === null || options === void 0 ? void 0 : options.themeConfig) === null || _a === void 0 ? void 0 : _a.colorPrimary) || DEFAULT_COLOR;
}
export function getPaletteColors(options) {
    var _a;
    const { themeConfig = {}, data } = options;
    const { colorPrimary, palette } = themeConfig;
    if (!palette || palette.length === 0) {
        return Array(((_a = data === null || data === void 0 ? void 0 : data.items) === null || _a === void 0 ? void 0 : _a.length) || 1).fill(colorPrimary || DEFAULT_COLOR);
    }
    return data.items.map((_, i) => _getPaletteColor(palette, [i], data.items.length) || DEFAULT_COLOR);
}
export function getPaletteColor(options, indexes) {
    var _a, _b, _c;
    return _getPaletteColor((_a = options === null || options === void 0 ? void 0 : options.themeConfig) === null || _a === void 0 ? void 0 : _a.palette, indexes, (_c = (_b = options.data) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.length);
}
export function getThemeColors(colors, options) {
    var _a;
    const { colorBg = ((_a = options === null || options === void 0 ? void 0 : options.themeConfig) === null || _a === void 0 ? void 0 : _a.colorBg) || 'white', colorPrimary = options ? getColorPrimary(options) : 'black', } = colors;
    return generateThemeColors({
        colorPrimary: colorPrimary,
        isDarkMode: isDarkColor(colorBg),
        colorBg: colorBg,
    });
}
