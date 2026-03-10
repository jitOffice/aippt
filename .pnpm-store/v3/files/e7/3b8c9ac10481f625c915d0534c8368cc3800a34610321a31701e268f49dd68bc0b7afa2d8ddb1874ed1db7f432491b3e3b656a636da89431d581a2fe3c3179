"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleNode = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const CircleNode = (props) => {
    const [{ indexes, datum, themeColors, positionH = 'normal', width = 240, height = width, }, restProps,] = (0, utils_1.getItemProps)(props, ['width', 'height']);
    const size = Math.min(width, height);
    const innerCircleSize = size * 0.7;
    const innerCircleOffset = (size - innerCircleSize) / 2;
    const labelSize = (innerCircleSize * Math.sqrt(2)) / 2;
    const labelOffset = (size - labelSize) / 2;
    const base = (0, tinycolor2_1.default)(themeColors.colorPrimary);
    const colorOuterStart = fadeWithWhite(base, 80, 0.2);
    const colorOuterEnd = fadeWithWhite(base, 20, 0.8);
    const colorInnerStart = fadeWithWhite(base, 75, 0.32);
    const colorInnerEnd = fadeWithWhite(base, 45, 0.4);
    const colorText = base.clone().darken(5).toRgbString();
    const outerGradientId = `${themeColors.colorPrimary}-${positionH}-outer`;
    const innerGradientId = `${themeColors.colorPrimary}-${positionH}-inner`;
    const gradientDirection = positionH === 'flipped'
        ? { x1: '0%', y1: '0%', x2: '100%', y2: '0%' }
        : { x1: '100%', y1: '0%', x2: '0%', y2: '0%' };
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { children: [(0, jsx_runtime_1.jsxs)(jsx_1.Defs, { children: [(0, jsx_runtime_1.jsxs)("linearGradient", Object.assign({ id: outerGradientId }, gradientDirection, { children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: colorOuterStart }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: colorOuterEnd })] })), (0, jsx_runtime_1.jsxs)("linearGradient", Object.assign({ id: innerGradientId }, gradientDirection, { children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: colorInnerStart }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: colorInnerEnd })] }))] }), (0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { width: size, height: size, fill: `url(#${outerGradientId})`, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: innerCircleOffset, y: innerCircleOffset, width: innerCircleSize, height: innerCircleSize, fill: `url(#${innerGradientId})`, stroke: "#FFFFFF", strokeWidth: 1, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: labelOffset, y: labelOffset, width: labelSize, height: labelSize, lineHeight: 1.1, alignHorizontal: "center", alignVertical: "middle", fill: colorText, fontWeight: "500", children: datum.label })] })));
};
exports.CircleNode = CircleNode;
(0, registry_1.registerItem)('circle-node', {
    component: exports.CircleNode,
    composites: ['label'],
});
function fadeWithWhite(color, mixPct, alpha) {
    return tinycolor2_1.default.mix(color, '#ffffff', mixPct).setAlpha(alpha).toRgbString();
}
