"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFontExtendFactor = void 0;
exports.measureText = measureText;
const measury_1 = require("measury");
const _851tegakizatsu_Regular_1 = __importDefault(require("measury/fonts/851tegakizatsu-Regular"));
const AlibabaPuHuiTi_Regular_1 = __importDefault(require("measury/fonts/AlibabaPuHuiTi-Regular"));
const Arial_Regular_1 = __importDefault(require("measury/fonts/Arial-Regular"));
const LXGWWenKai_Regular_1 = __importDefault(require("measury/fonts/LXGWWenKai-Regular"));
const SourceHanSans_Regular_1 = __importDefault(require("measury/fonts/SourceHanSans-Regular"));
const SourceHanSerif_Regular_1 = __importDefault(require("measury/fonts/SourceHanSerif-Regular"));
const renderer_1 = require("../renderer");
const font_1 = require("./font");
let FONT_EXTEND_FACTOR = 1.015;
const setFontExtendFactor = (factor) => {
    FONT_EXTEND_FACTOR = factor;
};
exports.setFontExtendFactor = setFontExtendFactor;
(0, measury_1.registerFont)(AlibabaPuHuiTi_Regular_1.default);
// Lazy-register extra measury fonts on first use (SSR only needs glyph data).
const EXTRA_MEASURY_FONTS = {
    '851tegakizatsu': _851tegakizatsu_Regular_1.default,
    Arial: Arial_Regular_1.default,
    'LXGW WenKai': LXGWWenKai_Regular_1.default,
    'Source Han Sans': SourceHanSans_Regular_1.default,
    'Source Han Serif': SourceHanSerif_Regular_1.default,
};
const registeredMeasuryFonts = new Set();
function ensureMeasuryFont(fontFamily) {
    var _a, _b;
    // decodeFontFamily: '"851tegakizatsu", sans-serif' → '851tegakizatsu, sans-serif'
    // split by comma and take the first family name
    const primary = (_b = (_a = (0, font_1.decodeFontFamily)(fontFamily)) === null || _a === void 0 ? void 0 : _a.split(',')[0]) === null || _b === void 0 ? void 0 : _b.trim();
    if (!primary || registeredMeasuryFonts.has(primary))
        return;
    const data = EXTRA_MEASURY_FONTS[primary];
    if (!data)
        return;
    (0, measury_1.registerFont)(data);
    registeredMeasuryFonts.add(primary);
}
let canvasContext = undefined;
let measureSpan = null;
function getCanvasContext() {
    if (typeof document === 'undefined')
        return null;
    if (canvasContext !== undefined)
        return canvasContext;
    const canvas = document.createElement('canvas');
    canvasContext = canvas.getContext('2d');
    return canvasContext;
}
function getMeasureSpan() {
    if (typeof document === 'undefined')
        return null;
    if (!document.body)
        return null;
    if (measureSpan)
        return measureSpan;
    measureSpan = document.createElement('span');
    measureSpan.style.position = 'absolute';
    measureSpan.style.top = '-10000px';
    measureSpan.style.left = '-10000px';
    measureSpan.style.visibility = 'hidden';
    measureSpan.style.pointerEvents = 'none';
    measureSpan.style.whiteSpace = 'pre';
    measureSpan.style.display = 'inline-block';
    measureSpan.style.padding = '0';
    measureSpan.style.margin = '0';
    document.body.appendChild(measureSpan);
    return measureSpan;
}
function resolveLineHeight(fontSize, lineHeight) {
    if (lineHeight === undefined || lineHeight === null) {
        return fontSize * 1.4;
    }
    if (typeof lineHeight === 'string') {
        const trimmed = lineHeight.trim();
        if (trimmed.endsWith('px')) {
            const value = Number.parseFloat(trimmed);
            return Number.isFinite(value) ? value : fontSize * 1.4;
        }
        lineHeight = Number(trimmed);
    }
    if (typeof lineHeight !== 'number' || !Number.isFinite(lineHeight)) {
        return fontSize * 1.4;
    }
    return lineHeight > 4 ? lineHeight : lineHeight * fontSize;
}
function measureTextInBrowser(content, { fontFamily, fontSize, fontWeight, lineHeight, }) {
    const lines = content.split(/\r?\n/);
    const normalizedFamily = (0, font_1.encodeFontFamily)(fontFamily);
    const normalizedWeight = fontWeight || 'normal';
    const lineHeightPx = resolveLineHeight(fontSize, lineHeight);
    const context = getCanvasContext();
    if (context) {
        context.font = `${normalizedWeight} ${fontSize}px ${normalizedFamily}`;
        const width = lines.reduce((maxWidth, line) => {
            const metrics = context.measureText(line);
            return Math.max(maxWidth, metrics.width);
        }, 0);
        return { width, height: lineHeightPx * Math.max(lines.length, 1) };
    }
    const span = getMeasureSpan();
    if (!span)
        return null;
    span.style.fontFamily = normalizedFamily;
    span.style.fontSize = `${fontSize}px`;
    span.style.fontWeight = String(normalizedWeight);
    span.style.lineHeight = `${lineHeightPx}px`;
    span.textContent = content;
    const rect = span.getBoundingClientRect();
    if (content && rect.width <= 0 && rect.height <= 0)
        return null;
    return { width: rect.width, height: rect.height };
}
function measureText(text = '', attrs) {
    var _a;
    if (attrs.width && attrs.height) {
        return { width: attrs.width, height: attrs.height };
    }
    if (typeof text !== 'string' && typeof text !== 'number') {
        return { width: 0, height: 0 };
    }
    const { fontFamily = renderer_1.DEFAULT_FONT, fontSize = 14, fontWeight = 'normal', lineHeight = 1.4, } = attrs;
    const content = text.toString();
    ensureMeasuryFont(fontFamily);
    const options = {
        fontFamily,
        fontSize: parseFloat(fontSize.toString()),
        fontWeight,
        lineHeight,
    };
    const fallback = () => (0, measury_1.measureText)(content, Object.assign(Object.assign({}, options), { fontFamily: (0, font_1.decodeFontFamily)(fontFamily) }));
    const metrics = (_a = measureTextInBrowser(content, options)) !== null && _a !== void 0 ? _a : fallback();
    // 额外添加 1% 宽高
    return {
        width: Math.ceil(metrics.width * FONT_EXTEND_FACTOR),
        height: Math.ceil(metrics.height * FONT_EXTEND_FACTOR),
    };
}
