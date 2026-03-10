"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LetterCard = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
/**
 * 字母卡片组件
 * 用于显示大字母和标题
 * 支持渐变背景、斜纹和底部阴影效果
 */
const LetterCard = (props) => {
    var _a, _b;
    const [{ datum, indexes, width = 280, height = 160, showStripe = true, showGradient = true, showBottomShade = true, themeColors, }, restProps,] = (0, utils_1.getItemProps)(props, [
        'width',
        'height',
        'showStripe',
        'showGradient',
        'showBottomShade',
    ]);
    const displayLetter = (_a = datum.label) === null || _a === void 0 ? void 0 : _a[0].toUpperCase();
    const displayTitle = (_b = datum.label) === null || _b === void 0 ? void 0 : _b.toUpperCase();
    const baseColor = themeColors.colorPrimary;
    const base = (0, tinycolor2_1.default)(baseColor);
    const stripeWidth = 4;
    const gapWidth = 6;
    const rotationDeg = 45;
    const bottomShadeHeight = 40;
    const gradientLighten = 12;
    const gradientDarken = 4;
    const gradStart = base.clone().darken(gradientDarken).toHexString();
    const gradEnd = base.clone().lighten(gradientLighten).toHexString();
    const lightStripe = 'rgba(255, 255, 255, 0)';
    const darkStripe = 'rgba(0, 0, 0, 0.03)';
    const uniqueId = `letter-card-${indexes.join('-')}`;
    const gradientId = `${uniqueId}-gradient`;
    const patternId = `${uniqueId}-pattern`;
    const shadeId = `${uniqueId}-shade`;
    const tile = stripeWidth + gapWidth;
    const ratio = 1;
    const letterFontSize = 96;
    const letterHeight = letterFontSize * ratio;
    const titleFontSize = 16;
    const titleHeight = titleFontSize * ratio;
    const textGap = height / 16;
    const textTotalHeight = letterHeight + textGap + titleHeight;
    const letterY = (height - textTotalHeight) / 2;
    const titleY = letterY + letterHeight + textGap;
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { width: width, height: height, children: [(0, jsx_runtime_1.jsxs)(jsx_1.Defs, { children: [showGradient && ((0, jsx_runtime_1.jsxs)("linearGradient", { id: gradientId, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: gradStart }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: gradEnd })] })), showStripe && ((0, jsx_runtime_1.jsxs)("pattern", { id: patternId, patternUnits: "userSpaceOnUse", width: tile, height: tile, patternTransform: `rotate(${rotationDeg})`, children: [(0, jsx_runtime_1.jsx)("rect", { x: "0", y: "0", width: tile, height: tile, fill: lightStripe }), (0, jsx_runtime_1.jsx)("rect", { x: "0", y: "0", width: stripeWidth, height: tile, fill: darkStripe })] })), showBottomShade && ((0, jsx_runtime_1.jsxs)("linearGradient", { id: shadeId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: "rgba(0,0,0,0)" }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: "rgba(0,0,0,0.16)" })] }))] }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: 0, y: 0, width: width, height: height, fill: showGradient ? `url(#${gradientId})` : baseColor, rx: 0, ry: 0, "data-element-type": "shape" }), showStripe && ((0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: 0, y: 0, width: width, height: height, fill: `url(#${patternId})`, rx: 0, ry: 0 })), showBottomShade && ((0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: 0, y: height - bottomShadeHeight, width: width, height: bottomShadeHeight, fill: `url(#${shadeId})`, rx: 0, ry: 0 })), displayLetter && ((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: 0, y: letterY, width: width, fontSize: letterFontSize, fontWeight: "bold", fill: "#FFFFFF", alignHorizontal: "center", alignVertical: "top", lineHeight: 1, children: displayLetter })), (0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: 0, y: titleY, width: width, fontSize: titleFontSize, fontWeight: "bold", fill: "#FFFFFF", alignHorizontal: "center", alignVertical: "middle", lineHeight: 1, children: displayTitle })] })));
};
exports.LetterCard = LetterCard;
(0, registry_1.registerItem)('letter-card', {
    component: exports.LetterCard,
    composites: ['label'],
});
