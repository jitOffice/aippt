import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { getElementBounds, Group, Rect, Text } from '../../jsx/index.js';
import { ItemsGroup } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { getPaletteColor, getThemeColors } from '../utils/index.js';
import { registerStructure } from './registry.js';
const applyAlpha = (color, alpha) => {
    if (!color || color[0] !== '#' || color.length !== 7)
        return color;
    const clamped = Math.max(0, Math.min(1, alpha));
    const alphaHex = Math.round(clamped * 255)
        .toString(16)
        .padStart(2, '0');
    return `${color}${alphaHex}`;
};
const normalizeLabel = (label) => label == null ? '' : String(label);
const measureText = (text, fontSize, fontWeight) => getElementBounds(_jsx(Text, { fontSize: fontSize, fontWeight: fontWeight, children: text }));
const getMaxTextBounds = (labels, fontSize, fontWeight, fallbackText = ' ') => {
    const sampleBounds = measureText(fallbackText, fontSize, fontWeight);
    let maxWidth = sampleBounds.width;
    let maxHeight = sampleBounds.height;
    labels.forEach((label) => {
        const bounds = measureText(label || ' ', fontSize, fontWeight);
        maxWidth = Math.max(maxWidth, bounds.width);
        maxHeight = Math.max(maxHeight, bounds.height);
    });
    return { width: maxWidth, height: maxHeight };
};
const getPillDimensions = (labels, fontSize, paddingX, paddingY) => {
    const bounds = getMaxTextBounds(labels, fontSize, 'normal', 'Item');
    return {
        pillWidth: bounds.width + paddingX * 2,
        pillHeight: bounds.height + paddingY * 2,
    };
};
export const HierarchyStructure = (props) => {
    const { Title, data, options, rowGap = 20, labelGap = 20, groupGap = 20, pillGap = 14, pillColumns = 2, ungroupedColumns = 6, layerLabelPosition = 'left', rowPadding = 20, groupPadding = 16, labelPaddingX = 28, labelPaddingY = 16, pillPaddingX = 18, pillPaddingY = 10, labelFontSize = 20, groupTitleFontSize = 18, pillFontSize = 16, groupTitleGap = 10, rowRadius = 12, groupRadius = 10, pillRadius = 12, } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    if (items.length === 0) {
        return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsx(Group, { children: _jsx(ItemsGroup, {}) })] }));
    }
    const themeColors = getThemeColors(options.themeConfig);
    const decorElements = [];
    const itemElements = [];
    const isLabelOnRight = layerLabelPosition === 'right';
    const rowBackgroundAlpha = 0.12;
    const rowBorderAlpha = 0.55;
    const groupBackgroundAlpha = 0.08;
    const groupBorderAlpha = 0.4;
    const pillBackgroundAlpha = 0.06;
    const pillBorderAlpha = 0.35;
    const rowInfos = items.map((layer) => {
        const layerLabel = normalizeLabel(layer.label);
        const labelBounds = measureText(layerLabel || ' ', labelFontSize, 'bold');
        const labelWidth = labelBounds.width + labelPaddingX * 2;
        const labelHeight = labelBounds.height + labelPaddingY * 2;
        const children = layer.children || [];
        const hasGroups = children.some((child) => { var _a; return (((_a = child.children) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0; });
        if (hasGroups) {
            const pillLabels = [];
            children.forEach((child) => {
                (child.children || []).forEach((pill) => {
                    pillLabels.push(normalizeLabel(pill.label));
                });
            });
            const { pillWidth, pillHeight } = getPillDimensions(pillLabels, pillFontSize, pillPaddingX, pillPaddingY);
            const groupMetrics = children.map((group) => {
                const groupLabel = normalizeLabel(group.label);
                const groupTitleBounds = measureText(groupLabel || ' ', groupTitleFontSize, 'bold');
                const groupChildren = group.children || [];
                const groupColumns = groupChildren.length > 0
                    ? Math.min(pillColumns, groupChildren.length)
                    : 0;
                const groupRows = groupColumns > 0 ? Math.ceil(groupChildren.length / groupColumns) : 0;
                const groupContentWidth = groupColumns > 0
                    ? groupColumns * pillWidth + (groupColumns - 1) * pillGap
                    : 0;
                const groupContentHeight = groupRows > 0
                    ? groupRows * pillHeight + (groupRows - 1) * pillGap
                    : 0;
                const innerWidth = Math.max(groupTitleBounds.width, groupContentWidth);
                const groupWidth = innerWidth + groupPadding * 2;
                const groupHeight = groupPadding * 2 +
                    groupTitleBounds.height +
                    (groupRows > 0 ? groupTitleGap + groupContentHeight : 0);
                return {
                    label: groupLabel,
                    children: groupChildren,
                    width: groupWidth,
                    height: groupHeight,
                    titleHeight: groupTitleBounds.height,
                    columns: groupColumns,
                    contentWidth: groupContentWidth,
                    pillWidth,
                    pillHeight,
                };
            });
            const contentInnerWidth = groupMetrics.reduce((sum, metric) => sum + metric.width, 0) +
                (groupMetrics.length > 1 ? (groupMetrics.length - 1) * groupGap : 0);
            const contentInnerHeight = groupMetrics.reduce((max, metric) => Math.max(max, metric.height), 0);
            return {
                label: layerLabel,
                labelWidth,
                labelHeight,
                hasGroups: true,
                children,
                groupMetrics,
                contentInnerWidth,
                contentInnerHeight,
            };
        }
        const pillLabels = children.map((child) => normalizeLabel(child.label));
        const { pillWidth, pillHeight } = getPillDimensions(pillLabels, pillFontSize, pillPaddingX, pillPaddingY);
        const columns = children.length > 0 ? Math.min(ungroupedColumns, children.length) : 0;
        const rows = columns > 0 ? Math.ceil(children.length / columns) : 0;
        const contentInnerWidth = columns > 0 ? columns * pillWidth + (columns - 1) * pillGap : 0;
        const contentInnerHeight = rows > 0 ? rows * pillHeight + (rows - 1) * pillGap : 0;
        return {
            label: layerLabel,
            labelWidth,
            labelHeight,
            hasGroups: false,
            children,
            pillWidth,
            pillHeight,
            columns,
            contentInnerWidth,
            contentInnerHeight,
        };
    });
    const maxLabelWidth = rowInfos.reduce((max, row) => Math.max(max, row.labelWidth), 0);
    const targetContentInnerWidth = rowInfos.reduce((max, row) => Math.max(max, row.contentInnerWidth), 0);
    const getRowColors = (layerIndex) => {
        const rowColor = getPaletteColor(options, [layerIndex]) ||
            themeColors.colorPrimary ||
            '#6c7dff';
        return {
            rowFill: applyAlpha(rowColor, rowBackgroundAlpha),
            rowStroke: applyAlpha(rowColor, rowBorderAlpha),
            groupFill: applyAlpha(rowColor, groupBackgroundAlpha),
            groupStroke: applyAlpha(rowColor, groupBorderAlpha),
            pillFill: applyAlpha(rowColor, pillBackgroundAlpha),
            pillStroke: applyAlpha(rowColor, pillBorderAlpha),
        };
    };
    const renderRowFrame = (layerLabel, layerIndexes, labelX, labelY, labelWidth, labelHeight, rowY, rowHeight, contentX, contentY, contentWidth, contentHeight, rowFill, rowStroke) => {
        decorElements.push(_jsx(Rect, { x: labelX, y: rowY, width: labelWidth, height: rowHeight, fill: rowFill, stroke: rowStroke, rx: rowRadius, ry: rowRadius, "data-element-type": "shape" }));
        decorElements.push(_jsx(Rect, { x: contentX, y: contentY, width: contentWidth, height: contentHeight, fill: rowFill, stroke: rowStroke, rx: rowRadius, ry: rowRadius, "data-element-type": "shape" }));
        itemElements.push(_jsx(Text, { x: labelX, y: labelY, width: labelWidth, height: labelHeight, fontSize: labelFontSize, fontWeight: "bold", alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorText, "data-element-type": "item-label" /* ElementTypeEnum.ItemLabel */, "data-indexes": layerIndexes, children: layerLabel }));
    };
    const renderGroupedRow = (rowInfo, layerIndex, rowY, rowColors) => {
        const groupMetrics = rowInfo.groupMetrics || [];
        const layerLabel = rowInfo.label;
        const layerIndexes = [layerIndex];
        const labelWidth = maxLabelWidth;
        const labelHeight = rowInfo.labelHeight;
        const contentInnerHeight = rowInfo.contentInnerHeight;
        const extraInnerWidth = Math.max(0, targetContentInnerWidth - rowInfo.contentInnerWidth);
        const extraPerGroup = groupMetrics.length > 0 ? extraInnerWidth / groupMetrics.length : 0;
        const contentInnerWidth = rowInfo.contentInnerWidth +
            (groupMetrics.length > 0 ? extraInnerWidth : 0);
        const contentWidth = contentInnerWidth + rowPadding * 2;
        const contentHeight = contentInnerHeight + rowPadding * 2;
        const rowHeight = Math.max(labelHeight, contentHeight);
        const contentX = isLabelOnRight ? 0 : labelWidth + labelGap;
        const labelX = isLabelOnRight ? contentX + contentWidth + labelGap : 0;
        const labelY = rowY + (rowHeight - labelHeight) / 2;
        const contentY = rowY + (rowHeight - contentHeight) / 2;
        renderRowFrame(layerLabel, layerIndexes, labelX, labelY, labelWidth, labelHeight, rowY, rowHeight, contentX, contentY, contentWidth, contentHeight, rowColors.rowFill, rowColors.rowStroke);
        let groupX = contentX + rowPadding;
        groupMetrics.forEach((metric, groupIndex) => {
            const groupIndexes = [...layerIndexes, groupIndex];
            const groupWidth = metric.width + extraPerGroup;
            const groupY = contentY + rowPadding + (contentInnerHeight - metric.height) / 2;
            decorElements.push(_jsx(Rect, { x: groupX, y: groupY, width: groupWidth, height: metric.height, fill: rowColors.groupFill, stroke: rowColors.groupStroke, rx: groupRadius, ry: groupRadius, "data-element-type": "shape" }));
            const hasGroupChildren = metric.children.length > 0;
            const titleY = hasGroupChildren ? groupY + groupPadding : groupY;
            const titleHeight = hasGroupChildren ? metric.titleHeight : metric.height;
            const titleAlignV = hasGroupChildren ? 'top' : 'middle';
            itemElements.push(_jsx(Text, { x: groupX + groupPadding, y: titleY, width: groupWidth - groupPadding * 2, height: titleHeight, fontSize: groupTitleFontSize, fontWeight: "bold", alignHorizontal: "center", alignVertical: titleAlignV, fill: themeColors.colorText, "data-element-type": "item-label" /* ElementTypeEnum.ItemLabel */, "data-indexes": groupIndexes, children: metric.label }));
            if (metric.columns > 0) {
                const innerWidth = groupWidth - groupPadding * 2;
                const extraWidth = innerWidth - metric.contentWidth;
                const columnExtra = extraWidth > 0 ? extraWidth / metric.columns : 0;
                const pillWidth = metric.pillWidth + columnExtra;
                const contentWidth = metric.columns * pillWidth + (metric.columns - 1) * pillGap;
                const contentOffsetX = (innerWidth - contentWidth) / 2;
                const pillStartX = groupX + groupPadding + Math.max(0, contentOffsetX);
                const pillStartY = groupY + groupPadding + metric.titleHeight + groupTitleGap;
                metric.children.forEach((pill, pillIndex) => {
                    const pillIndexes = [...groupIndexes, pillIndex];
                    const rowIndex = Math.floor(pillIndex / metric.columns);
                    const colIndex = pillIndex % metric.columns;
                    const pillX = pillStartX + colIndex * (pillWidth + pillGap);
                    const pillY = pillStartY + rowIndex * (metric.pillHeight + pillGap);
                    const pillRx = Math.min(pillRadius, metric.pillHeight / 2);
                    decorElements.push(_jsx(Rect, { x: pillX, y: pillY, width: pillWidth, height: metric.pillHeight, fill: rowColors.pillFill, stroke: rowColors.pillStroke, rx: pillRx, ry: pillRx, "data-element-type": "shape" }));
                    itemElements.push(_jsx(Text, { x: pillX, y: pillY, width: pillWidth, height: metric.pillHeight, fontSize: pillFontSize, fontWeight: "normal", alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorText, "data-element-type": "item-label" /* ElementTypeEnum.ItemLabel */, "data-indexes": pillIndexes, children: normalizeLabel(pill.label) }));
                });
            }
            groupX += groupWidth + groupGap;
        });
        const rowWidth = isLabelOnRight
            ? labelX + labelWidth
            : contentX + contentWidth;
        return { rowWidth, rowHeight };
    };
    const renderUngroupedRow = (rowInfo, layerIndex, rowY, rowColors) => {
        const layerLabel = rowInfo.label;
        const layerIndexes = [layerIndex];
        const labelWidth = maxLabelWidth;
        const labelHeight = rowInfo.labelHeight;
        const contentInnerHeight = rowInfo.contentInnerHeight;
        const extraInnerWidth = Math.max(0, targetContentInnerWidth - rowInfo.contentInnerWidth);
        const columns = rowInfo.columns || 0;
        const pillWidthBase = rowInfo.pillWidth || 0;
        const pillHeight = rowInfo.pillHeight || 0;
        const extraPerColumn = columns > 0 ? extraInnerWidth / columns : 0;
        const pillWidth = pillWidthBase + extraPerColumn;
        const contentInnerWidth = columns > 0 ? columns * pillWidth + (columns - 1) * pillGap : 0;
        const contentWidth = contentInnerWidth + rowPadding * 2;
        const contentHeight = contentInnerHeight + rowPadding * 2;
        const rowHeight = Math.max(labelHeight, contentHeight);
        const contentX = isLabelOnRight ? 0 : labelWidth + labelGap;
        const labelX = isLabelOnRight ? contentX + contentWidth + labelGap : 0;
        const labelY = rowY + (rowHeight - labelHeight) / 2;
        const contentY = rowY + (rowHeight - contentHeight) / 2;
        renderRowFrame(layerLabel, layerIndexes, labelX, labelY, labelWidth, labelHeight, rowY, rowHeight, contentX, contentY, contentWidth, contentHeight, rowColors.rowFill, rowColors.rowStroke);
        if (columns > 0) {
            const pillStartX = contentX + rowPadding;
            const pillStartY = contentY + rowPadding;
            const flatChildren = rowInfo.children || [];
            flatChildren.forEach((child, pillIndex) => {
                const pillIndexes = [...layerIndexes, pillIndex];
                const rowIndex = Math.floor(pillIndex / columns);
                const colIndex = pillIndex % columns;
                const pillX = pillStartX + colIndex * (pillWidth + pillGap);
                const pillY = pillStartY + rowIndex * (pillHeight + pillGap);
                const pillRx = Math.min(pillRadius, pillHeight / 2);
                decorElements.push(_jsx(Rect, { x: pillX, y: pillY, width: pillWidth, height: pillHeight, fill: rowColors.pillFill, stroke: rowColors.pillStroke, rx: pillRx, ry: pillRx, "data-element-type": "shape" }));
                itemElements.push(_jsx(Text, { x: pillX, y: pillY, width: pillWidth, height: pillHeight, fontSize: pillFontSize, fontWeight: "normal", alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorText, "data-element-type": "item-label" /* ElementTypeEnum.ItemLabel */, "data-indexes": pillIndexes, children: normalizeLabel(child.label) }));
            });
        }
        const rowWidth = isLabelOnRight
            ? labelX + labelWidth
            : contentX + contentWidth;
        return { rowWidth, rowHeight };
    };
    let currentY = 0;
    let maxWidth = 0;
    rowInfos.forEach((rowInfo, layerIndex) => {
        const rowColors = getRowColors(layerIndex);
        const { rowWidth, rowHeight } = rowInfo.hasGroups
            ? renderGroupedRow(rowInfo, layerIndex, currentY, rowColors)
            : renderUngroupedRow(rowInfo, layerIndex, currentY, rowColors);
        maxWidth = Math.max(maxWidth, rowWidth);
        currentY += rowHeight + rowGap;
    });
    const totalHeight = Math.max(currentY - rowGap, 0);
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { width: maxWidth, height: totalHeight, children: [_jsx(Group, { children: decorElements }), _jsx(ItemsGroup, { children: itemElements })] })] }));
};
registerStructure('hierarchy-structure', {
    component: HierarchyStructure,
    composites: ['title'],
});
