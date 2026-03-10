"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorizontalIconArrow = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const HorizontalIconArrow = (props) => {
    const [{ indexes, datum, width = 140, themeColors, positionV = 'normal' }, restProps,] = (0, utils_1.getItemProps)(props, ['width']);
    const isVNormal = positionV !== 'flipped';
    const textAlignVertical = positionV === 'normal' ? 'bottom' : 'top';
    const label = ((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: width, fill: themeColors.colorText, alignHorizontal: "center", alignVertical: textAlignVertical, fontSize: 14, children: datum.label }));
    const desc = ((0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: width, fill: themeColors.colorTextSecondary, alignHorizontal: "center", alignVertical: textAlignVertical, children: datum.desc }));
    const icon = ((0, jsx_runtime_1.jsx)(components_1.ItemIconCircle, { indexes: indexes, fill: themeColors.colorPrimary, colorBg: themeColors.colorWhite }));
    const dotLine = ((0, jsx_runtime_1.jsx)(DotLine, { width: 8, height: 30, fill: themeColors.colorPrimary, positionV: positionV }));
    const dotLineGap = 5;
    const iconGap = 25;
    const arrowHeight = 30;
    const labelBounds = (0, jsx_1.getElementBounds)(label);
    const descBounds = (0, jsx_1.getElementBounds)(desc);
    const iconBounds = (0, jsx_1.getElementBounds)(icon);
    const dotLineBounds = (0, jsx_1.getElementBounds)(dotLine);
    const fixedGap = labelBounds.height +
        descBounds.height +
        dotLineGap +
        dotLineBounds.height -
        iconBounds.height -
        iconGap;
    const totalHeight = iconBounds.height +
        iconGap +
        arrowHeight +
        dotLineBounds.height +
        dotLineGap +
        labelBounds.height +
        descBounds.height;
    return ((0, jsx_runtime_1.jsx)(jsx_1.Group, Object.assign({ width: width, height: totalHeight }, restProps, { children: (0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { flexDirection: "column", alignItems: "center", children: [isVNormal ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [desc, label, (0, jsx_runtime_1.jsx)(components_1.Gap, { height: dotLineGap }), dotLine] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(components_1.Gap, { height: fixedGap }), icon, (0, jsx_runtime_1.jsx)(components_1.Gap, { height: iconGap })] })), (0, jsx_runtime_1.jsxs)(layouts_1.AlignLayout, { horizontal: "center", vertical: "middle", width: width, height: arrowHeight, children: [(0, jsx_runtime_1.jsx)(HorizontalArrow, { width: width, height: arrowHeight, fill: themeColors.colorPrimary }), (0, jsx_runtime_1.jsx)(jsx_1.Text, { width: width, height: arrowHeight, alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorWhite, fontWeight: "bold", fontSize: 16, children: datum.time
                                ? datum.time
                                : String(indexes[0] + 1)
                                    .padStart(2, '0')
                                    .slice(-2) })] }), !isVNormal ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [dotLine, (0, jsx_runtime_1.jsx)(components_1.Gap, { height: dotLineGap }), label, desc] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(components_1.Gap, { height: iconGap }), icon] }))] }) })));
};
exports.HorizontalIconArrow = HorizontalIconArrow;
const HorizontalArrow = (props) => {
    const { x = 0, y = 0, width = 100, height = 40, fill = '#FF356A', size = 10, } = props;
    return ((0, jsx_runtime_1.jsx)(jsx_1.Polygon, { width: width, height: height, points: [
            { x, y },
            { x: x + width - size, y },
            { x: x + width, y: y + height / 2 },
            { x: x + width - size, y: y + height },
            { x, y: y + height },
            { x: x + size, y: y + height / 2 },
        ], fill: fill, "data-element-type": "shape" }));
};
const DotLine = (props) => {
    const { x = 0, y = 0, width = 10, height = 50, fill, positionV = 'top', } = props;
    const r = width / 2;
    const lineLength = height - r;
    const strokeWidth = 2;
    const lineX = r;
    return ((0, jsx_runtime_1.jsxs)(components_1.ShapesGroup, { x: x, y: y, width: width, height: height, children: [(0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { width: width, height: width, fill: fill, y: positionV === 'top' ? 0 : lineLength - r }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: positionV === 'top'
                    ? `M${lineX},${r} L${lineX},${r + lineLength}`
                    : `M${lineX},0 L${lineX},${lineLength - r}`, strokeWidth: strokeWidth, stroke: fill })] }));
};
(0, registry_1.registerItem)('horizontal-icon-arrow', {
    component: exports.HorizontalIconArrow,
    composites: ['icon', 'label', 'desc', 'time'],
});
