"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitFontFamily = splitFontFamily;
exports.decodeFontFamily = decodeFontFamily;
exports.encodeFontFamily = encodeFontFamily;
exports.normalizeFontWeightName = normalizeFontWeightName;
const GENERIC_FONT_FAMILIES = new Set([
    'serif',
    'sans-serif',
    'monospace',
    'cursive',
    'fantasy',
    'system-ui',
    '-apple-system',
    'ui-serif',
    'ui-sans-serif',
    'ui-monospace',
    'ui-rounded',
    'emoji',
    'math',
    'fangsong',
]);
function splitFontFamily(font) {
    const families = [];
    let current = '';
    let quote = null;
    const push = () => {
        const value = current.trim();
        if (value)
            families.push(value);
        current = '';
    };
    for (let i = 0; i < font.length; i += 1) {
        const char = font[i];
        if (quote) {
            current += char;
            if (char === quote)
                quote = null;
            continue;
        }
        if (char === '"' || char === "'") {
            quote = char;
            current += char;
            continue;
        }
        if (char === ',') {
            push();
            continue;
        }
        current += char;
    }
    push();
    return families;
}
function stripWrappingQuotes(value) {
    const trimmed = value.trim();
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return trimmed.slice(1, -1);
    }
    return trimmed;
}
function isWrappedInQuotes(value) {
    const trimmed = value.trim();
    return ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'")));
}
function needsQuoting(value) {
    return /^\d/.test(value) || /\s/.test(value);
}
function encodeSingleFontFamily(font) {
    const trimmed = font.trim();
    if (!trimmed)
        return trimmed;
    if (isWrappedInQuotes(trimmed))
        return trimmed;
    if (GENERIC_FONT_FAMILIES.has(trimmed.toLowerCase()))
        return trimmed;
    if (!needsQuoting(trimmed))
        return trimmed;
    const quote = trimmed.includes('"') && !trimmed.includes("'") ? "'" : '"';
    return `${quote}${trimmed}${quote}`;
}
function decodeFontFamily(font) {
    const families = splitFontFamily(font);
    if (!families.length)
        return '';
    if (families.length === 1)
        return stripWrappingQuotes(families[0]);
    return families.map((family) => stripWrappingQuotes(family)).join(', ');
}
function encodeFontFamily(font) {
    const families = splitFontFamily(font);
    if (!families.length)
        return font.trim();
    return families.map((family) => encodeSingleFontFamily(family)).join(', ');
}
const FontWeightNameMap = {
    '100': 'thin',
    hairline: 'thin',
    thin: 'thin',
    '200': 'extralight',
    ultralight: 'extralight',
    extralight: 'extralight',
    '300': 'light',
    light: 'light',
    '400': 'regular',
    normal: 'regular',
    regular: 'regular',
    '500': 'medium',
    medium: 'medium',
    '600': 'semibold',
    demibold: 'semibold',
    semibold: 'semibold',
    '700': 'bold',
    bold: 'bold',
    '800': 'extrabold',
    ultrabold: 'extrabold',
    extrabold: 'extrabold',
    '900': 'black',
    heavy: 'black',
    black: 'black',
    '950': 'extrablack',
    ultrablack: 'extrablack',
    extrablack: 'extrablack',
};
function normalizeFontWeightName(fontWeight) {
    const key = String(fontWeight).toLowerCase();
    return FontWeightNameMap[key] || 'regular';
}
