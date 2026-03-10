"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundedRectNode = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const RoundedRectNode = (props) => {
    const [{ indexes, datum, themeColors, width = 300, height = 40, padding = 4, positionH = 'normal', }, restProps,] = (0, utils_1.getItemProps)(props, ['width', 'height', 'borderRadius', 'padding']);
    const borderRadius = height / 2;
    // Calculate text positioning
    const textX = borderRadius;
    const textY = padding;
    const textWidth = width - borderRadius * 2;
    const textHeight = height - padding * 2;
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Rect, { "data-element-type": "shape", width: width, height: height, rx: borderRadius, ry: borderRadius, fill: themeColors.colorPrimaryBg, stroke: themeColors.colorPrimary, strokeWidth: 1, opacity: 0.8 }), (0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: textX, y: textY, width: textWidth, height: textHeight, alignHorizontal: positionH === 'flipped'
                    ? 'right'
                    : positionH === 'center'
                        ? 'center'
                        : 'left', alignVertical: "middle", fontSize: 14, fontWeight: "500", fill: themeColors.colorText, children: datum.label })] })));
};
exports.RoundedRectNode = RoundedRectNode;
(0, registry_1.registerItem)('rounded-rect-node', {
    component: exports.RoundedRectNode,
    composites: ['label'],
});
