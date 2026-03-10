import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Group, Rect } from '../../jsx/index.js';
import { ItemLabel } from '../components/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const RoundedRectNode = (props) => {
    const [{ indexes, datum, themeColors, width = 300, height = 40, padding = 4, positionH = 'normal', }, restProps,] = getItemProps(props, ['width', 'height', 'borderRadius', 'padding']);
    const borderRadius = height / 2;
    // Calculate text positioning
    const textX = borderRadius;
    const textY = padding;
    const textWidth = width - borderRadius * 2;
    const textHeight = height - padding * 2;
    return (_jsxs(Group, Object.assign({}, restProps, { children: [_jsx(Rect, { "data-element-type": "shape", width: width, height: height, rx: borderRadius, ry: borderRadius, fill: themeColors.colorPrimaryBg, stroke: themeColors.colorPrimary, strokeWidth: 1, opacity: 0.8 }), _jsx(ItemLabel, { indexes: indexes, x: textX, y: textY, width: textWidth, height: textHeight, alignHorizontal: positionH === 'flipped'
                    ? 'right'
                    : positionH === 'center'
                        ? 'center'
                        : 'left', alignVertical: "middle", fontSize: 14, fontWeight: "500", fill: themeColors.colorText, children: datum.label })] })));
};
registerItem('rounded-rect-node', {
    component: RoundedRectNode,
    composites: ['label'],
});
