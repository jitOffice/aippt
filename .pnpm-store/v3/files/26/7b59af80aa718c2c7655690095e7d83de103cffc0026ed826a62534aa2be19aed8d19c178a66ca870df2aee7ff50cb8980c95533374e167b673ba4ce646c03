"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasColor = hasColor;
exports.isDarkColor = isDarkColor;
const culori_1 = require("culori");
function hasColor(fill) {
    if (!fill)
        return false;
    const normalizedFill = fill.trim().toLowerCase();
    if (normalizedFill === 'none' ||
        normalizedFill === 'transparent' ||
        normalizedFill === '') {
        return false;
    }
    return true;
}
function isDarkColor(color) {
    const c = (0, culori_1.parse)(color);
    if (!c)
        return false;
    const luminance = (0, culori_1.wcagLuminance)(c);
    return luminance < 0.5;
}
