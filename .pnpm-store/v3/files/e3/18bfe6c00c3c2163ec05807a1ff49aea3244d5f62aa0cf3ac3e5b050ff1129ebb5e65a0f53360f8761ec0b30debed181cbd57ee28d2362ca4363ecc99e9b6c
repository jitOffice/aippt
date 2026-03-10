import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../../jsx-runtime.js";
import { Ellipse, getElementBounds, Group, Path, Polygon, Text, } from '../../jsx/index.js';
import { Gap, ItemDesc, ItemIconCircle, ItemLabel } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { AlignLayout } from '../layouts/Align.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const VerticalIconArrow = (props) => {
    const [{ indexes, datum, height = 140, themeColors, positionH = 'normal' }, restProps,] = getItemProps(props, ['height']);
    const isHNormal = positionH !== 'flipped';
    const textAlignHorizontal = isHNormal ? 'right' : 'left';
    const label = (_jsx(ItemLabel, { indexes: indexes, width: 120, fill: themeColors.colorText, alignHorizontal: textAlignHorizontal, alignVertical: "middle", fontSize: 14, children: datum.label }));
    const desc = (_jsx(ItemDesc, { indexes: indexes, width: 120, fill: themeColors.colorTextSecondary, alignHorizontal: textAlignHorizontal, alignVertical: "top", children: datum.desc }));
    const icon = (_jsx(ItemIconCircle, { indexes: indexes, fill: themeColors.colorPrimary, colorBg: themeColors.colorWhite }));
    const dotLine = (_jsx(DotLine, { width: 30, height: 8, fill: themeColors.colorPrimary, positionH: positionH }));
    const isNormal = positionH !== 'flipped';
    const dotLineGap = 5;
    const iconGap = 25;
    const arrowWidth = 30;
    const labelBounds = getElementBounds(label);
    const iconBounds = getElementBounds(icon);
    const dotLineBounds = getElementBounds(dotLine);
    const fixedGap = labelBounds.width +
        dotLineGap +
        dotLineBounds.width -
        iconBounds.width -
        iconGap;
    const totalWidth = Math.max(labelBounds.width + dotLineGap + dotLineBounds.width, iconGap + iconBounds.width) *
        2 +
        arrowWidth;
    return (_jsx(Group, Object.assign({ width: totalWidth, height: height }, restProps, { children: _jsxs(FlexLayout, { flexDirection: "row", alignItems: "center", children: [isNormal ? (_jsxs(_Fragment, { children: [_jsxs(FlexLayout, { flexDirection: "column", alignItems: "flex-end", children: [label, desc] }), _jsx(Gap, { width: dotLineGap }), dotLine] })) : (_jsxs(_Fragment, { children: [_jsx(Gap, { width: fixedGap }), icon, _jsx(Gap, { width: iconGap })] })), _jsxs(AlignLayout, { horizontal: "center", vertical: "middle", children: [_jsx(VerticalArrow, { width: arrowWidth, height: height, fill: themeColors.colorPrimary }), _jsx(Text, { width: arrowWidth, height: height, alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorWhite, fontWeight: "bold", fontSize: 16, children: String(indexes[0] + 1)
                                .padStart(2, '0')
                                .slice(-2) })] }), !isNormal ? (_jsxs(_Fragment, { children: [dotLine, _jsx(Gap, { width: dotLineGap }), _jsxs(FlexLayout, { flexDirection: "column", alignItems: "flex-start", children: [label, desc] })] })) : (_jsxs(_Fragment, { children: [_jsx(Gap, { width: iconGap }), icon] }))] }) })));
};
const VerticalArrow = (props) => {
    const { x = 0, y = 0, width = 30, height = 100, fill = '#FF356A', size = 10, } = props;
    return (_jsx(Polygon, { width: width, height: height, points: [
            { x, y },
            { x: x + width / 2, y: y + size },
            { x: x + width, y },
            { x: x + width, y: y + height - size },
            { x: x + width / 2, y: y + height },
            { x, y: y + height - size },
        ], fill: fill, "data-element-type": "shape" }));
};
const DotLine = (props) => {
    const { x = 0, y = 0, width = 50, height = 10, fill, positionH = 'normal', } = props;
    const r = height / 2;
    const lineLength = width - r;
    const strokeWidth = 2;
    const lineY = r;
    return (_jsxs(Group, { x: x, y: y, width: width, height: height, children: [_jsx(Ellipse, { width: height, height: height, fill: fill, x: positionH === 'normal' ? 0 : lineLength - r, "data-element-type": "shape" }), _jsx(Path, { d: positionH === 'normal'
                    ? `M${r},${lineY} L${r + lineLength},${lineY}`
                    : `M0,${lineY} L${lineLength - r},${lineY}`, strokeWidth: strokeWidth, stroke: fill, "data-element-type": "shape" })] }));
};
registerItem('vertical-icon-arrow', {
    component: VerticalIconArrow,
    composites: ['icon', 'label', 'desc'],
});
