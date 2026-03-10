"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedFonts = embedFonts;
exports.getActualLoadedFontFace = getActualLoadedFontFace;
const postcss_1 = __importDefault(require("postcss"));
const renderer_1 = require("../renderer");
const utils_1 = require("../utils");
function embedFonts(svg_1) {
    return __awaiter(this, arguments, void 0, function* (svg, embedResources = true) {
        // 1. 收集使用到的 font-family
        const usedFonts = collectUsedFonts(svg);
        if (usedFonts.size === 0)
            return;
        const parsedFontsFaces = [];
        // 2. 对每个使用到的字体，解析 CSS + 结合 document.fonts 的实际加载子集
        yield Promise.all(Array.from(usedFonts).map((fontFamily) => __awaiter(this, void 0, void 0, function* () {
            const loadedFonts = getActualLoadedFontFace(fontFamily);
            if (!loadedFonts.length)
                return;
            const cssFontFaces = yield parseFontFamily(fontFamily);
            if (!cssFontFaces.length)
                return;
            const processed = yield Promise.all(cssFontFaces.map((rawFace) => __awaiter(this, void 0, void 0, function* () {
                const fontFace = normalizeFontFace(rawFace);
                const unicodeRange = fontFace['unicode-range'].replace(/\s/g, '');
                const subset = loadedFonts.find((font) => font.unicodeRange &&
                    font.unicodeRange.replace(/\s/g, '') === unicodeRange);
                // 如果找不到对应子集，就不处理这个 font-face
                if (!subset)
                    return null;
                const baseURL = (0, renderer_1.getWoff2BaseURL)(fontFace['font-family'], (0, utils_1.normalizeFontWeightName)(fontFace['font-weight']));
                if (!baseURL)
                    return null;
                // 更宽松地从 src 中提取 .woff2 URL 片段
                const urlMatch = fontFace.src.match(/url\(["']?(.*?\.woff2)[^"']*["']?\)/);
                if (!(urlMatch === null || urlMatch === void 0 ? void 0 : urlMatch[1]))
                    return null;
                const woff2URL = (0, utils_1.join)(baseURL, urlMatch[1]);
                if (embedResources) {
                    const woff2DataUrl = yield loadWoff2(woff2URL);
                    fontFace.src = `url(${woff2DataUrl}) format('woff2')`;
                }
                else {
                    fontFace.src = `url(${woff2URL}) format('woff2')`;
                }
                return fontFace;
            })));
            parsedFontsFaces.push(...(processed.filter(Boolean) || []));
        })));
        // 3. 创建 <style>@font-face...</style> 并插入 SVG
        if (parsedFontsFaces.length > 0) {
            insertFontStyle(svg, parsedFontsFaces);
        }
    });
}
/**
 * 收集 SVG 中用到的 font-family
 */
function collectUsedFonts(svg) {
    const usedFonts = new Set();
    const addFamilies = (fontFamilyString) => {
        if (!fontFamilyString)
            return;
        (0, utils_1.splitFontFamily)(fontFamilyString).forEach((family) => {
            const decodedFontFamily = (0, utils_1.decodeFontFamily)(family);
            if (decodedFontFamily)
                usedFonts.add(decodedFontFamily);
        });
    };
    addFamilies(svg.getAttribute('font-family'));
    const textElements = svg.querySelectorAll('foreignObject span');
    for (const span of textElements) {
        addFamilies(span.style.fontFamily);
    }
    return usedFonts;
}
/**
 * 解析给定 font-family 对应的 CSS @font-face
 */
function parseFontFamily(fontFamily) {
    return __awaiter(this, void 0, void 0, function* () {
        const urls = (0, renderer_1.getFontURLs)(fontFamily);
        const fontFaces = [];
        yield Promise.allSettled(urls.map((url) => __awaiter(this, void 0, void 0, function* () {
            const cssText = yield (0, utils_1.fetchWithCache)(url)
                .then((res) => res.text())
                .catch(() => {
                console.error(`Failed to fetch font CSS: ${url}`);
                return null;
            });
            if (!cssText)
                return;
            try {
                const root = postcss_1.default.parse(cssText);
                root.walkAtRules('font-face', (rule) => {
                    const fontFace = {};
                    rule.walkDecls((decl) => {
                        fontFace[decl.prop] = decl.value;
                    });
                    fontFaces.push(fontFace);
                });
            }
            catch (error) {
                console.error(`Failed to parse CSS: ${url}`, error);
            }
        })));
        return fontFaces;
    });
}
/**
 * 从 document.fonts 中获取给定 family 且已加载的 FontFace
 */
function getActualLoadedFontFace(fontFamily) {
    const fonts = [];
    const families = (0, utils_1.splitFontFamily)(fontFamily).map((family) => (0, utils_1.decodeFontFamily)(family));
    document.fonts.forEach((font) => {
        if (families.includes((0, utils_1.decodeFontFamily)(font.family)) &&
            font.status === 'loaded') {
            fonts.push(font);
        }
    });
    return fonts;
}
/**
 * 将不完整的 FontFaceAttributes 补全为完整结构，给后续逻辑使用
 */
function normalizeFontFace(face) {
    var _a, _b, _c, _d, _e, _f;
    return {
        'font-family': (_a = face['font-family']) !== null && _a !== void 0 ? _a : '',
        src: (_b = face.src) !== null && _b !== void 0 ? _b : '',
        'font-style': (_c = face['font-style']) !== null && _c !== void 0 ? _c : 'normal',
        'font-display': (_d = face['font-display']) !== null && _d !== void 0 ? _d : 'swap',
        'font-weight': (_e = face['font-weight']) !== null && _e !== void 0 ? _e : '400',
        'unicode-range': (_f = face['unicode-range']) !== null && _f !== void 0 ? _f : 'U+0-FFFF',
    };
}
/**
 * 将 @font-face 写入 <style>，插入到 SVG 中合适的位置
 */
function insertFontStyle(svg, fontFaces) {
    // 简单去重：相同 family + weight + style + unicode-range + src 只保留一条
    const unique = [];
    const seen = new Set();
    for (const f of fontFaces) {
        const key = [
            f['font-family'],
            f['font-weight'],
            f['font-style'],
            f['unicode-range'],
            f.src,
        ].join('|');
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(f);
        }
    }
    if (unique.length === 0)
        return;
    const style = (0, utils_1.createElement)('style', { type: 'text/css' });
    style.innerHTML = unique
        .map((f) => `
@font-face {
  font-family: ${f['font-family']};
  src: ${f.src};
  font-style: ${f['font-style']};
  font-weight: ${f['font-weight']};
  font-display: ${f['font-display']};
  unicode-range: ${f['unicode-range']};
}
`.trim())
        .join('\n');
    // 尽量插在 <defs> 后面，否则插在第一个子节点前
    const defs = svg.querySelector('defs');
    if (defs && defs.parentNode) {
        defs.parentNode.insertBefore(style, defs.nextSibling);
    }
    else {
        svg.insertBefore(style, svg.firstChild);
    }
}
/**
 * 加载 woff2 并转为 DataURL
 */
function loadWoff2(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, utils_1.fetchWithCache)(url);
        if (!response.ok) {
            throw new Error(`Failed to load font: ${url}`);
        }
        const blob = yield response.blob();
        const dataUrl = yield new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        return dataUrl;
    });
}
