"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapsuleItem = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const defs_1 = require("../defs");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const CapsuleItem = (props) => {
    const [{ datum, indexes, width = 300, height = 80, gap = 12, positionH = 'normal', iconPadding = height / 10, themeColors, }, restProps,] = (0, utils_1.getItemProps)(props, ['width', 'height', 'gap', 'iconPadding']);
    // Capsule border radius and icon size (icon with some padding inside)
    const borderRadius = height / 2;
    const iconSize = height - iconPadding * 2; // Icon diameter with padding
    // Calculate positions based on positionH and icon presence
    const isFlipped = positionH === 'flipped';
    const hasIcon = !!datum.icon;
    // Calculate text area dimensions
    const textWidth = hasIcon ? width - height - gap : width - gap * 2;
    const textX = hasIcon ? (isFlipped ? gap : height) : gap;
    const textAlign = hasIcon ? (isFlipped ? 'right' : 'left') : 'center';
    const labelProps = {
        indexes,
        width: textWidth,
        alignHorizontal: textAlign,
        alignVertical: 'middle',
        fontSize: 16,
        fontWeight: '600',
        fill: themeColors.colorWhite,
    };
    // Get label bounds to calculate layout
    const labelBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.ItemLabel, Object.assign({}, labelProps, { children: datum.label })));
    const descProps = {
        indexes,
        width: textWidth,
        alignHorizontal: textAlign,
        alignVertical: 'top',
        fontSize: 12,
        lineNumber: 1,
        fill: themeColors.colorWhite,
    };
    // Get desc bounds to calculate layout
    const descBounds = (0, jsx_1.getElementBounds)(datum.desc ? (0, jsx_runtime_1.jsx)(components_1.ItemDesc, Object.assign({}, descProps, { children: datum.desc })) : null);
    // Calculate vertical positions for text elements
    const textGap = 4;
    const totalTextHeight = labelBounds.height + textGap + descBounds.height;
    const textStartY = (height - totalTextHeight) / 2;
    const labelY = textStartY;
    const descY = labelY + labelBounds.height + textGap;
    // Calculate icon position (centered in the circle area with padding)
    const iconX = isFlipped ? width - height + iconPadding : iconPadding;
    const iconY = iconPadding;
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: (0, jsx_runtime_1.jsx)(defs_1.DropShadow, {}) }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: 0, y: 0, width: width, height: height, fill: themeColors.colorPrimary, rx: borderRadius, ry: borderRadius, "data-element-type": "shape" }), datum.icon && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: iconX, y: iconY, width: iconSize, height: iconSize, fillOpacity: 0.5, fill: themeColors.colorBg, filter: "url(#drop-shadow)" }), (0, jsx_runtime_1.jsx)(components_1.ItemIconCircle, { indexes: indexes, x: iconX, y: iconY, size: iconSize, fill: themeColors.colorBg, colorBg: themeColors.colorPrimary })] })), datum.label && ((0, jsx_runtime_1.jsx)(components_1.ItemLabel, Object.assign({ x: textX, y: labelY }, labelProps, { children: datum.label }))), datum.desc && ((0, jsx_runtime_1.jsx)(components_1.ItemDesc, Object.assign({ x: textX, y: descY }, descProps, { children: datum.desc })))] })));
};
exports.CapsuleItem = CapsuleItem;
(0, registry_1.registerItem)('capsule-item', {
    component: exports.CapsuleItem,
    composites: ['icon', 'label', 'desc'],
});
