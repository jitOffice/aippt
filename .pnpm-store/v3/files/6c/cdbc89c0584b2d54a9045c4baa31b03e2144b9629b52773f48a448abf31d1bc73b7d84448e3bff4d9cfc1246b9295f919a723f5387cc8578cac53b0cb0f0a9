import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Defs, Group, Rect } from '../../jsx/index.js';
import { ItemDesc, ItemLabel } from '../components/index.js';
import { DropShadow, LinearGradient } from '../defs/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const PillBadge = (props) => {
    const [{ datum, indexes, width = 300, pillWidth = 120, pillHeight = 36, gap = 16, positionH = 'normal', themeColors, }, restProps,] = getItemProps(props, ['width', 'pillWidth', 'pillHeight', 'gap']);
    // Optimize: when no description, use pillWidth as component width
    const hasDesc = !!datum.desc;
    const componentWidth = hasDesc ? width : pillWidth;
    // Calculate pill position based on alignment
    const pillX = hasDesc
        ? positionH === 'center'
            ? (componentWidth - pillWidth) / 2
            : positionH === 'flipped'
                ? componentWidth - pillWidth
                : 0
        : 0; // Always 0 when no description
    const pillY = 0;
    // Calculate content position (only needed when hasDesc is true)
    const contentX = hasDesc
        ? positionH === 'center'
            ? 0
            : positionH === 'flipped'
                ? 0
                : 0
        : 0;
    const contentY = pillHeight + gap;
    const contentWidth = componentWidth;
    const dropShadowId = `drop-shadow-${themeColors.colorPrimary}`;
    const linearGradientId = `linear-gradient-white-top-bottom`;
    return (_jsxs(Group, Object.assign({}, restProps, { children: [_jsxs(Defs, { children: [_jsx(DropShadow, { id: dropShadowId, color: themeColors.colorPrimary }), _jsx(LinearGradient, { id: linearGradientId, startColor: "#fff", stopColor: "#ffffff33", direction: "top-bottom" })] }), _jsx(Rect, { x: pillX, y: pillY, width: pillWidth, height: pillHeight, fill: themeColors.colorPrimaryBg, stroke: themeColors.colorPrimary, rx: pillHeight / 2, ry: pillHeight / 2, filter: `url(#${dropShadowId})`, "data-element-type": "shape" }), _jsx(Rect, { x: pillX, y: pillY, width: pillWidth, height: pillHeight, fill: `url(#${linearGradientId})`, opacity: themeColors.isDarkMode ? 0.4 : 0.7, rx: pillHeight / 2, ry: pillHeight / 2 }), _jsx(ItemLabel, { indexes: indexes, x: pillX, y: pillY, width: pillWidth, height: pillHeight, alignHorizontal: "center", alignVertical: "middle", fontSize: 14, fontWeight: "500", fill: themeColors.colorText, children: datum.label }), datum.desc && (_jsx(ItemDesc, { indexes: indexes, x: contentX, y: contentY, width: contentWidth, alignHorizontal: positionH === 'center'
                    ? 'center'
                    : positionH === 'flipped'
                        ? 'right'
                        : 'left', fontSize: 12, fill: themeColors.colorTextSecondary, lineNumber: 2, wordWrap: true, children: datum.desc }))] })));
};
registerItem('pill-badge', {
    component: PillBadge,
    composites: ['label', 'desc'],
});
