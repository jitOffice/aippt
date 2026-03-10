import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Defs, Group, Rect } from '../../jsx/index.js';
import { ItemDesc, ItemIcon, ItemLabel, ItemValue } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const CompactCard = (props) => {
    const [{ datum, indexes, width = 200, height = 60, iconSize = 20, gap = 8, positionH = 'normal', themeColors, valueFormatter, }, restProps,] = getItemProps(props, ['width', 'height', 'iconSize', 'gap']);
    const value = datum.value;
    const hasValue = value !== undefined && value !== null;
    const shadowId = 'compact-shadow';
    const iconX = positionH === 'flipped' ? width - gap - iconSize : gap;
    const textStartX = positionH === 'flipped' ? gap : iconSize + 2 * gap;
    const textWidth = width - iconSize - 3 * gap;
    // 为 Label 和 Value 分配空间
    const labelWidth = hasValue ? textWidth * 0.8 : textWidth;
    const valueWidth = hasValue ? textWidth * 0.2 : 0;
    return (_jsxs(Group, Object.assign({}, restProps, { children: [_jsx(Defs, { children: _jsx("filter", { id: shadowId, children: _jsx("feDropShadow", { dx: "0", dy: "2", stdDeviation: "2", floodOpacity: "0.15" }) }) }), _jsx(Rect, { x: 0, y: 0, width: width, height: height, fill: themeColors.colorBgElevated, stroke: themeColors.colorBgElevated, strokeWidth: 1, rx: 6, ry: 6, filter: `url(#${shadowId})`, "data-element-type": "shape" }), _jsx(Rect, { x: positionH === 'flipped' ? width - 3 : 0, y: 0, width: 3, height: height, fill: themeColors.colorPrimary, rx: 1.5, ry: 1.5, "data-element-type": "shape" }), _jsx(ItemIcon, { indexes: indexes, x: iconX, y: (height - iconSize) / 2, size: iconSize, fill: themeColors.colorPrimary }), _jsxs(FlexLayout, { x: textStartX, y: gap, width: textWidth, height: height - gap * 2, flexDirection: "column", justifyContent: "center", alignItems: "flex-start", children: [_jsxs(FlexLayout, { width: textWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center", children: [_jsx(ItemLabel, { indexes: indexes, width: labelWidth, alignHorizontal: "left", fontSize: 12, fill: themeColors.colorText, children: datum.label }), hasValue && (_jsx(ItemValue, { indexes: indexes, width: valueWidth, alignHorizontal: "right", fontSize: 12, fontWeight: "bold", fill: themeColors.colorPrimary, value: value, formatter: valueFormatter }))] }), _jsx(ItemDesc, { indexes: indexes, width: textWidth, alignHorizontal: "left", alignVertical: "middle", fontSize: 10, fill: themeColors.colorTextSecondary, lineNumber: 2, wordWrap: true, children: datum.desc })] })] })));
};
registerItem('compact-card', {
    component: CompactCard,
    composites: ['icon', 'label', 'value', 'desc'],
});
