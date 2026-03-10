"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PillBadge = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const defs_1 = require("../defs");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const PillBadge = (props) => {
    const [{ datum, indexes, width = 300, pillWidth = 120, pillHeight = 36, gap = 16, positionH = 'normal', themeColors, }, restProps,] = (0, utils_1.getItemProps)(props, ['width', 'pillWidth', 'pillHeight', 'gap']);
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
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { children: [(0, jsx_runtime_1.jsxs)(jsx_1.Defs, { children: [(0, jsx_runtime_1.jsx)(defs_1.DropShadow, { id: dropShadowId, color: themeColors.colorPrimary }), (0, jsx_runtime_1.jsx)(defs_1.LinearGradient, { id: linearGradientId, startColor: "#fff", stopColor: "#ffffff33", direction: "top-bottom" })] }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: pillX, y: pillY, width: pillWidth, height: pillHeight, fill: themeColors.colorPrimaryBg, stroke: themeColors.colorPrimary, rx: pillHeight / 2, ry: pillHeight / 2, filter: `url(#${dropShadowId})`, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: pillX, y: pillY, width: pillWidth, height: pillHeight, fill: `url(#${linearGradientId})`, opacity: themeColors.isDarkMode ? 0.4 : 0.7, rx: pillHeight / 2, ry: pillHeight / 2 }), (0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: pillX, y: pillY, width: pillWidth, height: pillHeight, alignHorizontal: "center", alignVertical: "middle", fontSize: 14, fontWeight: "500", fill: themeColors.colorText, children: datum.label }), datum.desc && ((0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, x: contentX, y: contentY, width: contentWidth, alignHorizontal: positionH === 'center'
                    ? 'center'
                    : positionH === 'flipped'
                        ? 'right'
                        : 'left', fontSize: 12, fill: themeColors.colorTextSecondary, lineNumber: 2, wordWrap: true, children: datum.desc }))] })));
};
exports.PillBadge = PillBadge;
(0, registry_1.registerItem)('pill-badge', {
    component: exports.PillBadge,
    composites: ['label', 'desc'],
});
