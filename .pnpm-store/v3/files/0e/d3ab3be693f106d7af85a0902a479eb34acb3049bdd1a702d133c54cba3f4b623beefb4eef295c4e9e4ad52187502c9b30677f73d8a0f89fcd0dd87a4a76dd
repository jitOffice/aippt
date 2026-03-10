"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleVerticalArrow = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const Align_1 = require("../layouts/Align");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const SimpleVerticalArrow = (props) => {
    const [{ indexes, datum, height = 140, themeColors, positionH = 'normal' }, restProps,] = (0, utils_1.getItemProps)(props, ['height']);
    const textAlignHorizontal = positionH === 'normal' ? 'right' : 'left';
    const label = ((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: 120, fill: themeColors.colorText, alignHorizontal: textAlignHorizontal, alignVertical: "middle", fontSize: 14, children: datum.label }));
    const desc = ((0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: 120, fill: themeColors.colorTextSecondary, alignHorizontal: textAlignHorizontal, alignVertical: "top", children: datum.desc }));
    const isNormal = positionH !== 'flipped';
    const labelGap = 15;
    const arrowWidth = 30;
    const textWidth = 120;
    const totalWidth = textWidth + labelGap + arrowWidth + labelGap + textWidth;
    return ((0, jsx_runtime_1.jsx)(jsx_1.Group, Object.assign({ width: totalWidth, height: height }, restProps, { children: (0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { flexDirection: "row", alignItems: "center", children: [isNormal ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { flexDirection: "column", alignItems: "flex-end", children: [label, desc] }), (0, jsx_runtime_1.jsx)(components_1.Gap, { width: labelGap })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(components_1.Gap, { width: textWidth + labelGap }) })), (0, jsx_runtime_1.jsxs)(Align_1.AlignLayout, { horizontal: "center", vertical: "middle", children: [(0, jsx_runtime_1.jsx)(VerticalArrow, { width: arrowWidth, height: height, fill: themeColors.colorPrimary }), (0, jsx_runtime_1.jsx)(jsx_1.Text, { width: arrowWidth, height: height, alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorWhite, fontWeight: "bold", fontSize: 16, children: String(indexes[0] + 1)
                                .padStart(2, '0')
                                .slice(-2) })] }), !isNormal ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(components_1.Gap, { width: labelGap }), (0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { flexDirection: "column", alignItems: "flex-start", children: [label, desc] })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(components_1.Gap, { width: textWidth + labelGap }) }))] }) })));
};
exports.SimpleVerticalArrow = SimpleVerticalArrow;
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
(0, registry_1.registerItem)('simple-vertical-arrow', {
    component: exports.SimpleVerticalArrow,
    composites: ['label', 'desc'],
});
