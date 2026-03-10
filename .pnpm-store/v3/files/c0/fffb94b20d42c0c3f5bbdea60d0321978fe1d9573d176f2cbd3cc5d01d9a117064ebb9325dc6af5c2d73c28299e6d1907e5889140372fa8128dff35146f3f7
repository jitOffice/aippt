"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleHorizontalArrow = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const Align_1 = require("../layouts/Align");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const SimpleHorizontalArrow = (props) => {
    const [{ indexes, datum, width = 140, themeColors, positionV = 'normal' }, restProps,] = (0, utils_1.getItemProps)(props, ['width']);
    const isVNormal = positionV !== 'flipped';
    const textAlignVertical = isVNormal ? 'bottom' : 'top';
    const label = ((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: width, fill: themeColors.colorText, alignHorizontal: "center", alignVertical: textAlignVertical, fontSize: 14, children: datum.label }));
    const desc = ((0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: width, fill: themeColors.colorTextSecondary, alignHorizontal: "center", alignVertical: textAlignVertical, children: datum.desc }));
    const arrowHeight = 30;
    const labelGap = 10;
    const labelBounds = (0, jsx_1.getElementBounds)(label);
    const descBounds = (0, jsx_1.getElementBounds)(desc);
    const textHeight = labelBounds.height + descBounds.height;
    const totalHeight = textHeight + labelGap + arrowHeight + labelGap + textHeight;
    return ((0, jsx_runtime_1.jsx)(jsx_1.Group, Object.assign({ width: width, height: totalHeight }, restProps, { children: (0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { flexDirection: "column", alignItems: "center", children: [isVNormal ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [desc, label, (0, jsx_runtime_1.jsx)(components_1.Gap, { height: labelGap })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(components_1.Gap, { height: textHeight + labelGap }) })), (0, jsx_runtime_1.jsxs)(Align_1.AlignLayout, { horizontal: "center", vertical: "middle", children: [(0, jsx_runtime_1.jsx)(HorizontalArrow, { width: width, height: arrowHeight, fill: themeColors.colorPrimary }), (0, jsx_runtime_1.jsx)(jsx_1.Text, { width: width, height: arrowHeight, alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorWhite, fontWeight: "bold", fontSize: 16, children: datum.time
                                ? datum.time
                                : String(indexes[0] + 1)
                                    .padStart(2, '0')
                                    .slice(-2) })] }), !isVNormal ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(components_1.Gap, { height: labelGap }), label, desc] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(components_1.Gap, { height: textHeight + labelGap }) }))] }) })));
};
exports.SimpleHorizontalArrow = SimpleHorizontalArrow;
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
(0, registry_1.registerItem)('simple-horizontal-arrow', {
    component: exports.SimpleHorizontalArrow,
    composites: ['label', 'desc', 'time'],
});
