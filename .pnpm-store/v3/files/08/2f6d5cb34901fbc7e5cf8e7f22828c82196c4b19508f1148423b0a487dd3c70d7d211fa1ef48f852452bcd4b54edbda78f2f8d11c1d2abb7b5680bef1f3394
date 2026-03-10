import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import tinycolor from 'tinycolor2';
import { Defs, Ellipse, Group } from '../../jsx/index.js';
import { ItemLabel } from '../components/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const CircleNode = (props) => {
    const [{ indexes, datum, themeColors, positionH = 'normal', width = 240, height = width, }, restProps,] = getItemProps(props, ['width', 'height']);
    const size = Math.min(width, height);
    const innerCircleSize = size * 0.7;
    const innerCircleOffset = (size - innerCircleSize) / 2;
    const labelSize = (innerCircleSize * Math.sqrt(2)) / 2;
    const labelOffset = (size - labelSize) / 2;
    const base = tinycolor(themeColors.colorPrimary);
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
    return (_jsxs(Group, Object.assign({}, restProps, { children: [_jsxs(Defs, { children: [_jsxs("linearGradient", Object.assign({ id: outerGradientId }, gradientDirection, { children: [_jsx("stop", { offset: "0%", stopColor: colorOuterStart }), _jsx("stop", { offset: "100%", stopColor: colorOuterEnd })] })), _jsxs("linearGradient", Object.assign({ id: innerGradientId }, gradientDirection, { children: [_jsx("stop", { offset: "0%", stopColor: colorInnerStart }), _jsx("stop", { offset: "100%", stopColor: colorInnerEnd })] }))] }), _jsx(Ellipse, { width: size, height: size, fill: `url(#${outerGradientId})`, "data-element-type": "shape" }), _jsx(Ellipse, { x: innerCircleOffset, y: innerCircleOffset, width: innerCircleSize, height: innerCircleSize, fill: `url(#${innerGradientId})`, stroke: "#FFFFFF", strokeWidth: 1, "data-element-type": "shape" }), _jsx(ItemLabel, { indexes: indexes, x: labelOffset, y: labelOffset, width: labelSize, height: labelSize, lineHeight: 1.1, alignHorizontal: "center", alignVertical: "middle", fill: colorText, fontWeight: "500", children: datum.label })] })));
};
registerItem('circle-node', {
    component: CircleNode,
    composites: ['label'],
});
function fadeWithWhite(color, mixPct, alpha) {
    return tinycolor.mix(color, '#ffffff', mixPct).setAlpha(alpha).toRgbString();
}
