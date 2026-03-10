"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateThemeColors = void 0;
const culori_1 = require("culori");
(0, culori_1.useMode)(culori_1.modeOklch);
const generateThemeColors = ({ colorPrimary, colorBg = '#ffffff', isDarkMode = false, }) => {
    const pc = (0, culori_1.parse)(colorPrimary);
    const bg = (0, culori_1.parse)(colorBg);
    const baseTheme = createBaseTheme({ primaryColor: pc, bgColor: bg });
    return addDerivedColors(baseTheme, {
        primaryColor: pc,
        bgColor: bg,
        isDarkMode,
    });
};
exports.generateThemeColors = generateThemeColors;
const generatePrimaryBg = (primaryColor, isDarkMode) => {
    return ((0, culori_1.formatHex8)(Object.assign(Object.assign({}, primaryColor), { alpha: isDarkMode ? 0.2 : 0.1 })) || '#ffffff');
};
const generateTextColor = (bgColor, isDarkMode) => {
    if (isDarkMode) {
        return '#ffffff';
    }
    const darkText = (0, culori_1.parse)('#262626');
    const contrast = (0, culori_1.wcagContrast)(darkText, bgColor);
    return contrast >= 7 ? (0, culori_1.formatHex)(darkText) : '#000000';
};
const generateSecondaryTextColor = (colorText) => {
    const parsed = (0, culori_1.oklch)((0, culori_1.parse)(colorText));
    const lighter = Object.assign(Object.assign({}, parsed), { l: Math.min(1, parsed.l + 0.2) });
    return (0, culori_1.formatHex)(lighter);
};
const generatePrimaryTextColor = (colorPrimaryBg, isDarkMode) => {
    const bg = (0, culori_1.parse)(colorPrimaryBg);
    const darkText = (0, culori_1.parse)('#262626');
    const lightText = (0, culori_1.parse)('#ffffff');
    const darkContrast = (0, culori_1.wcagContrast)(darkText, bg);
    const lightContrast = (0, culori_1.wcagContrast)(lightText, bg);
    // For primary color backgrounds, prefer light text if contrast is reasonable
    if (lightContrast >= 3.0) {
        return (0, culori_1.formatHex)(lightText);
    }
    // Fall back to dark text only if light text contrast is too low
    if (darkContrast >= 4.5) {
        return (0, culori_1.formatHex)(darkText);
    }
    // Default fallback
    return isDarkMode ? '#ffffff' : '#ffffff';
};
const generateElevatedBg = (bgColor, isDarkMode) => {
    const parsed = (0, culori_1.oklch)(bgColor);
    if (isDarkMode) {
        const lightened = Object.assign(Object.assign({}, parsed), { l: Math.min(1, parsed.l + 0.1) });
        return safeFormatHex(lightened, '#1f1f1f');
    }
    else {
        if (parsed.l > 0.95) {
            return '#ffffff';
        }
        else {
            const lightened = Object.assign(Object.assign({}, parsed), { l: Math.min(1, parsed.l + 0.05) });
            return safeFormatHex(lightened, '#ffffff');
        }
    }
};
const createBaseTheme = ({ primaryColor, bgColor, }) => ({
    colorPrimary: safeFormatHex(primaryColor, '#FF356A'),
    colorBg: safeFormatHex(bgColor, '#ffffff'),
    colorWhite: '#ffffff',
});
const addDerivedColors = (baseTheme, { primaryColor, bgColor, isDarkMode, }) => {
    const textColor = generateTextColor(bgColor, isDarkMode);
    const colorPrimaryBg = generatePrimaryBg(primaryColor, isDarkMode);
    return Object.assign(Object.assign({}, baseTheme), { isDarkMode,
        colorPrimaryBg, colorText: textColor, colorTextSecondary: generateSecondaryTextColor(textColor), colorPrimaryText: generatePrimaryTextColor(colorPrimaryBg, isDarkMode), colorBgElevated: generateElevatedBg(bgColor, isDarkMode) });
};
function safeFormatHex(color, fallback = '#000000') {
    var _a;
    return (_a = (0, culori_1.formatHex)(color)) !== null && _a !== void 0 ? _a : fallback;
}
