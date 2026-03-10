// 字体注册表：family -> weight -> style -> FontData
const fontRegistry = new Map();
const fontAliases = new Map();
// 默认字体
let defaultFontFamily = 'sans-serif';
function resolveFontFamily(family) {
    if (!family)
        return family;
    if (fontRegistry.has(family))
        return family;
    return fontAliases.get(family) || family;
}
/**
 * 通用降级字体数据
 * 用于未注册的字体，提供基本的估算能力
 * 基于 Arial
 */
const fallbackFontData = {
    fontFamily: 'sans-serif',
    fontWeight: 400,
    fontStyle: 'normal',
    unitsPerEm: 2048,
    metrics: {
        ascender: 2189,
        descender: -555,
        lineGap: 0,
    },
    // ASCII 字符的平均宽度
    glyphs: {
        '"': 727,
        '%': 1821,
        "'": 391,
        '(': 682,
        ')': 682,
        '*': 797,
        '+': 1196,
        '-': 682,
        '<': 1196,
        '=': 1196,
        '>': 1196,
        '@': 2079,
        C: 1479,
        D: 1479,
        F: 1251,
        G: 1593,
        H: 1479,
        J: 1024,
        M: 1706,
        N: 1479,
        O: 1593,
        Q: 1593,
        R: 1479,
        T: 1251,
        U: 1479,
        W: 1933,
        Z: 1251,
        '^': 961,
        _: 1024,
        '`': 682,
        c: 1024,
        i: 455,
        j: 455,
        k: 1024,
        l: 455,
        m: 1706,
        r: 682,
        s: 1024,
        v: 1024,
        w: 1479,
        x: 1024,
        y: 1024,
        z: 1024,
        '{': 684,
        '|': 532,
        '}': 684,
        '~': 1196,
    },
    glyphsByWidth: {
        569: ' !,./:;I[\\]ft',
        1139: '#$0123456789?Labdeghnopqu',
        1366: '&ABEKPSVXY',
    },
    defaultWidth: 1139,
};
/**
 * 归一化字重值
 */
function normalizeWeight(weight) {
    if (weight === undefined || weight === 'normal')
        return '400';
    if (weight === 'bold')
        return '700';
    // 处理命名字重
    const namedWeights = {
        thin: '100',
        hairline: '100',
        'extra-light': '200',
        'ultra-light': '200',
        light: '300',
        regular: '400',
        normal: '400',
        medium: '500',
        'semi-bold': '600',
        semibold: '600',
        'demi-bold': '600',
        demibold: '600',
        'extra-bold': '800',
        extrabold: '800',
        'ultra-bold': '800',
        ultrabold: '800',
        black: '900',
        heavy: '900',
        'extra-black': '950',
        extrablack: '950',
        'ultra-black': '950',
        ultrablack: '950',
        bolder: '900',
        lighter: '300',
    };
    if (typeof weight === 'string') {
        const normalized = weight.toLowerCase();
        return namedWeights[normalized] || weight;
    }
    return String(weight);
}
/**
 * 归一化字体样式
 */
function normalizeStyle(style) {
    return style || 'normal';
}
/**
 * 注册字体数据
 */
export function registerFont(data) {
    const family = data.fontFamily;
    const normalizedWeight = normalizeWeight(data.fontWeight);
    const normalizedStyle = normalizeStyle(data.fontStyle);
    if (data.aliases) {
        for (const alias of data.aliases) {
            if (!fontAliases.has(alias)) {
                fontAliases.set(alias, family);
            }
        }
    }
    // 如果使用了 glyphsByWidth 压缩格式，需要展开到 glyphs
    if (data.glyphsByWidth) {
        const expandedGlyphs = { ...(data.glyphs || {}) };
        for (const [widthOrChar, valueOrWidth] of Object.entries(data.glyphsByWidth)) {
            if (typeof valueOrWidth === 'string') {
                // 这是压缩格式：width -> characters string
                const width = Number(widthOrChar);
                for (const char of valueOrWidth) {
                    expandedGlyphs[char] = width;
                }
            }
            else {
                // 这是单个字符映射：char -> width (向后兼容)
                expandedGlyphs[widthOrChar] = valueOrWidth;
            }
        }
        // 创建新的 fontData 对象，用展开后的 glyphs 替换原来的
        data = {
            ...data,
            glyphs: expandedGlyphs,
            // 移除 glyphsByWidth，节省运行时内存
            glyphsByWidth: undefined,
        };
    }
    if (!fontRegistry.has(family)) {
        fontRegistry.set(family, new Map());
    }
    const familyMap = fontRegistry.get(family);
    if (!familyMap.has(normalizedWeight)) {
        familyMap.set(normalizedWeight, new Map());
    }
    const weightMap = familyMap.get(normalizedWeight);
    weightMap.set(normalizedStyle, data);
}
/**
 * 设置默认字体
 */
export function setDefaultFontFamily(fontFamily) {
    defaultFontFamily = fontFamily;
}
/**
 * 获取字体数据
 * @param family 字体名称，未指定时使用默认字体
 * @param weight 字重，未指定时使用 normal (400)
 * @param style 字体样式，未指定时使用 normal
 */
export function getFontData(family, weight, style) {
    const targetFamily = resolveFontFamily(family || defaultFontFamily);
    const normalizedWeight = normalizeWeight(weight);
    const normalizedStyle = normalizeStyle(style);
    const familyMap = fontRegistry.get(targetFamily);
    if (!familyMap) {
        console.warn(`Font family "${targetFamily}" not registered, using fallback font data`);
        return fallbackFontData;
    }
    // 优先使用精确匹配的字重和样式
    let weightMap = familyMap.get(normalizedWeight);
    if (weightMap) {
        let fontData = weightMap.get(normalizedStyle);
        if (fontData)
            return fontData;
        // 如果找不到指定样式，尝试降级到 normal
        if (normalizedStyle !== 'normal') {
            fontData = weightMap.get('normal');
            if (fontData)
                return fontData;
        }
        // 返回该字重下的第一个可用样式
        const firstStyle = weightMap.values().next().value;
        if (firstStyle)
            return firstStyle;
    }
    // 如果找不到指定字重，尝试使用 400（normal）
    weightMap = familyMap.get('400');
    if (weightMap) {
        let fontData = weightMap.get(normalizedStyle);
        if (fontData)
            return fontData;
        // 降级到 normal 样式
        if (normalizedStyle !== 'normal') {
            fontData = weightMap.get('normal');
            if (fontData)
                return fontData;
        }
        // 返回该字重下的第一个可用样式
        const firstStyle = weightMap.values().next().value;
        if (firstStyle)
            return firstStyle;
    }
    // 如果还找不到，使用该 family 下的第一个可用字重和样式
    const firstWeightMap = familyMap.values().next().value;
    if (firstWeightMap) {
        const firstStyle = firstWeightMap.values().next().value;
        if (firstStyle)
            return firstStyle;
    }
    throw new Error(`No font data found for family "${targetFamily}" with weight "${normalizedWeight}" and style "${normalizedStyle}"`);
}
