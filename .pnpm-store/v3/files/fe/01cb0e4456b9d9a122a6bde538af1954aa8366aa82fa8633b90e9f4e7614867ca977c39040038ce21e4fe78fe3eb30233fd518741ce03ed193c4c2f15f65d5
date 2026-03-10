import { getFontData } from './font.js';
/**
 * 应用文本转换
 */
function applyTextTransform(text, transform) {
    if (!transform || transform === 'none')
        return text;
    switch (transform) {
        case 'uppercase':
            return text.toUpperCase();
        case 'lowercase':
            return text.toLowerCase();
        case 'capitalize':
            return text
                .split(' ')
                .map((word) => {
                if (word.length === 0)
                    return word;
                return word[0].toUpperCase() + word.slice(1).toLowerCase();
            })
                .join(' ');
        default:
            return text;
    }
}
function normalizeFontSize(fontSize) {
    if (fontSize === undefined) {
        return 14;
    }
    if (typeof fontSize === 'number') {
        return fontSize;
    }
    const parsed = parseFloat(fontSize);
    return isNaN(parsed) ? 16 : parsed;
}
/**
 * 计算行高
 */
function calculateLineHeight(style, fontData) {
    const fontSize = normalizeFontSize(style.fontSize);
    const lineHeight = style.lineHeight;
    if (lineHeight === undefined) {
        // 默认使用字体的垂直度量
        const { ascender, descender, lineGap = 0 } = fontData.metrics;
        const totalHeight = ascender - descender + lineGap;
        return (totalHeight / fontData.unitsPerEm) * fontSize;
    }
    if (typeof lineHeight === 'number') {
        // 倍数
        return lineHeight * fontSize;
    }
    if (lineHeight.type === 'pixel') {
        return lineHeight.value;
    }
    if (lineHeight.type === 'percent') {
        return (lineHeight.value / 100) * fontSize;
    }
    return fontSize;
}
/**
 * 测量单行文本
 */
export function measureText(text, style = {}) {
    // 1. 应用文本转换
    const transformedText = applyTextTransform(text, style.textTransform);
    // 2. 获取字体数据
    const fontData = getFontData(style.fontFamily, style.fontWeight, style.fontStyle);
    const fontSize = normalizeFontSize(style.fontSize);
    const letterSpacing = style.letterSpacing || 0;
    const wordSpacing = style.wordSpacing || 0;
    // 3. 计算文本宽度
    let totalWidth = 0;
    const chars = Array.from(transformedText); // 正确处理 Unicode 字符
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        const nextChar = i < chars.length - 1 ? chars[i + 1] : undefined;
        // 获取字符的 advance width
        let advance = fontData.glyphs?.[char];
        if (advance === undefined) {
            advance = fontData.defaultWidth || fontData.unitsPerEm / 2;
        }
        // 将字形单位转换为像素
        const charWidth = (advance / fontData.unitsPerEm) * fontSize;
        totalWidth += charWidth;
        // 添加字距调整 (kerning)
        if (nextChar && fontData.kerning) {
            const pair = char + nextChar;
            const kernValue = fontData.kerning[pair];
            if (kernValue !== undefined) {
                totalWidth += (kernValue / fontData.unitsPerEm) * fontSize;
            }
        }
        // 添加字间距（除了最后一个字符）
        if (i < chars.length - 1) {
            totalWidth += letterSpacing;
        }
        // 如果是空格，添加词间距
        if (char === ' ') {
            totalWidth += wordSpacing;
        }
    }
    // 4. 计算高度和基线
    const height = calculateLineHeight(style, fontData);
    const { ascender } = fontData.metrics;
    const baseline = (ascender / fontData.unitsPerEm) * fontSize;
    return {
        width: totalWidth,
        height: height,
        baseline: baseline,
    };
}
