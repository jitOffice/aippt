import { jsx as _jsx, jsxs as _jsxs } from "../../../../jsx-runtime.js";
import tinycolor from 'tinycolor2';
import { Defs, Ellipse, Group } from '../../../../jsx/index.js';
import { DropShadow } from '../../../defs/index.js';
import { registerDivider } from './types.js';
export const VSDivider = (props) => {
    const { x, y, colorPrimary, colorBg } = props;
    // 设计时确定的固有尺寸
    const width = 100;
    const height = 100;
    const lightColor = tinycolor(colorPrimary).lighten(20).toString();
    return (_jsxs(Group, { x: x, y: y, width: width, height: height, children: [_jsxs(Defs, { children: [_jsx("filter", { id: "vs-divider-glow-filter", x: "-50%", y: "-50%", width: "200%", height: "200%", children: _jsx("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "8", result: "blur" }) }), _jsx(DropShadow, {})] }), _jsx(Ellipse, { x: 0, y: 0, width: width, height: height, fill: lightColor, filter: "url(#vs-divider-glow-filter)", opacity: 0.6 }), _jsx(Ellipse, { x: 0, y: 0, width: width, height: height, fill: colorPrimary, "data-element-type": "shape" }), _jsx("text", { x: width / 2, y: height / 2, fontSize: Math.min(width, height) / 1.5, fontWeight: "bold", fill: colorBg, textAnchor: "middle", dominantBaseline: "central", filter: "url(#drop-shadow)", children: "VS" })] }));
};
registerDivider('vs', VSDivider);
