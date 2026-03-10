"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleItem = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const SimpleItem = (props) => {
    const [{ indexes, datum, width = 200, height, gap = 4, showIcon = true, iconSize = 30, iconType = 'default', positionH = 'normal', positionV = 'normal', usePaletteColor = false, themeColors, }, restProps,] = (0, utils_1.getItemProps)(props, [
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
    const labelContent = ((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: width, alignHorizontal: "center", alignVertical: "middle", fill: labelColor, children: label }));
    const labelBounds = (0, jsx_1.getElementBounds)(labelContent);
    const iconContent = showIcon ? (iconType === 'circle' ? ((0, jsx_runtime_1.jsx)(components_1.ItemIconCircle, { indexes: indexes, size: iconSize, fill: themeColors.colorPrimary, colorBg: themeColors.colorBg })) : ((0, jsx_runtime_1.jsx)(components_1.ItemIcon, { indexes: indexes, size: iconSize, fill: themeColors.colorTextSecondary }))) : null;
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
        return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { children: [(0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: width, y: labelY, alignHorizontal: textAlign, alignVertical: "middle", fill: labelColor, children: label }), (0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: width, height: descHeight, y: labelY + labelBounds.height + gap, alignHorizontal: textAlign, alignVertical: getDescVerticalAlign(positionV, false), lineNumber: descLineNumber, fill: themeColors.colorTextSecondary, children: desc })] })));
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
        return ((0, jsx_runtime_1.jsx)(layouts_1.FlexLayout, Object.assign({}, restProps, { flexDirection: "column", gap: gap, alignItems: "center", children: positionV === 'flipped' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: width, y: labelY, alignHorizontal: "center", alignVertical: "middle", fill: labelColor, children: label }), (0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: width, height: descHeight, y: labelY + labelBounds.height + gap, alignHorizontal: "center", alignVertical: "bottom", lineNumber: descLineNumber, fill: themeColors.colorTextSecondary, children: desc })] }), iconContent] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [iconContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: width, y: labelY, alignHorizontal: "center", alignVertical: "middle", fill: labelColor, children: label }), (0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: width, height: descHeight, y: labelY + labelBounds.height + gap, alignHorizontal: "center", alignVertical: "top", lineNumber: descLineNumber, fill: themeColors.colorTextSecondary, children: desc })] })] })) })));
    }
    const iconBounds = (0, jsx_1.getElementBounds)(iconContent);
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
    return ((0, jsx_runtime_1.jsx)(layouts_1.FlexLayout, Object.assign({}, restProps, { flexDirection: "row", gap: gap, alignItems: getIconVerticalAlign(positionV), children: positionH === 'flipped' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: textWidth, y: labelY, alignHorizontal: "right", alignVertical: "middle", fill: labelColor, children: label }), (0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: textWidth, height: descHeight, y: labelY + labelBounds.height + gap, alignHorizontal: "right", alignVertical: getDescVerticalAlign(positionV, true), lineNumber: descLineNumber, fill: themeColors.colorTextSecondary, children: desc })] }), iconContent] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [iconContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: textWidth, y: labelY, alignHorizontal: "left", alignVertical: "middle", fill: labelColor, children: label }), (0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: textWidth, height: descHeight, y: labelY + labelBounds.height + gap, alignHorizontal: "left", alignVertical: getDescVerticalAlign(positionV, true), lineNumber: descLineNumber, fill: themeColors.colorTextSecondary, children: desc })] })] })) })));
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
exports.SimpleItem = SimpleItem;
(0, registry_1.registerItem)('simple', {
    component: exports.SimpleItem,
    composites: ['icon', 'label', 'desc'],
});
