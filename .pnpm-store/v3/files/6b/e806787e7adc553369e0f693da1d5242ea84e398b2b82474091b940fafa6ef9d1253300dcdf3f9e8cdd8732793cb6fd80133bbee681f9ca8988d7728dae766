import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { getElementBounds, Group } from '../../jsx/index.js';
// 根据需要选择性导入原子组件和类型
import { Rect, Text } from '../../jsx/index.js';
// 根据需要选择性导入封装组件
import { ItemDesc, ItemLabel } from '../components/index.js';
import tinycolor from 'tinycolor2';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
// -----------------------------------------------------------------------------------
// 2. 组件实现
// -----------------------------------------------------------------------------------
export const IndexedCard = (props) => {
    const [{ datum, indexes, width = 200, borderRadius = 12, padding = 16, separatorHeight = 2, indexFontSize = 20, labelFontSize = 16, gap = 8, themeColors, }, restProps,] = getItemProps(props, [
        'width',
        'height',
        'borderRadius',
        'padding',
        'separatorHeight',
        'indexFontSize',
        'labelFontSize',
        'gap',
    ]);
    // 1. 数据处理
    const indexNumber = indexes[0] + 1;
    const indexStr = String(indexNumber).padStart(2, '0');
    const showLabel = datum.label !== undefined;
    const showDesc = datum.desc !== undefined;
    // 2. 颜色计算
    const separatorColor = tinycolor
        .mix(themeColors.colorPrimary, themeColors.colorWhite, 40)
        .toHexString();
    const cardBgColor = themeColors.colorBgElevated || themeColors.colorWhite;
    // 3. 布局计算优化
    const contentWidth = width - 2 * padding;
    // 3.1 序号元素尺寸计算
    const indexBounds = getElementBounds(_jsx(Text, { fontSize: indexFontSize, fontWeight: "bold", children: indexStr }));
    // 3.2 标签元素尺寸计算（考虑可用宽度）
    const labelAvailableWidth = contentWidth - indexBounds.width - gap;
    const labelBounds = showLabel
        ? getElementBounds(_jsx(ItemLabel, { indexes: indexes, width: labelAvailableWidth, fontSize: labelFontSize, fontWeight: "bold", x: indexFontSize, children: datum.label }))
        : { width: 0, height: 0 };
    // 3.3 描述元素尺寸计算
    const descBounds = showDesc
        ? getElementBounds(_jsx(ItemDesc, { indexes: indexes, width: contentWidth, fontSize: 14, lineHeight: 1.5, wordWrap: true, children: datum.desc }))
        : { width: 0, height: 0 };
    // 3.4 动态内容高度计算
    const titleRowHeight = Math.max(indexBounds.height, labelBounds.height);
    const contentHeight = padding * 2 + // 上下内边距
        titleRowHeight + // 标题行高度
        (showLabel || showDesc ? gap : 0) + // 标题后间距
        separatorHeight + // 分隔线高度
        (showDesc ? gap : 0) + // 分隔线后间距
        descBounds.height; // 描述高度
    // 4. 组件结构
    return (_jsxs(Group, Object.assign({}, restProps, { width: width, height: contentHeight, children: [_jsx(Rect, { x: 0, y: 0, width: width, height: contentHeight, rx: borderRadius, ry: borderRadius, fill: cardBgColor, stroke: tinycolor(cardBgColor).darken(5).toHexString(), strokeWidth: 0.5, "data-element-type": "shape" }), _jsxs(Group, { x: padding, y: padding, children: [_jsxs(Group, { x: 0, y: 0, children: [_jsx(Text, { x: 0, y: 0, fontSize: indexFontSize, fontWeight: "bold", fill: themeColors.colorPrimary, alignVertical: "top", children: indexStr }), showLabel && (_jsx(ItemLabel, { indexes: indexes, x: indexFontSize + gap, y: 0, width: labelAvailableWidth, fontSize: labelFontSize, fontWeight: "bold", fill: themeColors.colorTextSecondary, alignVertical: "top", children: datum.label }))] }), _jsx(Rect, { x: 0, y: titleRowHeight + gap, width: contentWidth, height: separatorHeight, fill: separatorColor, "data-element-type": "shape" }), showDesc && (_jsx(ItemDesc, { indexes: indexes, x: 0, y: titleRowHeight + gap + separatorHeight + gap, width: contentWidth, fontSize: 14, lineHeight: 1.5, wordWrap: true, fill: themeColors.colorTextSecondary, children: datum.desc }))] })] })));
};
registerItem('indexed-card', {
    component: IndexedCard,
    composites: ['label', 'desc'],
});
