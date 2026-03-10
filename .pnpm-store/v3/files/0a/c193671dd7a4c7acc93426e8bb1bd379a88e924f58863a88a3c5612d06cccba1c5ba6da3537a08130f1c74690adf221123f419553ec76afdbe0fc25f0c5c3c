"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuarterCircular = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const QuarterCircular = (props) => {
    const [{ datum, indexes, width = 280, height = 120, iconSize = 30, circleRadius = 80, positionH = 'normal', positionV = 'normal', themeColors, }, restProps,] = (0, utils_1.getItemProps)(props, ['width', 'height', 'iconSize', 'circleRadius']);
    // 圆的质心
    const CIRCLE_MASS = (4 * circleRadius) / (3 * Math.PI);
    // 配置参数
    const LINE_WIDTH = 2;
    const DOT_RADIUS = 4;
    const VALUE_SIZE = 28;
    const CARD_Y = 20;
    const CARD_CONTENT_Y = CARD_Y + 20;
    const LABEL_Y = CARD_Y;
    const DESC_Y_OFFSET = 8;
    const DECORATION_VERTICAL_SPACING = 35;
    const DECORATION_HORIZONTAL_SPACING = 40;
    const DECORATION_END_SPACING = 30;
    // 序号（使用 indexes 的第一个值 + 1）
    const indexStr = String(indexes[0] + 1).padStart(2, '0');
    // 根据 positionH 调整布局
    const isFlipped = positionH === 'flipped';
    // 根据 positionV 调整布局
    const isVFlipped = positionV === 'flipped';
    // 计算装饰线的坐标
    const getDecorationCoords = () => {
        if (isFlipped) {
            // 右对齐（镜像布局）
            return {
                diagonalStartX: width - DOT_RADIUS,
                diagonalStartY: isVFlipped
                    ? height - DECORATION_VERTICAL_SPACING
                    : DECORATION_VERTICAL_SPACING,
                diagonalEndX: width - DECORATION_HORIZONTAL_SPACING,
                diagonalEndY: isVFlipped ? height - DOT_RADIUS : DOT_RADIUS,
                topLineStartX: width - DECORATION_HORIZONTAL_SPACING,
                topLineEndX: CIRCLE_MASS,
                topLineY: isVFlipped ? height - DOT_RADIUS : DOT_RADIUS,
            };
        }
        else {
            // 默认左对齐
            return {
                diagonalStartX: DOT_RADIUS,
                diagonalStartY: isVFlipped
                    ? height - DECORATION_VERTICAL_SPACING
                    : DECORATION_VERTICAL_SPACING,
                diagonalEndX: DECORATION_HORIZONTAL_SPACING,
                diagonalEndY: isVFlipped ? height - DOT_RADIUS : DOT_RADIUS,
                topLineStartX: DECORATION_HORIZONTAL_SPACING,
                topLineEndX: width - CIRCLE_MASS,
                topLineY: isVFlipped ? height - DOT_RADIUS : DOT_RADIUS,
            };
        }
    };
    // 计算内容区域的坐标
    const getContentCoords = () => {
        if (isFlipped) {
            // 右对齐（镜像布局）
            const contentX = circleRadius + 10;
            const contentWidth = width - contentX - DECORATION_HORIZONTAL_SPACING;
            return {
                valueX: width - DECORATION_END_SPACING,
                contentX,
                contentWidth,
                circleX: 0,
                circleY: isVFlipped ? 0 : height,
                iconX: CIRCLE_MASS - iconSize / 2,
            };
        }
        else {
            // 默认左对齐
            return {
                valueX: 0,
                contentX: DECORATION_HORIZONTAL_SPACING,
                contentWidth: width - DECORATION_HORIZONTAL_SPACING - circleRadius - 10,
                circleX: width,
                circleY: isVFlipped ? 0 : height,
                iconX: width - CIRCLE_MASS - iconSize / 2,
            };
        }
    };
    // 获取坐标值
    const decorationCoords = getDecorationCoords();
    const contentCoords = getContentCoords();
    // 计算图标Y坐标
    const iconY = isVFlipped
        ? CIRCLE_MASS - iconSize / 2
        : height - CIRCLE_MASS - iconSize / 2;
    // 获取文本尺寸
    const labelBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: contentCoords.contentWidth, children: datum.label }));
    const descY = LABEL_Y + labelBounds.height + DESC_Y_OFFSET;
    // 生成1/4圆路径
    const getQuarterCirclePath = () => {
        const { circleX, circleY } = contentCoords;
        if (isFlipped) {
            return isVFlipped
                ? `M ${circleX} ${circleY} L ${circleX} ${circleY + circleRadius} A ${circleRadius} ${circleRadius} 0 0 0 ${circleX + circleRadius} ${circleY} Z`
                : `M ${circleX} ${circleY} L ${circleX} ${circleY - circleRadius} A ${circleRadius} ${circleRadius} 0 0 1 ${circleX + circleRadius} ${circleY} Z`;
        }
        else {
            return isVFlipped
                ? `M ${circleX} ${circleY} L ${circleX} ${circleY + circleRadius} A ${circleRadius} ${circleRadius} 0 0 1 ${circleX - circleRadius} ${circleY} Z`
                : `M ${circleX} ${circleY} L ${circleX} ${circleY - circleRadius} A ${circleRadius} ${circleRadius} 0 0 0 ${circleX - circleRadius} ${circleY} Z`;
        }
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { width: width, height: height, children: [(0, jsx_runtime_1.jsxs)(components_1.ShapesGroup, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M ${decorationCoords.diagonalStartX} ${decorationCoords.diagonalStartY} L ${decorationCoords.diagonalEndX} ${decorationCoords.diagonalEndY}`, stroke: themeColors.colorPrimary, strokeWidth: LINE_WIDTH, fill: "none" }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M ${decorationCoords.topLineStartX} ${decorationCoords.topLineY} L ${decorationCoords.topLineEndX} ${decorationCoords.topLineY}`, stroke: themeColors.colorPrimary, strokeWidth: LINE_WIDTH, fill: "none" }), (0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: decorationCoords.diagonalStartX - DOT_RADIUS, y: decorationCoords.diagonalStartY - DOT_RADIUS, width: DOT_RADIUS * 2, height: DOT_RADIUS * 2, fill: themeColors.colorPrimary }), (0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: decorationCoords.topLineEndX - DOT_RADIUS, y: decorationCoords.topLineY - DOT_RADIUS, width: DOT_RADIUS * 2, height: DOT_RADIUS * 2, fill: themeColors.colorPrimary })] }), (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Text, { x: contentCoords.valueX, y: CARD_CONTENT_Y, fontSize: VALUE_SIZE, fontWeight: "bold", fill: themeColors.colorPrimary, children: indexStr }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: getQuarterCirclePath(), fill: themeColors.colorPrimary, "data-element-type": "shape" }), datum.icon && ((0, jsx_runtime_1.jsx)(components_1.ItemIcon, { indexes: indexes, x: contentCoords.iconX, y: iconY, size: iconSize, fill: themeColors.colorWhite })), datum.label && ((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: contentCoords.contentX, y: LABEL_Y, width: contentCoords.contentWidth, fontWeight: "bold", fill: themeColors.colorText, alignHorizontal: isFlipped ? 'right' : 'left', children: datum.label })), datum.desc && ((0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, x: contentCoords.contentX, y: descY, width: contentCoords.contentWidth, fill: themeColors.colorTextSecondary, alignHorizontal: isFlipped ? 'right' : 'left', children: datum.desc }))] })] })));
};
exports.QuarterCircular = QuarterCircular;
(0, registry_1.registerItem)('quarter-circular', {
    component: exports.QuarterCircular,
    composites: ['icon', 'label', 'desc'],
});
