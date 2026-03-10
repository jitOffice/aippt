"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text3d = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
/**
 * A 3D text component with layered shadows to create a depth effect
 *
 * The component renders three layers of text:
 * 1. Deep shadow layer (most offset, lowest opacity)
 * 2. Mid shadow layer (medium offset, medium opacity)
 * 3. Main text layer (no offset, full opacity)
 */
const Text3d = ({ text, x = 0, y = 0, fontSize = 56, fontWeight = 'bold', fill = '#FFFFFF', textAnchor = 'middle', dominantBaseline = 'middle', shadowOffsetX = 2, shadowOffsetY = 4, midShadowOffsetX = 1, midShadowOffsetY = 2, deepShadowOpacity = 0.3, midShadowOpacity = 0.5, }) => {
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)("text", { x: x, y: y, fontSize: fontSize, fontWeight: fontWeight, fill: fill, fillOpacity: deepShadowOpacity, textAnchor: textAnchor, dominantBaseline: dominantBaseline, transform: `translate(${shadowOffsetX}, ${shadowOffsetY})`, children: text }), (0, jsx_runtime_1.jsx)("text", { x: x, y: y, fontSize: fontSize, fontWeight: fontWeight, fill: fill, fillOpacity: midShadowOpacity, textAnchor: textAnchor, dominantBaseline: dominantBaseline, transform: `translate(${midShadowOffsetX}, ${midShadowOffsetY})`, children: text }), (0, jsx_runtime_1.jsx)("text", { x: x, y: y, fontSize: fontSize, fontWeight: fontWeight, fill: fill, textAnchor: textAnchor, dominantBaseline: dominantBaseline, children: text })] }));
};
exports.Text3d = Text3d;
