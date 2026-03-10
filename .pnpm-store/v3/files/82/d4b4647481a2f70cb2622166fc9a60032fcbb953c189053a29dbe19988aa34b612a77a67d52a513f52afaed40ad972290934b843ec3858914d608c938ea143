"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerticalIconArrow = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const Align_1 = require("../layouts/Align");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const VerticalIconArrow = (props) => {
    const [{ indexes, datum, height = 140, themeColors, positionH = 'normal' }, restProps,] = (0, utils_1.getItemProps)(props, ['height']);
    const isHNormal = positionH !== 'flipped';
    const textAlignHorizontal = isHNormal ? 'right' : 'left';
    const label = ((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: 120, fill: themeColors.colorText, alignHorizontal: textAlignHorizontal, alignVertical: "middle", fontSize: 14, children: datum.label }));
    const desc = ((0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: 120, fill: themeColors.colorTextSecondary, alignHorizontal: textAlignHorizontal, alignVertical: "top", children: datum.desc }));
    const icon = ((0, jsx_runtime_1.jsx)(components_1.ItemIconCircle, { indexes: indexes, fill: themeColors.colorPrimary, colorBg: themeColors.colorWhite }));
    const dotLine = ((0, jsx_runtime_1.jsx)(DotLine, { width: 30, height: 8, fill: themeColors.colorPrimary, positionH: positionH }));
    const isNormal = positionH !== 'flipped';
    const dotLineGap = 5;
    const iconGap = 25;
    const arrowWidth = 30;
    const labelBounds = (0, jsx_1.getElementBounds)(label);
    const iconBounds = (0, jsx_1.getElementBounds)(icon);
    const dotLineBounds = (0, jsx_1.getElementBounds)(dotLine);
    const fixedGap = labelBounds.width +
        dotLineGap +
        dotLineBounds.width -
        iconBounds.width -
        iconGap;
    const totalWidth = Math.max(labelBounds.width + dotLineGap + dotLineBounds.width, iconGap + iconBounds.width) *
        2 +
        arrowWidth;
    return ((0, jsx_runtime_1.jsx)(jsx_1.Group, Object.assign({ width: totalWidth, height: height }, restProps, { children: (0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { flexDirection: "row", alignItems: "center", children: [isNormal ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { flexDirection: "column", alignItems: "flex-end", children: [label, desc] }), (0, jsx_runtime_1.jsx)(components_1.Gap, { width: dotLineGap }), dotLine] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(components_1.Gap, { width: fixedGap }), icon, (0, jsx_runtime_1.jsx)(components_1.Gap, { width: iconGap })] })), (0, jsx_runtime_1.jsxs)(Align_1.AlignLayout, { horizontal: "center", vertical: "middle", children: [(0, jsx_runtime_1.jsx)(VerticalArrow, { width: arrowWidth, height: height, fill: themeColors.colorPrimary }), (0, jsx_runtime_1.jsx)(jsx_1.Text, { width: arrowWidth, height: height, alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorWhite, fontWeight: "bold", fontSize: 16, children: String(indexes[0] + 1)
                                .padStart(2, '0')
                                .slice(-2) })] }), !isNormal ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [dotLine, (0, jsx_runtime_1.jsx)(components_1.Gap, { width: dotLineGap }), (0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { flexDirection: "column", alignItems: "flex-start", children: [label, desc] })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(components_1.Gap, { width: iconGap }), icon] }))] }) })));
};
exports.VerticalIconArrow = VerticalIconArrow;
const VerticalArrow = (props) => {
    const { x = 0, y = 0, width = 30, height = 100, fill = '#FF356A', size = 10, } = props;
    return ((0, jsx_runtime_1.jsx)(jsx_1.Polygon, { width: width, height: height, points: [
            { x, y },
            { x: x + width / 2, y: y + size },
            { x: x + width, y },
            { x: x + width, y: y + height - size },
            { x: x + width / 2, y: y + height },
            { x, y: y + height - size },
        ], fill: fill, "data-element-type": "shape" }));
};
const DotLine = (props) => {
    const { x = 0, y = 0, width = 50, height = 10, fill, positionH = 'normal', } = props;
    const r = height / 2;
    const lineLength = width - r;
    const strokeWidth = 2;
    const lineY = r;
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, { x: x, y: y, width: width, height: height, children: [(0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { width: height, height: height, fill: fill, x: positionH === 'normal' ? 0 : lineLength - r, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: positionH === 'normal'
                    ? `M${r},${lineY} L${r + lineLength},${lineY}`
                    : `M0,${lineY} L${lineLength - r},${lineY}`, strokeWidth: strokeWidth, stroke: fill, "data-element-type": "shape" })] }));
};
(0, registry_1.registerItem)('vertical-icon-arrow', {
    component: exports.VerticalIconArrow,
    composites: ['icon', 'label', 'desc'],
});
