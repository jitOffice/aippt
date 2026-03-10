"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularProgress = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const CircularProgress = (props) => {
    var _a;
    const [{ datum, indexes, size = 120, strokeWidth = 12, gap = 8, themeColors, valueFormatter = (value) => `${Math.round(value)}%`, }, restProps,] = (0, utils_1.getItemProps)(props, ['size', 'strokeWidth', 'gap']);
    const value = (_a = datum.value) !== null && _a !== void 0 ? _a : 0;
    const maxValue = 100;
    const percentage = Math.min(Math.max(value / maxValue, 0), 1);
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const start = strokeWidth / 2;
    const d = size - strokeWidth;
    const isFullCircle = percentage >= 1;
    const angle = percentage * 360;
    const pathData = describeArc(center, center, radius, 0, angle);
    const bounds = { x: start, y: start, width: d, height: d };
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { width: size, height: size + gap + 20, children: [(0, jsx_runtime_1.jsx)(jsx_1.Rect, { width: size, height: size, fill: "none" }), (0, jsx_runtime_1.jsx)(jsx_1.Ellipse, Object.assign({}, bounds, { fill: "none", stroke: "#f0f0f0", strokeWidth: strokeWidth, "data-element-type": "shape" })), isFullCircle ? ((0, jsx_runtime_1.jsx)(jsx_1.Ellipse, Object.assign({}, bounds, { fill: "none", stroke: themeColors.colorPrimary, strokeWidth: strokeWidth, "data-element-type": "shape" }))) : ((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: pathData, fill: "none", stroke: themeColors.colorPrimary, strokeWidth: strokeWidth, strokeLinecap: "round", "data-element-type": "shape" })), (0, jsx_runtime_1.jsx)(components_1.ItemValue, { indexes: indexes, x: strokeWidth, y: strokeWidth, width: d - strokeWidth, height: d - strokeWidth, fontSize: 24, fontWeight: "bold", fill: themeColors.colorPrimary, alignHorizontal: "center", alignVertical: "middle", value: value, formatter: valueFormatter }), (0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: 0, y: size + gap, width: size, alignHorizontal: "center", fontSize: 12, fill: themeColors.colorTextSecondary, children: datum.label })] })));
};
exports.CircularProgress = CircularProgress;
function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}
function polarToCartesian(cx, cy, radius, angleInDegrees) {
    const rad = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
        x: cx + radius * Math.cos(rad),
        y: cy + radius * Math.sin(rad),
    };
}
(0, registry_1.registerItem)('circular-progress', {
    component: exports.CircularProgress,
    composites: ['label', 'value'],
});
