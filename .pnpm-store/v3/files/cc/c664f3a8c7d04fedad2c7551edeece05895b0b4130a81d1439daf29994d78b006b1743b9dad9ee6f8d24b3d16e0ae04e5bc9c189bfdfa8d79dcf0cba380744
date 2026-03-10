"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuarterSimpleCard = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const QuarterSimpleCard = (props) => {
    const [{ datum, indexes, width = 150, height = 150, iconSize = 30, padding = 20, borderRadius = 16, positionH = 'center', positionV = 'middle', themeColors, }, restProps,] = (0, utils_1.getItemProps)(props, [
        'width',
        'height',
        'iconSize',
        'padding',
        'borderRadius',
    ]);
    // 计算内容区域
    const contentWidth = width - padding * 2;
    const contentX = padding;
    const contentY = padding;
    // 图标位置
    const iconX = positionH === 'flipped'
        ? width - padding - iconSize
        : positionH === 'center'
            ? (width - iconSize) / 2
            : contentX;
    const iconY = contentY;
    // 标签位置（图标下方）
    const labelY = iconY + iconSize + 8;
    const labelBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: contentWidth, children: datum.label }));
    const labelX = positionH === 'flipped'
        ? width - padding - contentWidth
        : positionH === 'center'
            ? padding
            : contentX;
    // 描述位置（标签下方）
    const descY = labelY + labelBounds.height + 4;
    const descX = labelX;
    // 根据 positionH 和 positionV 决定直角位置
    const r = borderRadius;
    let cardPath = '';
    if (positionH === 'center' && positionV === 'middle') {
        // 四个角都为圆角
        cardPath = `
  M ${r} 0
  L ${width - r} 0
  Q ${width} 0 ${width} ${r}
  L ${width} ${height - r}
  Q ${width} ${height} ${width - r} ${height}
  L ${r} ${height}
  Q 0 ${height} 0 ${height - r}
  L 0 ${r}
  Q 0 0 ${r} 0
  Z
`;
    }
    else if (positionH === 'flipped' && positionV === 'flipped') {
        // 直角在左下角
        cardPath = `
  M ${r} 0
  L ${width - r} 0
  Q ${width} 0 ${width} ${r}
  L ${width} ${height - r}
  Q ${width} ${height} ${width - r} ${height}
  L ${r} ${height}
  Q 0 ${height} 0 ${height - r}
  L 0 0
  L ${r} 0
  Z
`;
    }
    else if (positionH === 'normal' && positionV === 'flipped') {
        // 右上角为直角，其它角为圆角
        cardPath = `
  M 0 0
  L ${width} 0
  L ${width} ${height - r}
  Q ${width} ${height} ${width - r} ${height}
  L ${r} ${height}
  Q 0 ${height} 0 ${height - r}
  L 0 ${r}
  Q 0 0 ${r} 0
  Z
`;
    }
    else if (positionH === 'flipped') {
        // 直角在左上角
        cardPath = `
  M ${r} 0
  L ${width - r} 0
  Q ${width} 0 ${width} ${r}
  L ${width} ${height - r}
  Q ${width} ${height} ${width - r} ${height}
  L 0 ${height}
  L 0 ${r}
  Q 0 0 ${r} 0
  Z
`;
    }
    else {
        // 默认逻辑：直角在右下角
        cardPath = `
  M ${r} 0
  L ${width - r} 0
  Q ${width} 0 ${width} ${r}
  L ${width} ${height}
  L ${r} ${height}
  Q 0 ${height} 0 ${height - r}
  L 0 ${r}
  Q 0 0 ${r} 0
  Z
`;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Path, { d: cardPath, x: 0, y: 0, width: width, height: height, fill: themeColors.colorPrimary, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(components_1.ItemIcon, { indexes: indexes, x: iconX, y: iconY, size: iconSize, fill: themeColors.colorBg }), (0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: labelX, y: labelY, width: contentWidth, fontSize: 14, fontWeight: "bold", fill: themeColors.colorBg, alignHorizontal: positionH === 'flipped' ? 'right' : 'left', children: datum.label }), datum.desc && ((0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, x: descX, y: descY, width: contentWidth, fontSize: 11, wordWrap: true, fill: themeColors.colorBg, alignHorizontal: positionH === 'flipped' ? 'right' : 'left', children: datum.desc }))] })));
};
exports.QuarterSimpleCard = QuarterSimpleCard;
(0, registry_1.registerItem)('quarter-simple-card', {
    component: exports.QuarterSimpleCard,
    composites: ['icon', 'label', 'desc'],
});
