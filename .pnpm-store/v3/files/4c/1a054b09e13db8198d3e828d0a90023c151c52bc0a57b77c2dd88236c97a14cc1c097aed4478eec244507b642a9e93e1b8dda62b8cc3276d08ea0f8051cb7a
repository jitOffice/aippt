import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Group } from '../../jsx/index.js';
/**
 * A 3D text component with layered shadows to create a depth effect
 *
 * The component renders three layers of text:
 * 1. Deep shadow layer (most offset, lowest opacity)
 * 2. Mid shadow layer (medium offset, medium opacity)
 * 3. Main text layer (no offset, full opacity)
 */
export const Text3d = ({ text, x = 0, y = 0, fontSize = 56, fontWeight = 'bold', fill = '#FFFFFF', textAnchor = 'middle', dominantBaseline = 'middle', shadowOffsetX = 2, shadowOffsetY = 4, midShadowOffsetX = 1, midShadowOffsetY = 2, deepShadowOpacity = 0.3, midShadowOpacity = 0.5, }) => {
    return (_jsxs(Group, { children: [_jsx("text", { x: x, y: y, fontSize: fontSize, fontWeight: fontWeight, fill: fill, fillOpacity: deepShadowOpacity, textAnchor: textAnchor, dominantBaseline: dominantBaseline, transform: `translate(${shadowOffsetX}, ${shadowOffsetY})`, children: text }), _jsx("text", { x: x, y: y, fontSize: fontSize, fontWeight: fontWeight, fill: fill, fillOpacity: midShadowOpacity, textAnchor: textAnchor, dominantBaseline: dominantBaseline, transform: `translate(${midShadowOffsetX}, ${midShadowOffsetY})`, children: text }), _jsx("text", { x: x, y: y, fontSize: fontSize, fontWeight: fontWeight, fill: fill, textAnchor: textAnchor, dominantBaseline: dominantBaseline, children: text })] }));
};
