"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleCircleNode = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const SimpleCircleNode = (props) => {
    const [{ width = 24, height = width, strokeWidth = 2, themeColors, datum }, restProps,] = (0, utils_1.getItemProps)(props, ['width', 'height']);
    const size = Math.min(width, height) - strokeWidth;
    const offset = strokeWidth / 2;
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { width: width, height: height, children: [(0, jsx_runtime_1.jsx)(jsx_1.Rect, { width: width, height: height, fill: "none", visibility: "hidden" }), (0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: offset, y: offset, width: size, height: size, fill: themeColors.colorPrimary, stroke: themeColors.isDarkMode ? '#FFF' : '#000', strokeWidth: strokeWidth, "data-element-type": "shape", children: (0, jsx_runtime_1.jsx)("title", { children: datum.label || datum.desc }) })] })));
};
exports.SimpleCircleNode = SimpleCircleNode;
(0, registry_1.registerItem)('simple-circle-node', {
    component: exports.SimpleCircleNode,
    composites: [],
});
