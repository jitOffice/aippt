import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import tinycolor from 'tinycolor2';
import { Defs, Group, Path, Rect } from '../../jsx/index.js';
import { ItemDesc, ItemIcon, ItemLabel, ShapesGroup } from '../components/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const RibbonCard = (props) => {
    const [{ datum, indexes, width = 240, height = 140, iconSize = 28, gap = 12, ribbonHeight = 32, themeColors, }, restProps,] = getItemProps(props, [
        'width',
        'height',
        'iconSize',
        'gap',
        'ribbonHeight',
    ]);
    const gradientId = `${themeColors.colorPrimary}-ribbon`;
    return (_jsxs(Group, Object.assign({}, restProps, { children: [_jsx(Defs, { children: _jsxs("linearGradient", { id: gradientId, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: themeColors.colorPrimary }), _jsx("stop", { offset: "100%", stopColor: tinycolor(themeColors.colorPrimary)
                                .darken(15)
                                .toHexString() })] }) }), _jsxs(ShapesGroup, { children: [_jsx(Rect, { x: 0, y: 0, width: width, height: height, fill: themeColors.colorBgElevated, stroke: themeColors.colorPrimaryBg, strokeWidth: 1, rx: 8, ry: 8 }), _jsx(Rect, { x: 0, y: 0, width: width, height: ribbonHeight, fill: `url(#${gradientId})`, rx: 8, ry: 8 }), _jsx(Rect, { x: 0, y: 8, width: width, height: ribbonHeight - 8, fill: `url(#${gradientId})` }), _jsx(Path, { x: width - 20, y: ribbonHeight, width: 20, height: 8, fill: tinycolor(themeColors.colorPrimary).darken(25).toHexString(), d: "M0,0 L20,0 L15,8 L5,8 Z" })] }), _jsx(ItemIcon, { indexes: indexes, x: gap, y: ribbonHeight + gap, size: iconSize, fill: themeColors.colorPrimary }), _jsx(ItemLabel, { indexes: indexes, x: iconSize + 2 * gap, y: ribbonHeight + gap, width: width - iconSize - 3 * gap, height: iconSize, alignHorizontal: "left", alignVertical: "middle", lineHeight: 1, fontWeight: "bold", fill: themeColors.colorText, children: datum.label }), _jsx(ItemDesc, { indexes: indexes, x: gap, y: ribbonHeight + iconSize + gap + 5, width: width - 2 * gap, alignHorizontal: "left", fill: themeColors.colorTextSecondary, lineNumber: 3, wordWrap: true, children: datum.desc }), _jsx(ItemIcon, { indexes: indexes, x: width - gap - 8, y: gap / 2, size: 16, fill: themeColors.colorWhite })] })));
};
registerItem('ribbon-card', {
    component: RibbonCard,
    composites: ['icon', 'label', 'desc'],
});
