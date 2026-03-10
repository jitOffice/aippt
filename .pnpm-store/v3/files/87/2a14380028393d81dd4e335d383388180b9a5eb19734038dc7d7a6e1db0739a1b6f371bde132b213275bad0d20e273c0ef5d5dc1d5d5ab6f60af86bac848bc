"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorizontalIconLine = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const HorizontalIconLine = (props) => {
    const [{ indexes, datum, width = 160, themeColors, positionH = 'center', positionV = 'normal', }, restProps,] = (0, utils_1.getItemProps)(props, ['width']);
    const textAlignHorizontal = positionH === 'normal'
        ? 'left'
        : positionH === 'flipped'
            ? 'right'
            : 'center';
    const label = ((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: width, alignHorizontal: textAlignHorizontal, fill: themeColors.colorPrimary, children: datum.label }));
    const labelBounds = (0, jsx_1.getElementBounds)(label);
    const desc = datum.desc ? ((0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: width, fill: themeColors.colorTextSecondary, alignHorizontal: textAlignHorizontal, alignVertical: positionV === 'flipped' ? 'top' : 'bottom', children: datum.desc })) : null;
    const descBounds = (0, jsx_1.getElementBounds)(desc);
    const iconSize = 45;
    const icon = datum.icon ? ((0, jsx_runtime_1.jsx)(components_1.ItemIconCircle, { size: iconSize, indexes: indexes, colorBg: themeColors.colorBg, fill: themeColors.colorPrimary })) : null;
    const iconBounds = (0, jsx_1.getElementBounds)(icon);
    const time = datum.time ? ((0, jsx_runtime_1.jsx)(jsx_1.Text, { width: width, height: 30, alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorPrimary, fontSize: 18, fontWeight: "bold", children: datum.time })) : null;
    const timeBounds = (0, jsx_1.getElementBounds)(time);
    const lineHeight = 18;
    const line = ((0, jsx_runtime_1.jsxs)(layouts_1.AlignLayout, { horizontal: "center", vertical: "middle", width: width, height: lineHeight, children: [(0, jsx_runtime_1.jsx)(jsx_1.Rect, { width: width, height: lineHeight, fill: themeColors.colorPrimary, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { width: lineHeight + 6, height: lineHeight + 6, fill: themeColors.colorBg, fillOpacity: 0.5, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { width: 12, height: 12, fill: "white", "data-element-type": "shape" })] }));
    const textSideHeight = labelBounds.height + descBounds.height;
    const iconSideHeight = iconBounds.height + timeBounds.height + 5;
    // 平衡line两侧高度，使 line 位于垂直居中位置
    const heightDiff = Math.abs(iconSideHeight - textSideHeight);
    const topBalance = iconSideHeight > textSideHeight ? heightDiff : 0;
    const bottomBalance = textSideHeight > iconSideHeight ? heightDiff : 0;
    if (positionV === 'flipped') {
        return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, Object.assign({}, restProps, { flexDirection: "column", alignItems: "center", children: [(0, jsx_runtime_1.jsx)(components_1.Gap, { height: bottomBalance }), time, icon, (0, jsx_runtime_1.jsx)(components_1.Gap, { height: 5 }), line, label, desc, (0, jsx_runtime_1.jsx)(components_1.Gap, { height: topBalance })] })));
    }
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, Object.assign({}, restProps, { flexDirection: "column", alignItems: "center", children: [(0, jsx_runtime_1.jsx)(components_1.Gap, { height: topBalance }), label, desc, line, (0, jsx_runtime_1.jsx)(components_1.Gap, { height: 5 }), icon, time, (0, jsx_runtime_1.jsx)(components_1.Gap, { height: bottomBalance })] })));
};
exports.HorizontalIconLine = HorizontalIconLine;
(0, registry_1.registerItem)('horizontal-icon-line', {
    component: exports.HorizontalIconLine,
    composites: ['icon', 'label', 'desc'],
});
