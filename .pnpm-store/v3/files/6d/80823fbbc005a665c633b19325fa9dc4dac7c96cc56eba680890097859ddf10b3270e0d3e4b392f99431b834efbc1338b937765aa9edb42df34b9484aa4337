import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { scaleLinear } from 'd3';
import tinycolor from 'tinycolor2';
import { Defs, Group, Rect, Text } from '../../jsx/index.js';
import { parsePadding } from '../../utils/index.js';
import { ItemsGroup } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { getPaletteColor, getThemeColors } from '../utils/index.js';
import { registerStructure } from './registry.js';
export const ChartColumn = (props) => {
    const { Title, Item, data, columnGap = 60, columnWidth = 50, padding = 20, showValue = true, options, valueFormatter = (value) => value.toString(), } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    if (items.length === 0) {
        return (_jsx(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: titleContent }));
    }
    const themeColors = getThemeColors(options.themeConfig);
    const values = items.map((item) => { var _a; return (_a = item.value) !== null && _a !== void 0 ? _a : 0; });
    const sortedValues = [...values, 0].sort((a, b) => a - b);
    const hasNegative = sortedValues[0] < 0;
    const chartWidth = items.length * columnWidth + (items.length - 1) * columnGap;
    const chartHeight = 300;
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = parsePadding(padding);
    // Add extra space for negative value labels if needed
    const valueTextHeight = showValue ? 24 : 0; // Estimated height for value text
    const itemGap = 10;
    const extraBottomSpace = hasNegative && showValue ? valueTextHeight + itemGap : itemGap;
    const totalWidth = chartWidth + paddingLeft + paddingRight;
    const totalHeight = chartHeight + paddingTop + paddingBottom + extraBottomSpace;
    const yScale = scaleLinear()
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
        const color = getPaletteColor(options, [index]) || themeColors.colorPrimary;
        const gradientPositiveId = `${color}-column-positive-${index}`;
        const gradientNegativeId = `${color}-column-negative-${index}`;
        // Create gradient definition for this column
        gradientDefs.push(_jsxs("linearGradient", { id: value >= 0 ? gradientPositiveId : gradientNegativeId, x1: "0%", y1: value >= 0 ? '0%' : '100%', x2: "0%", y2: value >= 0 ? '100%' : '0%', children: [_jsx("stop", { offset: "0%", stopColor: color }), _jsx("stop", { offset: "100%", stopColor: tinycolor.mix(color, '#fff', 40).toHexString() })] }));
        // Column
        columnElements.push(_jsx(Rect, { x: columnX, y: paddingTop + columnY, width: columnWidth, height: columnHeight, fill: `url(#${value >= 0 ? gradientPositiveId : gradientNegativeId})`, rx: 8, ry: 8, "data-element-type": "shape" }));
        // Value text
        if (showValue) {
            valueElements.push(_jsx(Text, { x: columnX + columnWidth / 2, y: value >= 0
                    ? paddingTop + columnY - 10
                    : paddingTop + columnY + columnHeight + 20, fontSize: 16, fontWeight: "bold", alignHorizontal: "center", alignVertical: value >= 0 ? 'bottom' : 'top', fill: color, children: valueFormatter(value, item) }));
        }
        // Item (label)
        const itemWidth = columnWidth + columnGap;
        const itemY = paddingTop + chartHeight + extraBottomSpace;
        itemElements.push(_jsx(Item, { indexes: indexes, datum: item, data: data, x: columnX + columnWidth / 2 - itemWidth / 2, y: itemY, width: itemWidth, positionH: "center" }));
    });
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { width: totalWidth, height: totalHeight, children: [_jsx(Defs, { children: gradientDefs }), _jsx(Group, { children: columnElements }), _jsx(Group, { children: valueElements }), _jsx(ItemsGroup, { children: itemElements })] })] }));
};
registerStructure('chart-column', {
    component: ChartColumn,
    composites: ['title', 'item'],
});
