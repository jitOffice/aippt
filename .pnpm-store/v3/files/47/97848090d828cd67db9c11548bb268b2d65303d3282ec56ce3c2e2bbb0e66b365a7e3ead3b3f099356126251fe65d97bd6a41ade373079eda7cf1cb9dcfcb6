"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnderlineText = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const underlineWidth = 80;
const underlineHeight = 3;
const UnderlineText = (props) => {
    const [{ datum, indexes, width = 200, gap = 4, positionH = 'center', themeColors }, restProps,] = (0, utils_1.getItemProps)(props, ['width', 'height', 'gap']);
    // 获取各元素的尺寸
    const labelBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, fontSize: 18, fontWeight: "bold", width: width, children: datum.label }));
    const descBounds = datum.desc
        ? (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: width, wordWrap: true, children: datum.desc }))
        : { width: 0, height: 0 };
    // 计算内容总高度
    const contentHeight = labelBounds.height +
        gap +
        underlineHeight +
        (datum.desc ? gap * 2 + descBounds.height : 0);
    // 标题位置
    const titleX = 0; // 使用 alignHorizontal 控制对齐
    const titleY = 0;
    // 对齐方式
    const alignHorizontal = positionH === 'center'
        ? 'center'
        : positionH === 'flipped'
            ? 'right'
            : 'left';
    // 下划线位置（受 positionH 控制）
    const underlineX = positionH === 'center'
        ? (width - underlineWidth) / 2
        : positionH === 'flipped'
            ? width - underlineWidth
            : 0;
    const underlineY = titleY + labelBounds.height + gap;
    // 描述文本位置
    const descX = 0; // 使用 alignHorizontal 控制对齐
    const descY = underlineY + underlineHeight + gap * 2;
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({ width: width, height: contentHeight }, restProps, { children: [datum.label && ((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: titleX, y: titleY, width: width, alignHorizontal: alignHorizontal, fill: themeColors.colorPrimary, fontSize: 18, fontWeight: "bold", children: datum.label })), datum.label && ((0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: underlineX, y: underlineY, width: underlineWidth, height: underlineHeight, fill: themeColors.colorPrimary, "data-element-type": "shape" })), datum.desc && ((0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: width, x: descX, y: descY, alignHorizontal: alignHorizontal, wordWrap: true, fill: themeColors.colorText, children: datum.desc }))] })));
};
exports.UnderlineText = UnderlineText;
(0, registry_1.registerItem)('underline-text', {
    component: exports.UnderlineText,
    composites: ['label', 'desc'],
});
