"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartLine = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const d3_1 = require("d3");
const jsx_1 = require("../../jsx");
const utils_1 = require("../../utils");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_2 = require("../utils");
const registry_1 = require("./registry");
const ChartLine = (props) => {
    const { Title, Item, data, width, height = 260, gap = 10, padding = 24, showValue = true, options, valueFormatter = (value) => value.toString(), } = props;
    const { title, desc, items = [], xTitle, yTitle } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    if (items.length === 0) {
        return ((0, jsx_runtime_1.jsx)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: titleContent }));
    }
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = (0, utils_1.parsePadding)(padding);
    const itemProps = {
        indexes: [0],
        datum: items[0],
        data,
        positionH: 'center',
        positionV: 'normal',
    };
    const sampleBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, Object.assign({}, itemProps)));
    const labelWidth = sampleBounds.width;
    const labelHeight = sampleBounds.height;
    const xTickSpace = Math.max(28, labelHeight + 14);
    const yTickSpace = 44;
    const yTitleSpace = yTitle ? 26 : 0;
    const xTitleSpace = xTitle ? 22 : 0;
    const baseSpacing = labelWidth + gap;
    const naturalChartWidth = items.length > 0 ? (items.length - 1) * baseSpacing + labelWidth : 0;
    const targetChartWidth = width !== undefined ? width : Math.max(200, naturalChartWidth || 320);
    const spacing = items.length > 1
        ? Math.max(baseSpacing, (targetChartWidth - labelWidth) / (items.length - 1))
        : 0;
    const derivedChartWidth = items.length > 0
        ? Math.max(labelWidth, (items.length - 1) * spacing + labelWidth)
        : 0;
    const chartOriginX = paddingLeft + yTickSpace + yTitleSpace;
    const chartOriginY = paddingTop + yTitleSpace;
    const totalWidth = chartOriginX + derivedChartWidth + paddingRight;
    const totalHeight = chartOriginY + height + xTickSpace + xTitleSpace + paddingBottom;
    const values = items.map((item) => { var _a; return (_a = item.value) !== null && _a !== void 0 ? _a : 0; });
    const maxValue = Math.max(...values, 0);
    const minValue = Math.min(...values, 0);
    const domainPadding = Math.max(Math.abs(maxValue), Math.abs(minValue)) * 0.1;
    const domainMin = minValue < 0 ? minValue - domainPadding : 0;
    let domainMax = maxValue > 0 ? maxValue + domainPadding : 1;
    if (domainMax === domainMin) {
        domainMax = domainMin + 1;
    }
    const scaleY = (0, d3_1.scaleLinear)()
        .domain([domainMin, domainMax])
        .nice()
        .range([height, 0]);
    const zeroY = Math.max(0, Math.min(height, scaleY(0)));
    const axisBaseY = domainMax <= 0 ? 0 : domainMin >= 0 ? height : zeroY;
    const colorPrimary = (0, utils_2.getColorPrimary)(options);
    const themeColors = (0, utils_2.getThemeColors)(options.themeConfig);
    const axisColor = themeColors.colorText || '#666';
    const gridElements = [];
    const axisElements = [];
    const lineElements = [];
    const pointElements = [];
    const valueElements = [];
    const titleElements = [];
    const tickElements = [];
    const ticksY = scaleY.ticks(6);
    ticksY.forEach((tick) => {
        const yPos = chartOriginY + scaleY(tick);
        gridElements.push((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M ${chartOriginX} ${yPos} L ${chartOriginX + derivedChartWidth} ${yPos}`, width: derivedChartWidth, height: 1, stroke: axisColor, strokeWidth: 1, "data-element-type": "shape", opacity: 0.08 }));
        tickElements.push((0, jsx_runtime_1.jsx)(jsx_1.Text, { x: chartOriginX - 8, y: yPos, alignHorizontal: "right", alignVertical: "middle", fontSize: 12, fill: axisColor, children: Number.isInteger(tick) ? tick.toString() : tick.toFixed(1) }));
    });
    const xLabels = [];
    const pointPositions = [];
    const colorStopsData = [];
    const createSmoothPath = (points) => {
        if (points.length === 0)
            return '';
        if (points.length === 1) {
            const p = points[0];
            return `M ${p.x} ${p.y}`;
        }
        const segments = [];
        segments.push(`M ${points[0].x} ${points[0].y}`);
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i - 1] || points[i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] || p2;
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            segments.push(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`);
        }
        return segments.join(' ');
    };
    items.forEach((item, index) => {
        var _a;
        const x = chartOriginX + index * spacing + labelWidth / 2;
        const y = chartOriginY + scaleY((_a = item.value) !== null && _a !== void 0 ? _a : 0);
        pointPositions.push({ x, y, datum: item });
        xLabels.push((0, jsx_runtime_1.jsx)(Item, Object.assign({}, itemProps, { indexes: [index], datum: item, x: x - labelWidth / 2, y: chartOriginY + height + 4 })));
        const stopColor = (0, utils_2.getPaletteColor)(options, [index]) || themeColors.colorPrimary;
        colorStopsData.push({ x, color: stopColor });
    });
    const minStopX = colorStopsData.length > 0
        ? Math.min(...colorStopsData.map((s) => s.x))
        : chartOriginX;
    const maxStopX = colorStopsData.length > 0
        ? Math.max(...colorStopsData.map((s) => s.x))
        : chartOriginX + derivedChartWidth;
    const stopSpan = Math.max(1, maxStopX - minStopX);
    const gradientStops = colorStopsData.map((s) => ((0, jsx_runtime_1.jsx)("stop", { offset: `${((s.x - minStopX) / stopSpan) * 100}%`, stopColor: s.color })));
    const areaStops = colorStopsData.map((s) => ((0, jsx_runtime_1.jsx)("stop", { offset: `${((s.x - minStopX) / stopSpan) * 100}%`, stopColor: s.color, stopOpacity: "0.18" })));
    if (colorStopsData.length > 0) {
        const lastColor = colorStopsData[colorStopsData.length - 1].color;
        gradientStops.push((0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: lastColor }));
        areaStops.push((0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: lastColor, stopOpacity: "0.04" }));
    }
    const gradientIdBase = `chart-line-${(0, utils_1.getSimpleHash)([
        derivedChartWidth,
        height,
        axisColor,
        colorPrimary,
        colorStopsData.map((s) => `${s.x.toFixed(2)}-${s.color}`).join(),
    ].join(':'))}`;
    const gradientStrokeId = `${gradientIdBase}-stroke`;
    const gradientAreaId = `${gradientIdBase}-area`;
    const smoothLinePath = createSmoothPath(pointPositions);
    lineElements.push((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: smoothLinePath, width: derivedChartWidth, height: height, stroke: `url(#${gradientStrokeId})`, strokeWidth: 3, fill: "none", "data-element-type": "shape" }));
    const areaCurveTail = smoothLinePath.includes('C')
        ? smoothLinePath.slice(smoothLinePath.indexOf('C'))
        : '';
    const areaPath = [
        `M ${pointPositions[0].x} ${chartOriginY + axisBaseY}`,
        `L ${pointPositions[0].x} ${pointPositions[0].y}`,
        areaCurveTail,
        `L ${pointPositions[pointPositions.length - 1].x} ${chartOriginY + axisBaseY}`,
        'Z',
    ].join(' ');
    lineElements.push((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: areaPath, width: derivedChartWidth, height: height, fill: `url(#${gradientAreaId})`, stroke: "none", "data-element-type": "shape" }));
    pointPositions.forEach((pos, index) => {
        var _a;
        const paletteColor = (0, utils_2.getPaletteColor)(options, [index]) || themeColors.colorPrimary;
        pointElements.push((0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: pos.x - 6, y: pos.y - 6, width: 12, height: 12, fill: paletteColor, "data-element-type": "shape" }));
        if (showValue) {
            valueElements.push((0, jsx_runtime_1.jsx)(jsx_1.Text, { x: pos.x, y: pos.y - 12, alignHorizontal: "center", alignVertical: "bottom", fontSize: 12, fontWeight: "bold", fill: paletteColor, children: valueFormatter((_a = pos.datum.value) !== null && _a !== void 0 ? _a : 0, pos.datum) }));
        }
    });
    axisElements.push((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M ${chartOriginX} ${chartOriginY + axisBaseY} L ${chartOriginX + derivedChartWidth} ${chartOriginY + axisBaseY}`, width: derivedChartWidth, height: 1, stroke: axisColor, strokeWidth: 1, "data-element-type": "shape" }));
    axisElements.push((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M ${chartOriginX} ${chartOriginY} L ${chartOriginX} ${chartOriginY + height}`, width: 1, height: height, stroke: axisColor, strokeWidth: 1, "data-element-type": "shape" }));
    if (xTitle) {
        titleElements.push((0, jsx_runtime_1.jsx)(jsx_1.Text, { x: chartOriginX + derivedChartWidth / 2, y: chartOriginY + height + xTickSpace + xTitleSpace / 2, alignHorizontal: "center", alignVertical: "middle", fontSize: 14, fontWeight: "bold", fill: axisColor, children: xTitle }));
    }
    if (yTitle) {
        titleElements.push((0, jsx_runtime_1.jsx)(jsx_1.Text, { x: paddingLeft + yTitleSpace / 2, y: chartOriginY + height / 2, alignHorizontal: "center", alignVertical: "middle", fontSize: 14, fontWeight: "bold", fill: axisColor, children: yTitle }));
    }
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { width: totalWidth, height: totalHeight, children: [(0, jsx_runtime_1.jsxs)(jsx_1.Defs, { children: [(0, jsx_runtime_1.jsx)("linearGradient", { id: gradientStrokeId, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: gradientStops }), (0, jsx_runtime_1.jsxs)("linearGradient", { id: gradientAreaId, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [areaStops, (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: colorPrimary, stopOpacity: "0.04" })] })] }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: gridElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: [...axisElements, ...tickElements] }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: lineElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: pointElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: valueElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: titleElements }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: xLabels })] })] }));
};
exports.ChartLine = ChartLine;
(0, registry_1.registerStructure)('chart-line', {
    component: exports.ChartLine,
    composites: ['title', 'item', 'xTitle', 'yTitle'],
});
