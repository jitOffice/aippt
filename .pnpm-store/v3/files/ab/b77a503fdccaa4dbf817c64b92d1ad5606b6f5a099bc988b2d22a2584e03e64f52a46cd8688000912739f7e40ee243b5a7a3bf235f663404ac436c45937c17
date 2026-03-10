import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Ellipse, Group, Rect } from '../../jsx/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const SimpleCircleNode = (props) => {
    const [{ width = 24, height = width, strokeWidth = 2, themeColors, datum }, restProps,] = getItemProps(props, ['width', 'height']);
    const size = Math.min(width, height) - strokeWidth;
    const offset = strokeWidth / 2;
    return (_jsxs(Group, Object.assign({}, restProps, { width: width, height: height, children: [_jsx(Rect, { width: width, height: height, fill: "none", visibility: "hidden" }), _jsx(Ellipse, { x: offset, y: offset, width: size, height: size, fill: themeColors.colorPrimary, stroke: themeColors.isDarkMode ? '#FFF' : '#000', strokeWidth: strokeWidth, "data-element-type": "shape", children: _jsx("title", { children: datum.label || datum.desc }) })] })));
};
registerItem('simple-circle-node', {
    component: SimpleCircleNode,
    composites: [],
});
