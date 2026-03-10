"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeCard = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const BadgeCard = (props) => {
    const [{ datum, indexes, width = 200, height = 80, iconSize = 24, badgeSize = 32, gap = 8, positionH = 'normal', themeColors, valueFormatter, }, restProps,] = (0, utils_1.getItemProps)(props, ['width', 'height', 'iconSize', 'badgeSize', 'gap']);
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
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { width: width, height: height, children: [(0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: (0, jsx_runtime_1.jsxs)("radialGradient", { id: gradientId, cx: "50%", cy: "50%", r: "50%", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: themeColors.colorPrimary }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: (0, tinycolor2_1.default)(themeColors.colorPrimary)
                                .darken(20)
                                .toHexString() })] }) }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { "data-element-type": "shape", x: 0, y: 0, width: width, height: height, fill: themeColors.colorPrimaryBg, rx: 8, ry: 8 }), hasIcon && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: badgeX, y: badgeY, width: badgeSize, height: badgeSize, fill: `url(#${gradientId})` }), (0, jsx_runtime_1.jsx)(components_1.ItemIcon, { indexes: indexes, x: badgeX + (badgeSize - iconSize) / 2, y: badgeY + (badgeSize - iconSize) / 2, size: iconSize, fill: themeColors.colorWhite })] })), (0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { flexDirection: "column", x: contentStartX, y: contentY, width: contentWidth, height: !hasValue && !hasDesc ? undefined : contentAreaHeight, alignItems: "center", justifyContent: "center", children: [(0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: contentWidth, alignHorizontal: textAlign, alignVertical: "middle", fontSize: 14, fill: themeColors.colorText, children: datum.label }), hasValue && ((0, jsx_runtime_1.jsx)(components_1.ItemValue, { indexes: indexes, width: contentWidth, alignHorizontal: positionH === 'flipped' ? 'right' : 'left', alignVertical: "middle", fontSize: 18, lineHeight: 1, fontWeight: "bold", fill: themeColors.colorPrimary, value: value, formatter: valueFormatter }))] }), hasDesc && ((0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, x: gap, y: descY, width: fullWidth, alignHorizontal: textAlign, fontSize: 11, fill: themeColors.colorTextSecondary, lineNumber: 2, lineHeight: 1.2, wordWrap: true, children: datum.desc }))] })));
};
exports.BadgeCard = BadgeCard;
(0, registry_1.registerItem)('badge-card', {
    component: exports.BadgeCard,
    composites: ['icon', 'label', 'value', 'desc'],
});
