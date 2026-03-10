"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressCard = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const d3_1 = require("d3");
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const ProgressCard = (props) => {
    const [{ datum, data, indexes, width = 280, height = 120, iconSize = 32, gap = 12, progressHeight = 8, borderRadius = 12, positionH = 'normal', themeColors, valueFormatter = (v) => `${v}%`, }, restProps,] = (0, utils_1.getItemProps)(props, [
        'width',
        'height',
        'iconSize',
        'gap',
        'progressHeight',
        'borderRadius',
    ]);
    const value = datum.value;
    const displayValue = value !== null && value !== void 0 ? value : 0;
    const maxValue = Math.max(...data.items.map((item) => { var _a; return (_a = item.value) !== null && _a !== void 0 ? _a : 0; }), 100);
    const progressWidth = width - 2 * gap;
    // 计算进度条的填充宽度
    const progressScale = (0, d3_1.scaleLinear)()
        .domain([0, maxValue])
        .range([0, progressWidth]);
    const progressFillWidth = progressScale(displayValue);
    // 生成唯一的渐变ID
    const gradientId = `${themeColors.colorPrimary}-progress`;
    const progressBgId = `${themeColors.colorPrimaryBg}-progress-bg`;
    // 获取元素边界用于布局计算
    const labelBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes }));
    // 计算布局位置
    const contentY = gap;
    const iconX = positionH === 'flipped' ? width - gap - iconSize : gap;
    const iconY = contentY;
    const textStartX = positionH === 'flipped' ? gap : iconSize + 2 * gap;
    const textWidth = width - iconSize - 3 * gap;
    const textY = iconY;
    const progressY = height - gap - progressHeight;
    const hasValue = value !== undefined;
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { children: [(0, jsx_runtime_1.jsxs)(jsx_1.Defs, { children: [(0, jsx_runtime_1.jsxs)("linearGradient", { id: gradientId, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: themeColors.colorPrimary }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: tinycolor2_1.default
                                    .mix(themeColors.colorPrimary, '#fff', 20)
                                    .toHexString() })] }), (0, jsx_runtime_1.jsxs)("linearGradient", { id: progressBgId, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: themeColors.colorPrimaryBg }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: themeColors.colorBg })] })] }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: 0, y: 0, width: width, height: height, fill: themeColors.colorBgElevated, stroke: themeColors.colorPrimaryBg, strokeWidth: 1, rx: borderRadius, ry: borderRadius, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(components_1.ItemIcon, { indexes: indexes, x: iconX, y: iconY, size: iconSize, fill: themeColors.colorPrimary }), (0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: textStartX, y: textY, width: textWidth, alignHorizontal: positionH === 'flipped' ? 'right' : 'left', alignVertical: "top", fontSize: 16, fontWeight: "medium", fill: themeColors.colorText, children: datum.label }), hasValue && ((0, jsx_runtime_1.jsx)(components_1.ItemValue, { indexes: indexes, x: textStartX, y: textY + labelBounds.height, width: textWidth, alignHorizontal: positionH === 'flipped' ? 'right' : 'left', alignVertical: "top", lineHeight: 1, fontSize: 24, fontWeight: "bold", fill: themeColors.colorPrimary, value: displayValue, formatter: valueFormatter })), (0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, x: textStartX, y: textY + labelBounds.height + (hasValue ? 27 : 4), width: textWidth, alignHorizontal: positionH === 'flipped' ? 'right' : 'left', alignVertical: "top", fontSize: 11, fill: themeColors.colorTextSecondary, lineNumber: hasValue ? 2 : 3, wordWrap: true, children: datum.desc }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: gap, y: progressY, width: progressWidth, height: progressHeight, fill: `url(#${progressBgId})`, rx: progressHeight / 2, ry: progressHeight / 2, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: gap, y: progressY, width: progressFillWidth, height: progressHeight, fill: `url(#${gradientId})`, rx: progressHeight / 2, ry: progressHeight / 2, "data-element-type": "shape" })] })));
};
exports.ProgressCard = ProgressCard;
(0, registry_1.registerItem)('progress-card', {
    component: exports.ProgressCard,
    composites: ['icon', 'label', 'value', 'desc'],
});
