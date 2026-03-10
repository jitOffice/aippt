import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../../jsx-runtime.js";
import { Group, Polygon, Text } from '../../jsx/index.js';
import { Gap, ItemDesc, ItemLabel } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { AlignLayout } from '../layouts/Align.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const SimpleVerticalArrow = (props) => {
    const [{ indexes, datum, height = 140, themeColors, positionH = 'normal' }, restProps,] = getItemProps(props, ['height']);
    const textAlignHorizontal = positionH === 'normal' ? 'right' : 'left';
    const label = (_jsx(ItemLabel, { indexes: indexes, width: 120, fill: themeColors.colorText, alignHorizontal: textAlignHorizontal, alignVertical: "middle", fontSize: 14, children: datum.label }));
    const desc = (_jsx(ItemDesc, { indexes: indexes, width: 120, fill: themeColors.colorTextSecondary, alignHorizontal: textAlignHorizontal, alignVertical: "top", children: datum.desc }));
    const isNormal = positionH !== 'flipped';
    const labelGap = 15;
    const arrowWidth = 30;
    const textWidth = 120;
    const totalWidth = textWidth + labelGap + arrowWidth + labelGap + textWidth;
    return (_jsx(Group, Object.assign({ width: totalWidth, height: height }, restProps, { children: _jsxs(FlexLayout, { flexDirection: "row", alignItems: "center", children: [isNormal ? (_jsxs(_Fragment, { children: [_jsxs(FlexLayout, { flexDirection: "column", alignItems: "flex-end", children: [label, desc] }), _jsx(Gap, { width: labelGap })] })) : (_jsx(_Fragment, { children: _jsx(Gap, { width: textWidth + labelGap }) })), _jsxs(AlignLayout, { horizontal: "center", vertical: "middle", children: [_jsx(VerticalArrow, { width: arrowWidth, height: height, fill: themeColors.colorPrimary }), _jsx(Text, { width: arrowWidth, height: height, alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorWhite, fontWeight: "bold", fontSize: 16, children: String(indexes[0] + 1)
                                .padStart(2, '0')
                                .slice(-2) })] }), !isNormal ? (_jsxs(_Fragment, { children: [_jsx(Gap, { width: labelGap }), _jsxs(FlexLayout, { flexDirection: "column", alignItems: "flex-start", children: [label, desc] })] })) : (_jsx(_Fragment, { children: _jsx(Gap, { width: textWidth + labelGap }) }))] }) })));
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
registerItem('simple-vertical-arrow', {
    component: SimpleVerticalArrow,
    composites: ['label', 'desc'],
});
