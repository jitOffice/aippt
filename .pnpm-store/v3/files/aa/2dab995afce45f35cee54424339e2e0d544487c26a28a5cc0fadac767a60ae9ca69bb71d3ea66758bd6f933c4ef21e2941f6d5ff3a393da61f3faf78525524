import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import tinycolor from 'tinycolor2';
import { Defs, Ellipse, Group, Text } from '../../jsx/index.js';
import { ItemIcon, ItemLabel } from '../components/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const IconBadge = (props) => {
    var _a;
    const [{ datum, indexes, size = 80, iconSize = 28, badgeSize = 24, gap = 8, themeColors, width = 84, height = 105, }, restProps,] = getItemProps(props, ['size', 'iconSize', 'badgeSize', 'gap']);
    const value = (_a = datum.value) !== null && _a !== void 0 ? _a : 0;
    const gradientId = `${themeColors.colorPrimary}-icon`;
    const badgeGradientId = '#ff6b6b-badge';
    return (_jsxs(Group, Object.assign({}, restProps, { width: width, height: height, children: [_jsxs(Defs, { children: [_jsxs("radialGradient", { id: gradientId, cx: "50%", cy: "30%", r: "70%", children: [_jsx("stop", { offset: "0%", stopColor: tinycolor(themeColors.colorPrimary)
                                    .lighten(30)
                                    .toHexString() }), _jsx("stop", { offset: "100%", stopColor: themeColors.colorPrimary })] }), _jsxs("linearGradient", { id: badgeGradientId, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#ff6b6b" }), _jsx("stop", { offset: "100%", stopColor: "#ee5a52" })] })] }), _jsx(Ellipse, { x: 0, y: 0, width: size, height: size, fill: `url(#${gradientId})`, "data-element-type": "shape" }), _jsx(ItemIcon, { indexes: indexes, x: (size - iconSize) / 2, y: (size - iconSize) / 2, size: iconSize, fill: themeColors.colorPrimaryText }), _jsx(Ellipse, { x: size - badgeSize + 4, width: badgeSize, height: badgeSize, fill: `url(#${badgeGradientId})` }), _jsx(Text, { x: size - badgeSize + 4, width: badgeSize, height: badgeSize, fontSize: 10, fontWeight: "bold", fill: themeColors.colorWhite, alignHorizontal: "center", alignVertical: "middle", children: value > 99 ? '99+' : Math.round(value) }), _jsx(ItemLabel, { indexes: indexes, x: 0, y: size + gap, width: size, alignHorizontal: "center", fontSize: 12, fill: themeColors.colorText, children: datum.label })] })));
};
registerItem('icon-badge', {
    component: IconBadge,
    composites: ['icon', 'label'],
});
