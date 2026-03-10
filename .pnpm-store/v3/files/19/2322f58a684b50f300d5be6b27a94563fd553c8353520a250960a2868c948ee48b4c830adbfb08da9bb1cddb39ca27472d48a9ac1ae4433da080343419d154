import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Ellipse, getElementBounds, Group, Path, Polygon, Text, } from '../../jsx/index.js';
import { Gap, ItemDesc, ItemIconCircle, ItemLabel, ShapesGroup, } from '../components/index.js';
import { AlignLayout, FlexLayout } from '../layouts/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const HorizontalIconArrow = (props) => {
    const [{ indexes, datum, width = 140, themeColors, positionV = 'normal' }, restProps,] = getItemProps(props, ['width']);
    const isVNormal = positionV !== 'flipped';
    const textAlignVertical = positionV === 'normal' ? 'bottom' : 'top';
    const label = (_jsx(ItemLabel, { indexes: indexes, width: width, fill: themeColors.colorText, alignHorizontal: "center", alignVertical: textAlignVertical, fontSize: 14, children: datum.label }));
    const desc = (_jsx(ItemDesc, { indexes: indexes, width: width, fill: themeColors.colorTextSecondary, alignHorizontal: "center", alignVertical: textAlignVertical, children: datum.desc }));
    const icon = (_jsx(ItemIconCircle, { indexes: indexes, fill: themeColors.colorPrimary, colorBg: themeColors.colorWhite }));
    const dotLine = (_jsx(DotLine, { width: 8, height: 30, fill: themeColors.colorPrimary, positionV: positionV }));
    const dotLineGap = 5;
    const iconGap = 25;
    const arrowHeight = 30;
    const labelBounds = getElementBounds(label);
    const descBounds = getElementBounds(desc);
    const iconBounds = getElementBounds(icon);
    const dotLineBounds = getElementBounds(dotLine);
    const fixedGap = labelBounds.height +
        descBounds.height +
        dotLineGap +
        dotLineBounds.height -
        iconBounds.height -
        iconGap;
    const totalHeight = iconBounds.height +
        iconGap +
        arrowHeight +
        dotLineBounds.height +
        dotLineGap +
        labelBounds.height +
        descBounds.height;
    return (_jsx(Group, Object.assign({ width: width, height: totalHeight }, restProps, { children: _jsxs(FlexLayout, { flexDirection: "column", alignItems: "center", children: [isVNormal ? (_jsxs(_Fragment, { children: [desc, label, _jsx(Gap, { height: dotLineGap }), dotLine] })) : (_jsxs(_Fragment, { children: [_jsx(Gap, { height: fixedGap }), icon, _jsx(Gap, { height: iconGap })] })), _jsxs(AlignLayout, { horizontal: "center", vertical: "middle", width: width, height: arrowHeight, children: [_jsx(HorizontalArrow, { width: width, height: arrowHeight, fill: themeColors.colorPrimary }), _jsx(Text, { width: width, height: arrowHeight, alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorWhite, fontWeight: "bold", fontSize: 16, children: datum.time
                                ? datum.time
                                : String(indexes[0] + 1)
                                    .padStart(2, '0')
                                    .slice(-2) })] }), !isVNormal ? (_jsxs(_Fragment, { children: [dotLine, _jsx(Gap, { height: dotLineGap }), label, desc] })) : (_jsxs(_Fragment, { children: [_jsx(Gap, { height: iconGap }), icon] }))] }) })));
};
const HorizontalArrow = (props) => {
    const { x = 0, y = 0, width = 100, height = 40, fill = '#FF356A', size = 10, } = props;
    return (_jsx(Polygon, { width: width, height: height, points: [
            { x, y },
            { x: x + width - size, y },
            { x: x + width, y: y + height / 2 },
            { x: x + width - size, y: y + height },
            { x, y: y + height },
            { x: x + size, y: y + height / 2 },
        ], fill: fill, "data-element-type": "shape" }));
};
const DotLine = (props) => {
    const { x = 0, y = 0, width = 10, height = 50, fill, positionV = 'top', } = props;
    const r = width / 2;
    const lineLength = height - r;
    const strokeWidth = 2;
    const lineX = r;
    return (_jsxs(ShapesGroup, { x: x, y: y, width: width, height: height, children: [_jsx(Ellipse, { width: width, height: width, fill: fill, y: positionV === 'top' ? 0 : lineLength - r }), _jsx(Path, { d: positionV === 'top'
                    ? `M${lineX},${r} L${lineX},${r + lineLength}`
                    : `M${lineX},0 L${lineX},${lineLength - r}`, strokeWidth: strokeWidth, stroke: fill })] }));
};
registerItem('horizontal-icon-arrow', {
    component: HorizontalIconArrow,
    composites: ['icon', 'label', 'desc', 'time'],
});
