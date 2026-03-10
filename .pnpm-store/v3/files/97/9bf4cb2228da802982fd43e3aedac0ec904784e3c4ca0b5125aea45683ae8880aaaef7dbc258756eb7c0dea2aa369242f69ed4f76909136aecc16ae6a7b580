"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartBar = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const d3_1 = require("d3");
const jsx_1 = require("../../jsx");
const utils_1 = require("../../utils");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_2 = require("../utils");
const registry_1 = require("./registry");
const ChartBar = (props) => {
    var _a, _b, _c;
    const { Title, Item, data, width, gap, barGap, barHeight = 28, barAreaWidth, labelGap = 16, padding = 24, showValue = true, options, valueFormatter = (value) => value.toString(), } = props;
    const resolvedBarAreaWidth = (_a = barAreaWidth !== null && barAreaWidth !== void 0 ? barAreaWidth : width) !== null && _a !== void 0 ? _a : 480;
    const { title, desc, items = [], xTitle, yTitle } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    if (items.length === 0) {
        return ((0, jsx_runtime_1.jsx)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: titleContent }));
    }
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = (0, utils_1.parsePadding)(padding);
    const sampleDatum = (_b = items[0]) !== null && _b !== void 0 ? _b : { label: '', value: 0 };
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], datum: sampleDatum, data: data }));
    const labelWidth = itemBounds.width || 140;
    const labelHeight = itemBounds.height || barHeight;
    const rowHeight = Math.max(barHeight, labelHeight);
    const gapByHeight = Math.max(12, rowHeight * 0.35);
    const resolvedGap = (_c = barGap !== null && barGap !== void 0 ? barGap : gap) !== null && _c !== void 0 ? _c : gapByHeight;
    const values = items.map((item) => { var _a; return (_a = item.value) !== null && _a !== void 0 ? _a : 0; });
    const maxValue = Math.max(...values, 0);
    const minValue = Math.min(...values, 0);
    const domainMin = minValue < 0 ? minValue * 1.1 : 0;
    let domainMax = maxValue > 0 ? maxValue * 1.1 : 0;
    if (domainMax === domainMin) {
        domainMax = domainMin + 1;
    }
    const scale = (0, d3_1.scaleLinear)()
        .domain([domainMin, domainMax])
        .range([0, resolvedBarAreaWidth]);
    const zeroX = Math.min(Math.max(scale(0), 0), resolvedBarAreaWidth);
    const minBarWidth = Math.max(2, resolvedBarAreaWidth * 0.02);
    const chartHeight = items.length * (rowHeight + resolvedGap) - resolvedGap;
    const yTitleSpace = yTitle ? 24 : 0;
    const xTickSpace = 20;
    const xTitleSpace = xTitle ? 24 : 0;
    const yStart = paddingTop + yTitleSpace;
    const barStartX = paddingLeft + labelWidth + labelGap;
    const valueSpace = showValue ? 80 : 0;
    const axisGap = Math.max(8, rowHeight * 0.2);
    const totalWidth = barStartX + resolvedBarAreaWidth + valueSpace + paddingRight;
    const totalHeight = yStart + chartHeight + axisGap + xTickSpace + xTitleSpace + paddingBottom;
    const themeColors = (0, utils_2.getThemeColors)(options.themeConfig);
    const axisColor = themeColors.colorText || '#666';
    const colorPrimary = (0, utils_2.getColorPrimary)(options);
    const barElements = [];
    const valueElements = [];
    const itemElements = [];
    const axisElements = [];
    const tickElements = [];
    const gridElements = [];
    const titleElements = [];
    const axisY = yStart + chartHeight + axisGap;
    const formatTick = (value) => Number.isInteger(value) ? value.toString() : value.toFixed(1);
    items.forEach((item, index) => {
        var _a;
        const indexes = [index];
        const value = (_a = item.value) !== null && _a !== void 0 ? _a : 0;
        const rowY = yStart + index * (rowHeight + resolvedGap);
        const barY = rowY + (rowHeight - barHeight) / 2;
        const barX = value >= 0 ? barStartX + zeroX : barStartX + scale(value);
        const barWidthRaw = value >= 0 ? scale(value) - zeroX : zeroX - scale(value);
        const barWidth = barWidthRaw === 0 ? minBarWidth : barWidthRaw;
        const barColor = (0, utils_2.getPaletteColor)(options, [index]) || themeColors.colorPrimary;
        barElements.push((0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: barX, y: barY, width: barWidth, height: barHeight, fill: barColor, rx: 6, ry: 6, "data-element-type": "shape" }));
        if (showValue) {
            const valueX = value >= 0 ? barX + barWidth + 8 : barX - 8;
            valueElements.push((0, jsx_runtime_1.jsx)(jsx_1.Text, { x: valueX, y: barY + barHeight / 2, alignHorizontal: value >= 0 ? 'left' : 'right', alignVertical: "middle", fontSize: 14, fontWeight: "bold", fill: barColor, children: valueFormatter(value, item) }));
        }
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: paddingLeft, y: rowY + (rowHeight - labelHeight) / 2, width: labelWidth, height: labelHeight, positionV: "middle" }));
    });
    const tickCount = Math.max(3, Math.min(7, Math.floor(resolvedBarAreaWidth / 80)));
    const ticks = scale.ticks(tickCount);
    ticks.forEach((tick) => {
        const tickX = barStartX + scale(tick);
        gridElements.push((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M${tickX} ${yStart} L${tickX} ${yStart + chartHeight}`, stroke: axisColor, strokeOpacity: 0.08, "data-element-type": "shape" }));
        tickElements.push((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M${tickX - 0.5} ${axisY} L${tickX - 0.5} ${axisY + 6}`, stroke: axisColor, "data-element-type": "shape" }));
        tickElements.push((0, jsx_runtime_1.jsx)(jsx_1.Text, { x: tickX, y: axisY + 14, alignHorizontal: "center", alignVertical: "middle", fontSize: 12, fill: axisColor, children: formatTick(tick) }));
    });
    axisElements.push((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M${barStartX} ${axisY} L${barStartX + resolvedBarAreaWidth} ${axisY}`, stroke: axisColor, "data-element-type": "shape" }));
    if (domainMin < 0) {
        axisElements.push((0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: barStartX + zeroX - 0.5, y: yStart, width: 1, height: chartHeight, fill: colorPrimary, "data-element-type": "shape" }));
    }
    if (yTitle) {
        titleElements.push((0, jsx_runtime_1.jsx)(jsx_1.Text, { x: paddingLeft + labelWidth / 2, y: paddingTop + yTitleSpace / 2, alignHorizontal: "center", alignVertical: "middle", fontSize: 14, fontWeight: "bold", fill: axisColor, children: yTitle }));
    }
    if (xTitle) {
        titleElements.push((0, jsx_runtime_1.jsx)(jsx_1.Text, { x: barStartX + resolvedBarAreaWidth / 2, y: axisY + xTickSpace + xTitleSpace / 2, alignHorizontal: "center", alignVertical: "middle", fontSize: 14, fontWeight: "bold", fill: axisColor, children: xTitle }));
    }
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { width: totalWidth, height: totalHeight, children: [(0, jsx_runtime_1.jsx)(jsx_1.Group, { children: gridElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: barElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: valueElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: titleElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: [...axisElements, ...tickElements] }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements })] })] }));
};
exports.ChartBar = ChartBar;
(0, registry_1.registerStructure)('chart-bar', {
    component: exports.ChartBar,
    composites: ['title', 'item', 'xTitle', 'yTitle'],
});
