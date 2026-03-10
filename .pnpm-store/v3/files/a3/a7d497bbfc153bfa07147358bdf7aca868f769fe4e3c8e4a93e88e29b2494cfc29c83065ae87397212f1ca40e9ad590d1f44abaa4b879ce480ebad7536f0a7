import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../../jsx-runtime.js";
import { getElementBounds, Group } from '../../jsx/index.js';
import { ItemDesc, ItemIcon, ItemIconCircle, ItemLabel } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const SimpleItem = (props) => {
    const [{ indexes, datum, width = 200, height, gap = 4, showIcon = true, iconSize = 30, iconType = 'default', positionH = 'normal', positionV = 'normal', usePaletteColor = false, themeColors, }, restProps,] = getItemProps(props, [
        'width',
        'height',
        'gap',
        'showIcon',
        'iconSize',
        'iconType',
        'usePaletteColor',
    ]);
    const { label, desc, icon } = datum;
    const getTextAlign = (position) => {
        return position === 'normal'
            ? 'left'
            : position === 'flipped'
                ? 'right'
                : 'center';
    };
    const textAlign = getTextAlign(positionH);
    const labelColor = usePaletteColor
        ? themeColors.colorPrimary
        : themeColors.colorText;
    // ItemDesc 的默认参数（用于计算行数）
    const descFontSize = 14;
    const descLineHeight = 1.4;
    const labelContent = (_jsx(ItemLabel, { indexes: indexes, width: width, alignHorizontal: "center", alignVertical: "middle", fill: labelColor, children: label }));
    const labelBounds = getElementBounds(labelContent);
    const iconContent = showIcon ? (iconType === 'circle' ? (_jsx(ItemIconCircle, { indexes: indexes, size: iconSize, fill: themeColors.colorPrimary, colorBg: themeColors.colorBg })) : (_jsx(ItemIcon, { indexes: indexes, size: iconSize, fill: themeColors.colorTextSecondary }))) : null;
    if (!showIcon || !icon) {
        // 计算 desc 的可用高度和行数
        const descHeight = height
            ? Math.max(0, height - labelBounds.height - gap)
            : undefined;
        const descLineNumber = descHeight
            ? descHeight <= 60
                ? 1
                : Math.floor(descHeight / (descLineHeight * descFontSize))
            : 2;
        const labelY = height
            ? positionV === 'middle'
                ? (height - labelBounds.height - (descHeight || 0) - gap) / 2
                : positionV === 'flipped'
                    ? height - labelBounds.height - (descHeight || 0) - gap
                    : 0
            : 0;
        return (_jsxs(Group, Object.assign({}, restProps, { children: [_jsx(ItemLabel, { indexes: indexes, width: width, y: labelY, alignHorizontal: textAlign, alignVertical: "middle", fill: labelColor, children: label }), _jsx(ItemDesc, { indexes: indexes, width: width, height: descHeight, y: labelY + labelBounds.height + gap, alignHorizontal: textAlign, alignVertical: getDescVerticalAlign(positionV, false), lineNumber: descLineNumber, fill: themeColors.colorTextSecondary, children: desc })] })));
    }
    if (positionH === 'center') {
        // 计算 desc 的可用高度和行数
        const iconHeight = showIcon && icon ? iconSize : 0;
        const descHeight = height
            ? Math.max(0, height - labelBounds.height - iconHeight - gap * 2)
            : undefined;
        const descLineNumber = descHeight
            ? descHeight <= 60
                ? 1
                : Math.floor(descHeight / (descLineHeight * descFontSize))
            : 2;
        const contentHeight = labelBounds.height + (descHeight || 0) + gap;
        const labelY = height
            ? positionV === 'middle'
                ? (height - contentHeight - iconHeight - gap) / 2
                : positionV === 'flipped'
                    ? height - contentHeight - iconHeight - gap
                    : 0
            : 0;
        return (_jsx(FlexLayout, Object.assign({}, restProps, { flexDirection: "column", gap: gap, alignItems: "center", children: positionV === 'flipped' ? (_jsxs(_Fragment, { children: [_jsxs(Group, { children: [_jsx(ItemLabel, { indexes: indexes, width: width, y: labelY, alignHorizontal: "center", alignVertical: "middle", fill: labelColor, children: label }), _jsx(ItemDesc, { indexes: indexes, width: width, height: descHeight, y: labelY + labelBounds.height + gap, alignHorizontal: "center", alignVertical: "bottom", lineNumber: descLineNumber, fill: themeColors.colorTextSecondary, children: desc })] }), iconContent] })) : (_jsxs(_Fragment, { children: [iconContent, _jsxs(Group, { children: [_jsx(ItemLabel, { indexes: indexes, width: width, y: labelY, alignHorizontal: "center", alignVertical: "middle", fill: labelColor, children: label }), _jsx(ItemDesc, { indexes: indexes, width: width, height: descHeight, y: labelY + labelBounds.height + gap, alignHorizontal: "center", alignVertical: "top", lineNumber: descLineNumber, fill: themeColors.colorTextSecondary, children: desc })] })] })) })));
    }
    const iconBounds = getElementBounds(iconContent);
    const textWidth = Math.max(width - iconBounds.width - gap, 0);
    // 计算 desc 的可用高度和行数
    const descHeight = height
        ? Math.max(0, height - labelBounds.height - gap)
        : undefined;
    const descLineNumber = descHeight
        ? descHeight <= 60
            ? 1
            : Math.floor(descHeight / (descLineHeight * descFontSize))
        : 2;
    const labelY = height
        ? positionV === 'middle'
            ? (height - labelBounds.height - (descHeight || 0) - gap) / 2
            : positionV === 'flipped'
                ? height - labelBounds.height - (descHeight || 0) - gap
                : 0
        : 0;
    return (_jsx(FlexLayout, Object.assign({}, restProps, { flexDirection: "row", gap: gap, alignItems: getIconVerticalAlign(positionV), children: positionH === 'flipped' ? (_jsxs(_Fragment, { children: [_jsxs(Group, { children: [_jsx(ItemLabel, { indexes: indexes, width: textWidth, y: labelY, alignHorizontal: "right", alignVertical: "middle", fill: labelColor, children: label }), _jsx(ItemDesc, { indexes: indexes, width: textWidth, height: descHeight, y: labelY + labelBounds.height + gap, alignHorizontal: "right", alignVertical: getDescVerticalAlign(positionV, true), lineNumber: descLineNumber, fill: themeColors.colorTextSecondary, children: desc })] }), iconContent] })) : (_jsxs(_Fragment, { children: [iconContent, _jsxs(Group, { children: [_jsx(ItemLabel, { indexes: indexes, width: textWidth, y: labelY, alignHorizontal: "left", alignVertical: "middle", fill: labelColor, children: label }), _jsx(ItemDesc, { indexes: indexes, width: textWidth, height: descHeight, y: labelY + labelBounds.height + gap, alignHorizontal: "left", alignVertical: getDescVerticalAlign(positionV, true), lineNumber: descLineNumber, fill: themeColors.colorTextSecondary, children: desc })] })] })) })));
    function getDescVerticalAlign(positionV, hasIcon) {
        return 'top';
        // if (positionV === 'normal') return 'top';
        // if (positionV === 'flipped') return 'bottom';
        return hasIcon ? 'middle' : 'top';
    }
    function getIconVerticalAlign(positionV) {
        if (positionV === 'normal')
            return 'flex-start';
        if (positionV === 'flipped')
            return 'flex-end';
        return 'center';
    }
};
registerItem('simple', {
    component: SimpleItem,
    composites: ['icon', 'label', 'desc'],
});
