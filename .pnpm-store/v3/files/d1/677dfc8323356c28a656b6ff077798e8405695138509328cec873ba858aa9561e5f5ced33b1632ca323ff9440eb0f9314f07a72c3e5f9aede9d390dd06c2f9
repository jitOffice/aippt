"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconBadge = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const IconBadge = (props) => {
    var _a;
    const [{ datum, indexes, size = 80, iconSize = 28, badgeSize = 24, gap = 8, themeColors, width = 84, height = 105, }, restProps,] = (0, utils_1.getItemProps)(props, ['size', 'iconSize', 'badgeSize', 'gap']);
    const value = (_a = datum.value) !== null && _a !== void 0 ? _a : 0;
    const gradientId = `${themeColors.colorPrimary}-icon`;
    const badgeGradientId = '#ff6b6b-badge';
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { width: width, height: height, children: [(0, jsx_runtime_1.jsxs)(jsx_1.Defs, { children: [(0, jsx_runtime_1.jsxs)("radialGradient", { id: gradientId, cx: "50%", cy: "30%", r: "70%", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: (0, tinycolor2_1.default)(themeColors.colorPrimary)
                                    .lighten(30)
                                    .toHexString() }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: themeColors.colorPrimary })] }), (0, jsx_runtime_1.jsxs)("linearGradient", { id: badgeGradientId, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: "#ff6b6b" }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: "#ee5a52" })] })] }), (0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: 0, y: 0, width: size, height: size, fill: `url(#${gradientId})`, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(components_1.ItemIcon, { indexes: indexes, x: (size - iconSize) / 2, y: (size - iconSize) / 2, size: iconSize, fill: themeColors.colorPrimaryText }), (0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: size - badgeSize + 4, width: badgeSize, height: badgeSize, fill: `url(#${badgeGradientId})` }), (0, jsx_runtime_1.jsx)(jsx_1.Text, { x: size - badgeSize + 4, width: badgeSize, height: badgeSize, fontSize: 10, fontWeight: "bold", fill: themeColors.colorWhite, alignHorizontal: "center", alignVertical: "middle", children: value > 99 ? '99+' : Math.round(value) }), (0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: 0, y: size + gap, width: size, alignHorizontal: "center", fontSize: 12, fill: themeColors.colorText, children: datum.label })] })));
};
exports.IconBadge = IconBadge;
(0, registry_1.registerItem)('icon-badge', {
    component: exports.IconBadge,
    composites: ['icon', 'label'],
});
