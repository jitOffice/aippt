import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../../jsx-runtime.js";
import tinycolor from 'tinycolor2';
import { Defs, Ellipse, Group, Rect } from '../../jsx/index.js';
import { ItemDesc, ItemIcon, ItemLabel, ItemValue } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const BadgeCard = (props) => {
    const [{ datum, indexes, width = 200, height = 80, iconSize = 24, badgeSize = 32, gap = 8, positionH = 'normal', themeColors, valueFormatter, }, restProps,] = getItemProps(props, ['width', 'height', 'iconSize', 'badgeSize', 'gap']);
    const value = datum.value;
    const hasValue = value !== undefined;
    const hasDesc = !!datum.desc;
    const hasIcon = !!datum.icon;
    const gradientId = `${themeColors.colorPrimary}-badge`;
    const badgeX = positionH === 'flipped' ? width - gap - badgeSize : gap;
    const contentStartX = hasIcon
        ? positionH === 'flipped'
            ? gap
            : badgeSize + 2 * gap
        : gap; // 没有图标时从左边距开始
    const fullWidth = width - gap * 2;
    const contentWidth = hasIcon ? width - badgeSize - 3 * gap : fullWidth;
    // 描述区域的固定位置（label + value 区域的下方）
    const descY = gap + 14 + 18 + 8; // label(14) + value(18) + gap(8)
    const contentAreaHeight = descY - gap; // label 和 value 占据的总高度
    // 当没有 desc 时，徽章和内容区域垂直居中
    const badgeY = !hasDesc ? (height - badgeSize) / 2 : gap;
    // 没有 value 时，label 在整个内容区域垂直居中；有 value 时从顶部开始
    const contentY = !hasValue && !hasDesc ? (height - 14) / 2 : gap;
    const textAlign = !hasIcon && positionH === 'center'
        ? 'center'
        : positionH === 'flipped'
            ? 'right'
            : 'left';
    return (_jsxs(Group, Object.assign({}, restProps, { width: width, height: height, children: [_jsx(Defs, { children: _jsxs("radialGradient", { id: gradientId, cx: "50%", cy: "50%", r: "50%", children: [_jsx("stop", { offset: "0%", stopColor: themeColors.colorPrimary }), _jsx("stop", { offset: "100%", stopColor: tinycolor(themeColors.colorPrimary)
                                .darken(20)
                                .toHexString() })] }) }), _jsx(Rect, { "data-element-type": "shape", x: 0, y: 0, width: width, height: height, fill: themeColors.colorPrimaryBg, rx: 8, ry: 8 }), hasIcon && (_jsxs(_Fragment, { children: [_jsx(Ellipse, { x: badgeX, y: badgeY, width: badgeSize, height: badgeSize, fill: `url(#${gradientId})` }), _jsx(ItemIcon, { indexes: indexes, x: badgeX + (badgeSize - iconSize) / 2, y: badgeY + (badgeSize - iconSize) / 2, size: iconSize, fill: themeColors.colorWhite })] })), _jsxs(FlexLayout, { flexDirection: "column", x: contentStartX, y: contentY, width: contentWidth, height: !hasValue && !hasDesc ? undefined : contentAreaHeight, alignItems: "center", justifyContent: "center", children: [_jsx(ItemLabel, { indexes: indexes, width: contentWidth, alignHorizontal: textAlign, alignVertical: "middle", fontSize: 14, fill: themeColors.colorText, children: datum.label }), hasValue && (_jsx(ItemValue, { indexes: indexes, width: contentWidth, alignHorizontal: positionH === 'flipped' ? 'right' : 'left', alignVertical: "middle", fontSize: 18, lineHeight: 1, fontWeight: "bold", fill: themeColors.colorPrimary, value: value, formatter: valueFormatter }))] }), hasDesc && (_jsx(ItemDesc, { indexes: indexes, x: gap, y: descY, width: fullWidth, alignHorizontal: textAlign, fontSize: 11, fill: themeColors.colorTextSecondary, lineNumber: 2, lineHeight: 1.2, wordWrap: true, children: datum.desc }))] })));
};
registerItem('badge-card', {
    component: BadgeCard,
    composites: ['icon', 'label', 'value', 'desc'],
});
