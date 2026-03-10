import { formatHex, formatHex8, modeOklch, oklch, parse, useMode, wcagContrast, } from 'culori';
useMode(modeOklch);
export const generateThemeColors = ({ colorPrimary, colorBg = '#ffffff', isDarkMode = false, }) => {
    const pc = parse(colorPrimary);
    const bg = parse(colorBg);
    const baseTheme = createBaseTheme({ primaryColor: pc, bgColor: bg });
    return addDerivedColors(baseTheme, {
        primaryColor: pc,
        bgColor: bg,
        isDarkMode,
    });
};
const generatePrimaryBg = (primaryColor, isDarkMode) => {
    return (formatHex8(Object.assign(Object.assign({}, primaryColor), { alpha: isDarkMode ? 0.2 : 0.1 })) || '#ffffff');
};
const generateTextColor = (bgColor, isDarkMode) => {
    if (isDarkMode) {
        return '#ffffff';
    }
    const darkText = parse('#262626');
    const contrast = wcagContrast(darkText, bgColor);
    return contrast >= 7 ? formatHex(darkText) : '#000000';
};
const generateSecondaryTextColor = (colorText) => {
    const parsed = oklch(parse(colorText));
    const lighter = Object.assign(Object.assign({}, parsed), { l: Math.min(1, parsed.l + 0.2) });
    return formatHex(lighter);
};
const generatePrimaryTextColor = (colorPrimaryBg, isDarkMode) => {
    const bg = parse(colorPrimaryBg);
    const darkText = parse('#262626');
    const lightText = parse('#ffffff');
    const darkContrast = wcagContrast(darkText, bg);
    const lightContrast = wcagContrast(lightText, bg);
    // For primary color backgrounds, prefer light text if contrast is reasonable
    if (lightContrast >= 3.0) {
        return formatHex(lightText);
    }
    // Fall back to dark text only if light text contrast is too low
    if (darkContrast >= 4.5) {
        return formatHex(darkText);
    }
    // Default fallback
    return isDarkMode ? '#ffffff' : '#ffffff';
};
const generateElevatedBg = (bgColor, isDarkMode) => {
    const parsed = oklch(bgColor);
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
    return (_a = formatHex(color)) !== null && _a !== void 0 ? _a : fallback;
}
