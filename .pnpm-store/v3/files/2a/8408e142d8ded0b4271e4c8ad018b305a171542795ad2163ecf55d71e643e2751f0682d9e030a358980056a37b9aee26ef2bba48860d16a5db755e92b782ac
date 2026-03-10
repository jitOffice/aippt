"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_FONT = void 0;
exports.getFont = getFont;
exports.getFonts = getFonts;
exports.setDefaultFont = setDefaultFont;
exports.registerFont = registerFont;
exports.unregisterFont = unregisterFont;
const font_1 = require("../../utils/font");
const FONT_REGISTRY = new Map();
exports.DEFAULT_FONT = 'Alibaba PuHuiTi';
function getFont(font) {
    const families = (0, font_1.splitFontFamily)(font);
    for (const family of families) {
        const fontObj = FONT_REGISTRY.get((0, font_1.decodeFontFamily)(family));
        if (fontObj)
            return fontObj;
    }
    return null;
}
function getFonts() {
    return Array.from(FONT_REGISTRY.values());
}
function setDefaultFont(font) {
    exports.DEFAULT_FONT = (0, font_1.encodeFontFamily)(font);
}
/**
 * 注册自定义字体
 * @param font - 字体配置
 * @returns 注册后的字体配置
 * @example
 * ```js
 * registerFont({
 *  font: 'Alibaba PuHuiTi',
 *  name: '阿里巴巴普惠体',
 *  url: {
 *    regular: 'https://assets.antv.antgroup.com/AlibabaPuHuiTi-Regular/result.css'
 *  }
 *})
 * ```
 * @description
 * 字体准备说明：https://chinese-font.netlify.app/zh-cn/post/simple_tutorial
 */
function registerFont(font) {
    const f = Object.assign({}, font);
    FONT_REGISTRY.set(f.fontFamily, f);
    f.fontFamily = (0, font_1.encodeFontFamily)(f.fontFamily);
    return f;
}
function unregisterFont(font) {
    const fontObj = getFont(font);
    if (!fontObj)
        return null;
    FONT_REGISTRY.delete((0, font_1.decodeFontFamily)(fontObj.fontFamily));
    return fontObj;
}
