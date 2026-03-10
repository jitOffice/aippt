"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RibbonCard = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const RibbonCard = (props) => {
    const [{ datum, indexes, width = 240, height = 140, iconSize = 28, gap = 12, ribbonHeight = 32, themeColors, }, restProps,] = (0, utils_1.getItemProps)(props, [
        'width',
        'height',
        'iconSize',
        'gap',
        'ribbonHeight',
    ]);
    const gradientId = `${themeColors.colorPrimary}-ribbon`;
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: (0, jsx_runtime_1.jsxs)("linearGradient", { id: gradientId, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: themeColors.colorPrimary }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: (0, tinycolor2_1.default)(themeColors.colorPrimary)
                                .darken(15)
                                .toHexString() })] }) }), (0, jsx_runtime_1.jsxs)(components_1.ShapesGroup, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: 0, y: 0, width: width, height: height, fill: themeColors.colorBgElevated, stroke: themeColors.colorPrimaryBg, strokeWidth: 1, rx: 8, ry: 8 }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: 0, y: 0, width: width, height: ribbonHeight, fill: `url(#${gradientId})`, rx: 8, ry: 8 }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: 0, y: 8, width: width, height: ribbonHeight - 8, fill: `url(#${gradientId})` }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { x: width - 20, y: ribbonHeight, width: 20, height: 8, fill: (0, tinycolor2_1.default)(themeColors.colorPrimary).darken(25).toHexString(), d: "M0,0 L20,0 L15,8 L5,8 Z" })] }), (0, jsx_runtime_1.jsx)(components_1.ItemIcon, { indexes: indexes, x: gap, y: ribbonHeight + gap, size: iconSize, fill: themeColors.colorPrimary }), (0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: iconSize + 2 * gap, y: ribbonHeight + gap, width: width - iconSize - 3 * gap, height: iconSize, alignHorizontal: "left", alignVertical: "middle", lineHeight: 1, fontWeight: "bold", fill: themeColors.colorText, children: datum.label }), (0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, x: gap, y: ribbonHeight + iconSize + gap + 5, width: width - 2 * gap, alignHorizontal: "left", fill: themeColors.colorTextSecondary, lineNumber: 3, wordWrap: true, children: datum.desc }), (0, jsx_runtime_1.jsx)(components_1.ItemIcon, { indexes: indexes, x: width - gap - 8, y: gap / 2, size: 16, fill: themeColors.colorWhite })] })));
};
exports.RibbonCard = RibbonCard;
(0, registry_1.registerItem)('ribbon-card', {
    component: exports.RibbonCard,
    composites: ['icon', 'label', 'desc'],
});
