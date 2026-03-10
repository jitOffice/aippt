"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompactCard = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const CompactCard = (props) => {
    const [{ datum, indexes, width = 200, height = 60, iconSize = 20, gap = 8, positionH = 'normal', themeColors, valueFormatter, }, restProps,] = (0, utils_1.getItemProps)(props, ['width', 'height', 'iconSize', 'gap']);
    const value = datum.value;
    const hasValue = value !== undefined && value !== null;
    const shadowId = 'compact-shadow';
    const iconX = positionH === 'flipped' ? width - gap - iconSize : gap;
    const textStartX = positionH === 'flipped' ? gap : iconSize + 2 * gap;
    const textWidth = width - iconSize - 3 * gap;
    // 为 Label 和 Value 分配空间
    const labelWidth = hasValue ? textWidth * 0.8 : textWidth;
    const valueWidth = hasValue ? textWidth * 0.2 : 0;
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: (0, jsx_runtime_1.jsx)("filter", { id: shadowId, children: (0, jsx_runtime_1.jsx)("feDropShadow", { dx: "0", dy: "2", stdDeviation: "2", floodOpacity: "0.15" }) }) }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: 0, y: 0, width: width, height: height, fill: themeColors.colorBgElevated, stroke: themeColors.colorBgElevated, strokeWidth: 1, rx: 6, ry: 6, filter: `url(#${shadowId})`, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: positionH === 'flipped' ? width - 3 : 0, y: 0, width: 3, height: height, fill: themeColors.colorPrimary, rx: 1.5, ry: 1.5, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(components_1.ItemIcon, { indexes: indexes, x: iconX, y: (height - iconSize) / 2, size: iconSize, fill: themeColors.colorPrimary }), (0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { x: textStartX, y: gap, width: textWidth, height: height - gap * 2, flexDirection: "column", justifyContent: "center", alignItems: "flex-start", children: [(0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { width: textWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center", children: [(0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: labelWidth, alignHorizontal: "left", fontSize: 12, fill: themeColors.colorText, children: datum.label }), hasValue && ((0, jsx_runtime_1.jsx)(components_1.ItemValue, { indexes: indexes, width: valueWidth, alignHorizontal: "right", fontSize: 12, fontWeight: "bold", fill: themeColors.colorPrimary, value: value, formatter: valueFormatter }))] }), (0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: textWidth, alignHorizontal: "left", alignVertical: "middle", fontSize: 10, fill: themeColors.colorTextSecondary, lineNumber: 2, wordWrap: true, children: datum.desc })] })] })));
};
exports.CompactCard = CompactCard;
(0, registry_1.registerItem)('compact-card', {
    component: exports.CompactCard,
    composites: ['icon', 'label', 'value', 'desc'],
});
