"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartColumn = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const d3_1 = require("d3");
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const jsx_1 = require("../../jsx");
const utils_1 = require("../../utils");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_2 = require("../utils");
const registry_1 = require("./registry");
const ChartColumn = (props) => {
    const { Title, Item, data, columnGap = 60, columnWidth = 50, padding = 20, showValue = true, options, valueFormatter = (value) => value.toString(), } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    if (items.length === 0) {
        return ((0, jsx_runtime_1.jsx)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: titleContent }));
    }
    const themeColors = (0, utils_2.getThemeColors)(options.themeConfig);
    const values = items.map((item) => { var _a; return (_a = item.value) !== null && _a !== void 0 ? _a : 0; });
    const sortedValues = [...values, 0].sort((a, b) => a - b);
    const hasNegative = sortedValues[0] < 0;
    const chartWidth = items.length * columnWidth + (items.length - 1) * columnGap;
    const chartHeight = 300;
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = (0, utils_1.parsePadding)(padding);
    // Add extra space for negative value labels if needed
    const valueTextHeight = showValue ? 24 : 0; // Estimated height for value text
    const itemGap = 10;
    const extraBottomSpace = hasNegative && showValue ? valueTextHeight + itemGap : itemGap;
    const totalWidth = chartWidth + paddingLeft + paddingRight;
    const totalHeight = chartHeight + paddingTop + paddingBottom + extraBottomSpace;
    const yScale = (0, d3_1.scaleLinear)()
        .domain([sortedValues[0], sortedValues[sortedValues.length - 1]])
        .range([chartHeight, 0]);
    const zeroY = yScale(0);
    const columnElements = [];
    const valueElements = [];
    const itemElements = [];
    const gradientDefs = [];
    items.forEach((item, index) => {
        var _a;
        const indexes = [index];
        const value = (_a = item.value) !== null && _a !== void 0 ? _a : 0;
        const columnX = paddingLeft + index * (columnWidth + columnGap);
        const columnY = value >= 0 ? yScale(value) : zeroY;
        const columnHeight = Math.abs(yScale(value) - zeroY);
        // Get color from palette for this item
        const color = (0, utils_2.getPaletteColor)(options, [index]) || themeColors.colorPrimary;
        const gradientPositiveId = `${color}-column-positive-${index}`;
        const gradientNegativeId = `${color}-column-negative-${index}`;
        // Create gradient definition for this column
        gradientDefs.push((0, jsx_runtime_1.jsxs)("linearGradient", { id: value >= 0 ? gradientPositiveId : gradientNegativeId, x1: "0%", y1: value >= 0 ? '0%' : '100%', x2: "0%", y2: value >= 0 ? '100%' : '0%', children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: color }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: tinycolor2_1.default.mix(color, '#fff', 40).toHexString() })] }));
        // Column
        columnElements.push((0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: columnX, y: paddingTop + columnY, width: columnWidth, height: columnHeight, fill: `url(#${value >= 0 ? gradientPositiveId : gradientNegativeId})`, rx: 8, ry: 8, "data-element-type": "shape" }));
        // Value text
        if (showValue) {
            valueElements.push((0, jsx_runtime_1.jsx)(jsx_1.Text, { x: columnX + columnWidth / 2, y: value >= 0
                    ? paddingTop + columnY - 10
                    : paddingTop + columnY + columnHeight + 20, fontSize: 16, fontWeight: "bold", alignHorizontal: "center", alignVertical: value >= 0 ? 'bottom' : 'top', fill: color, children: valueFormatter(value, item) }));
        }
        // Item (label)
        const itemWidth = columnWidth + columnGap;
        const itemY = paddingTop + chartHeight + extraBottomSpace;
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: columnX + columnWidth / 2 - itemWidth / 2, y: itemY, width: itemWidth, positionH: "center" }));
    });
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { width: totalWidth, height: totalHeight, children: [(0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: gradientDefs }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: columnElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: valueElements }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements })] })] }));
};
exports.ChartColumn = ChartColumn;
(0, registry_1.registerStructure)('chart-column', {
    component: exports.ChartColumn,
    composites: ['title', 'item'],
});
