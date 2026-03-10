import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Ellipse, getElementBounds, Rect, Text, } from '../../jsx/index.js';
import { Gap, ItemDesc, ItemIconCircle, ItemLabel } from '../components/index.js';
import { AlignLayout, FlexLayout } from '../layouts/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const HorizontalIconLine = (props) => {
    const [{ indexes, datum, width = 160, themeColors, positionH = 'center', positionV = 'normal', }, restProps,] = getItemProps(props, ['width']);
    const textAlignHorizontal = positionH === 'normal'
        ? 'left'
        : positionH === 'flipped'
            ? 'right'
            : 'center';
    const label = (_jsx(ItemLabel, { indexes: indexes, width: width, alignHorizontal: textAlignHorizontal, fill: themeColors.colorPrimary, children: datum.label }));
    const labelBounds = getElementBounds(label);
    const desc = datum.desc ? (_jsx(ItemDesc, { indexes: indexes, width: width, fill: themeColors.colorTextSecondary, alignHorizontal: textAlignHorizontal, alignVertical: positionV === 'flipped' ? 'top' : 'bottom', children: datum.desc })) : null;
    const descBounds = getElementBounds(desc);
    const iconSize = 45;
    const icon = datum.icon ? (_jsx(ItemIconCircle, { size: iconSize, indexes: indexes, colorBg: themeColors.colorBg, fill: themeColors.colorPrimary })) : null;
    const iconBounds = getElementBounds(icon);
    const time = datum.time ? (_jsx(Text, { width: width, height: 30, alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorPrimary, fontSize: 18, fontWeight: "bold", children: datum.time })) : null;
    const timeBounds = getElementBounds(time);
    const lineHeight = 18;
    const line = (_jsxs(AlignLayout, { horizontal: "center", vertical: "middle", width: width, height: lineHeight, children: [_jsx(Rect, { width: width, height: lineHeight, fill: themeColors.colorPrimary, "data-element-type": "shape" }), _jsx(Ellipse, { width: lineHeight + 6, height: lineHeight + 6, fill: themeColors.colorBg, fillOpacity: 0.5, "data-element-type": "shape" }), _jsx(Ellipse, { width: 12, height: 12, fill: "white", "data-element-type": "shape" })] }));
    const textSideHeight = labelBounds.height + descBounds.height;
    const iconSideHeight = iconBounds.height + timeBounds.height + 5;
    // 平衡line两侧高度，使 line 位于垂直居中位置
    const heightDiff = Math.abs(iconSideHeight - textSideHeight);
    const topBalance = iconSideHeight > textSideHeight ? heightDiff : 0;
    const bottomBalance = textSideHeight > iconSideHeight ? heightDiff : 0;
    if (positionV === 'flipped') {
        return (_jsxs(FlexLayout, Object.assign({}, restProps, { flexDirection: "column", alignItems: "center", children: [_jsx(Gap, { height: bottomBalance }), time, icon, _jsx(Gap, { height: 5 }), line, label, desc, _jsx(Gap, { height: topBalance })] })));
    }
    return (_jsxs(FlexLayout, Object.assign({}, restProps, { flexDirection: "column", alignItems: "center", children: [_jsx(Gap, { height: topBalance }), label, desc, line, _jsx(Gap, { height: 5 }), icon, time, _jsx(Gap, { height: bottomBalance })] })));
};
registerItem('horizontal-icon-line', {
    component: HorizontalIconLine,
    composites: ['icon', 'label', 'desc'],
});
