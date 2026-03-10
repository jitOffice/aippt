"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedCard = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
// 根据需要选择性导入原子组件和类型
const jsx_2 = require("../../jsx");
// 根据需要选择性导入封装组件
const components_1 = require("../components");
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const utils_1 = require("../utils");
const registry_1 = require("./registry");
// -----------------------------------------------------------------------------------
// 2. 组件实现
// -----------------------------------------------------------------------------------
const IndexedCard = (props) => {
    const [{ datum, indexes, width = 200, borderRadius = 12, padding = 16, separatorHeight = 2, indexFontSize = 20, labelFontSize = 16, gap = 8, themeColors, }, restProps,] = (0, utils_1.getItemProps)(props, [
        'width',
        'height',
        'borderRadius',
        'padding',
        'separatorHeight',
        'indexFontSize',
        'labelFontSize',
        'gap',
    ]);
    // 1. 数据处理
    const indexNumber = indexes[0] + 1;
    const indexStr = String(indexNumber).padStart(2, '0');
    const showLabel = datum.label !== undefined;
    const showDesc = datum.desc !== undefined;
    // 2. 颜色计算
    const separatorColor = tinycolor2_1.default
        .mix(themeColors.colorPrimary, themeColors.colorWhite, 40)
        .toHexString();
    const cardBgColor = themeColors.colorBgElevated || themeColors.colorWhite;
    // 3. 布局计算优化
    const contentWidth = width - 2 * padding;
    // 3.1 序号元素尺寸计算
    const indexBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(jsx_2.Text, { fontSize: indexFontSize, fontWeight: "bold", children: indexStr }));
    // 3.2 标签元素尺寸计算（考虑可用宽度）
    const labelAvailableWidth = contentWidth - indexBounds.width - gap;
    const labelBounds = showLabel
        ? (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: labelAvailableWidth, fontSize: labelFontSize, fontWeight: "bold", x: indexFontSize, children: datum.label }))
        : { width: 0, height: 0 };
    // 3.3 描述元素尺寸计算
    const descBounds = showDesc
        ? (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: contentWidth, fontSize: 14, lineHeight: 1.5, wordWrap: true, children: datum.desc }))
        : { width: 0, height: 0 };
    // 3.4 动态内容高度计算
    const titleRowHeight = Math.max(indexBounds.height, labelBounds.height);
    const contentHeight = padding * 2 + // 上下内边距
        titleRowHeight + // 标题行高度
        (showLabel || showDesc ? gap : 0) + // 标题后间距
        separatorHeight + // 分隔线高度
        (showDesc ? gap : 0) + // 分隔线后间距
        descBounds.height; // 描述高度
    // 4. 组件结构
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { width: width, height: contentHeight, children: [(0, jsx_runtime_1.jsx)(jsx_2.Rect, { x: 0, y: 0, width: width, height: contentHeight, rx: borderRadius, ry: borderRadius, fill: cardBgColor, stroke: (0, tinycolor2_1.default)(cardBgColor).darken(5).toHexString(), strokeWidth: 0.5, "data-element-type": "shape" }), (0, jsx_runtime_1.jsxs)(jsx_1.Group, { x: padding, y: padding, children: [(0, jsx_runtime_1.jsxs)(jsx_1.Group, { x: 0, y: 0, children: [(0, jsx_runtime_1.jsx)(jsx_2.Text, { x: 0, y: 0, fontSize: indexFontSize, fontWeight: "bold", fill: themeColors.colorPrimary, alignVertical: "top", children: indexStr }), showLabel && ((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: indexFontSize + gap, y: 0, width: labelAvailableWidth, fontSize: labelFontSize, fontWeight: "bold", fill: themeColors.colorTextSecondary, alignVertical: "top", children: datum.label }))] }), (0, jsx_runtime_1.jsx)(jsx_2.Rect, { x: 0, y: titleRowHeight + gap, width: contentWidth, height: separatorHeight, fill: separatorColor, "data-element-type": "shape" }), showDesc && ((0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, x: 0, y: titleRowHeight + gap + separatorHeight + gap, width: contentWidth, fontSize: 14, lineHeight: 1.5, wordWrap: true, fill: themeColors.colorTextSecondary, children: datum.desc }))] })] })));
};
exports.IndexedCard = IndexedCard;
(0, registry_1.registerItem)('indexed-card', {
    component: exports.IndexedCard,
    composites: ['label', 'desc'],
});
