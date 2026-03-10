"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinedText = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const LinedText = (props) => {
    var _a, _b, _c;
    const [{ datum, indexes, width, themeColors, positionH = 'normal', positionV = 'center', formatter = (text) => text || '', usePaletteColor = false, showUnderline = false, underlineGap = 6, underlineExtend = 8, underlineThickness = 2, }, restProps,] = (0, utils_1.getItemProps)(props, [
        'width',
        'formatter',
        'usePaletteColor',
        'showUnderline',
        'underlineGap',
        'underlineExtend',
        'underlineThickness',
    ]);
    const content = formatter((_b = (_a = datum.label) !== null && _a !== void 0 ? _a : datum.desc) !== null && _b !== void 0 ? _b : '');
    const alignH = positionH === 'flipped'
        ? 'right'
        : positionH === 'center'
            ? 'center'
            : 'left';
    const measuredLabel = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: width, children: content }));
    const contentWidth = width !== null && width !== void 0 ? width : measuredLabel.width;
    const labelHeight = measuredLabel.height;
    const underlineWidth = showUnderline ? contentWidth + underlineExtend * 2 : 0;
    const totalHeight = labelHeight + (showUnderline ? underlineGap + underlineThickness : 0);
    const finalWidth = showUnderline
        ? Math.max(contentWidth, underlineWidth)
        : contentWidth;
    const finalHeight = (_c = restProps.height) !== null && _c !== void 0 ? _c : totalHeight;
    const offsetY = positionV === 'middle'
        ? (finalHeight - totalHeight) / 2
        : positionV === 'flipped'
            ? finalHeight - totalHeight
            : 0;
    const labelX = alignH === 'right'
        ? finalWidth - contentWidth
        : alignH === 'center'
            ? (finalWidth - contentWidth) / 2
            : 0;
    const labelY = offsetY;
    const underlineX = alignH === 'right'
        ? finalWidth - underlineWidth
        : alignH === 'center'
            ? (finalWidth - underlineWidth) / 2
            : 0;
    const underlineY = finalHeight;
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { width: finalWidth, height: finalHeight, children: [(0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: labelX, y: labelY, width: contentWidth, height: labelHeight, alignHorizontal: alignH, alignVertical: positionV === 'flipped'
                    ? 'bottom'
                    : positionV === 'center'
                        ? 'middle'
                        : 'top', fill: usePaletteColor ? themeColors.colorPrimary : themeColors.colorText, children: content }), showUnderline && ((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M 0 ${underlineThickness / 2} L ${underlineWidth} ${underlineThickness / 2}`, x: underlineX, y: underlineY - underlineThickness / 2, width: underlineWidth, height: underlineThickness, stroke: themeColors.colorPrimary, strokeWidth: underlineThickness, fill: "none", strokeLinecap: "round", "data-element-type": "shape" }))] })));
};
exports.LinedText = LinedText;
(0, registry_1.registerItem)('lined-text', {
    component: exports.LinedText,
    composites: ['label'],
});
