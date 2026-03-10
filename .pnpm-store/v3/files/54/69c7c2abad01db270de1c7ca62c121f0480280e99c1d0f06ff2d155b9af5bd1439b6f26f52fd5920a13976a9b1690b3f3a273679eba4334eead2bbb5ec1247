"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorPrimary = getColorPrimary;
exports.getPaletteColors = getPaletteColors;
exports.getPaletteColor = getPaletteColor;
exports.getThemeColors = getThemeColors;
const renderer_1 = require("../../renderer");
const themes_1 = require("../../themes");
const utils_1 = require("../../utils");
const DEFAULT_COLOR = '#FF356A';
function getColorPrimary(options) {
    var _a;
    return ((_a = options === null || options === void 0 ? void 0 : options.themeConfig) === null || _a === void 0 ? void 0 : _a.colorPrimary) || DEFAULT_COLOR;
}
function getPaletteColors(options) {
    var _a;
    const { themeConfig = {}, data } = options;
    const { colorPrimary, palette } = themeConfig;
    if (!palette || palette.length === 0) {
        return Array(((_a = data === null || data === void 0 ? void 0 : data.items) === null || _a === void 0 ? void 0 : _a.length) || 1).fill(colorPrimary || DEFAULT_COLOR);
    }
    return data.items.map((_, i) => (0, renderer_1.getPaletteColor)(palette, [i], data.items.length) || DEFAULT_COLOR);
}
function getPaletteColor(options, indexes) {
    var _a, _b, _c;
    return (0, renderer_1.getPaletteColor)((_a = options === null || options === void 0 ? void 0 : options.themeConfig) === null || _a === void 0 ? void 0 : _a.palette, indexes, (_c = (_b = options.data) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.length);
}
function getThemeColors(colors, options) {
    var _a;
    const { colorBg = ((_a = options === null || options === void 0 ? void 0 : options.themeConfig) === null || _a === void 0 ? void 0 : _a.colorBg) || 'white', colorPrimary = options ? getColorPrimary(options) : 'black', } = colors;
    return (0, themes_1.generateThemeColors)({
        colorPrimary: colorPrimary,
        isDarkMode: (0, utils_1.isDarkColor)(colorBg),
        colorBg: colorBg,
    });
}
