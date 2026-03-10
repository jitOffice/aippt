import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { scaleLinear } from 'd3';
import tinycolor from 'tinycolor2';
import { Defs, getElementBounds, Group, Rect } from '../../jsx/index.js';
import { ItemDesc, ItemIcon, ItemLabel, ItemValue } from '../components/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const ProgressCard = (props) => {
    const [{ datum, data, indexes, width = 280, height = 120, iconSize = 32, gap = 12, progressHeight = 8, borderRadius = 12, positionH = 'normal', themeColors, valueFormatter = (v) => `${v}%`, }, restProps,] = getItemProps(props, [
        'width',
        'height',
        'iconSize',
        'gap',
        'progressHeight',
        'borderRadius',
    ]);
    const value = datum.value;
    const displayValue = value !== null && value !== void 0 ? value : 0;
    const maxValue = Math.max(...data.items.map((item) => { var _a; return (_a = item.value) !== null && _a !== void 0 ? _a : 0; }), 100);
    const progressWidth = width - 2 * gap;
    // 计算进度条的填充宽度
    const progressScale = scaleLinear()
        .domain([0, maxValue])
        .range([0, progressWidth]);
    const progressFillWidth = progressScale(displayValue);
    // 生成唯一的渐变ID
    const gradientId = `${themeColors.colorPrimary}-progress`;
    const progressBgId = `${themeColors.colorPrimaryBg}-progress-bg`;
    // 获取元素边界用于布局计算
    const labelBounds = getElementBounds(_jsx(ItemLabel, { indexes: indexes }));
    // 计算布局位置
    const contentY = gap;
    const iconX = positionH === 'flipped' ? width - gap - iconSize : gap;
    const iconY = contentY;
    const textStartX = positionH === 'flipped' ? gap : iconSize + 2 * gap;
    const textWidth = width - iconSize - 3 * gap;
    const textY = iconY;
    const progressY = height - gap - progressHeight;
    const hasValue = value !== undefined;
    return (_jsxs(Group, Object.assign({}, restProps, { children: [_jsxs(Defs, { children: [_jsxs("linearGradient", { id: gradientId, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: themeColors.colorPrimary }), _jsx("stop", { offset: "100%", stopColor: tinycolor
                                    .mix(themeColors.colorPrimary, '#fff', 20)
                                    .toHexString() })] }), _jsxs("linearGradient", { id: progressBgId, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: themeColors.colorPrimaryBg }), _jsx("stop", { offset: "100%", stopColor: themeColors.colorBg })] })] }), _jsx(Rect, { x: 0, y: 0, width: width, height: height, fill: themeColors.colorBgElevated, stroke: themeColors.colorPrimaryBg, strokeWidth: 1, rx: borderRadius, ry: borderRadius, "data-element-type": "shape" }), _jsx(ItemIcon, { indexes: indexes, x: iconX, y: iconY, size: iconSize, fill: themeColors.colorPrimary }), _jsx(ItemLabel, { indexes: indexes, x: textStartX, y: textY, width: textWidth, alignHorizontal: positionH === 'flipped' ? 'right' : 'left', alignVertical: "top", fontSize: 16, fontWeight: "medium", fill: themeColors.colorText, children: datum.label }), hasValue && (_jsx(ItemValue, { indexes: indexes, x: textStartX, y: textY + labelBounds.height, width: textWidth, alignHorizontal: positionH === 'flipped' ? 'right' : 'left', alignVertical: "top", lineHeight: 1, fontSize: 24, fontWeight: "bold", fill: themeColors.colorPrimary, value: displayValue, formatter: valueFormatter })), _jsx(ItemDesc, { indexes: indexes, x: textStartX, y: textY + labelBounds.height + (hasValue ? 27 : 4), width: textWidth, alignHorizontal: positionH === 'flipped' ? 'right' : 'left', alignVertical: "top", fontSize: 11, fill: themeColors.colorTextSecondary, lineNumber: hasValue ? 2 : 3, wordWrap: true, children: datum.desc }), _jsx(Rect, { x: gap, y: progressY, width: progressWidth, height: progressHeight, fill: `url(#${progressBgId})`, rx: progressHeight / 2, ry: progressHeight / 2, "data-element-type": "shape" }), _jsx(Rect, { x: gap, y: progressY, width: progressFillWidth, height: progressHeight, fill: `url(#${gradientId})`, rx: progressHeight / 2, ry: progressHeight / 2, "data-element-type": "shape" })] })));
};
registerItem('progress-card', {
    component: ProgressCard,
    composites: ['icon', 'label', 'value', 'desc'],
});
