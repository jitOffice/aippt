"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VSDivider = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const jsx_1 = require("../../../../jsx");
const defs_1 = require("../../../defs");
const types_1 = require("./types");
const VSDivider = (props) => {
    const { x, y, colorPrimary, colorBg } = props;
    // 设计时确定的固有尺寸
    const width = 100;
    const height = 100;
    const lightColor = (0, tinycolor2_1.default)(colorPrimary).lighten(20).toString();
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, { x: x, y: y, width: width, height: height, children: [(0, jsx_runtime_1.jsxs)(jsx_1.Defs, { children: [(0, jsx_runtime_1.jsx)("filter", { id: "vs-divider-glow-filter", x: "-50%", y: "-50%", width: "200%", height: "200%", children: (0, jsx_runtime_1.jsx)("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "8", result: "blur" }) }), (0, jsx_runtime_1.jsx)(defs_1.DropShadow, {})] }), (0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: 0, y: 0, width: width, height: height, fill: lightColor, filter: "url(#vs-divider-glow-filter)", opacity: 0.6 }), (0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: 0, y: 0, width: width, height: height, fill: colorPrimary, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)("text", { x: width / 2, y: height / 2, fontSize: Math.min(width, height) / 1.5, fontWeight: "bold", fill: colorBg, textAnchor: "middle", dominantBaseline: "central", filter: "url(#drop-shadow)", children: "VS" })] }));
};
exports.VSDivider = VSDivider;
(0, types_1.registerDivider)('vs', exports.VSDivider);
