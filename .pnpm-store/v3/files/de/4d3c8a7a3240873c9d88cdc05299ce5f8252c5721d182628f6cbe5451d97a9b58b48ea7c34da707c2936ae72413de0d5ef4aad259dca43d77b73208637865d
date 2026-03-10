"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quadrant = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const registry_1 = require("./registry");
// 配置常量
const QUADRANT_CONFIG = {
    axisColor: '#D9D9D9',
    axisArrowSize: 5,
    strokeWidth: 1,
    dashArray: '4,2', // 虚线样式：4px线段，2px间隔
    defaultExtraSpacing: 20, // 默认额外间距
};
const Quadrant = (props) => {
    const { Title, Item, data, quadrantWidth: userQuadrantWidth, quadrantHeight: userQuadrantHeight, showAxis = true, dashedAxis = true, } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    // 限制只显示4个象限数据，不足时填充空值
    const quadrantItems = Array.from({ length: 4 }, (_, i) => items[i]);
    // 计算单个象限项的尺寸 - 使用可选链处理空值
    const itemBounds = quadrantItems[0]
        ? (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: quadrantItems[0] }))
        : { width: 0, height: 0 };
    // 基于 Item 包围盒计算默认象限尺寸
    // 横向基于 Item 的宽，纵向基于 Item 的高，并加上额外的间距
    const quadrantWidth = userQuadrantWidth !== null && userQuadrantWidth !== void 0 ? userQuadrantWidth : itemBounds.width + QUADRANT_CONFIG.defaultExtraSpacing;
    const quadrantHeight = userQuadrantHeight !== null && userQuadrantHeight !== void 0 ? userQuadrantHeight : itemBounds.height + QUADRANT_CONFIG.defaultExtraSpacing;
    // 计算象限位置 - 默认使用居中对齐
    const quadrantPositions = calculateQuadrantPositions(quadrantWidth, quadrantHeight, itemBounds);
    // itemElements
    const itemElements = quadrantItems
        .map((item, index) => {
        if (!item)
            return null;
        const position = quadrantPositions[index];
        return ((0, jsx_runtime_1.jsx)(Item, { indexes: [index], datum: item, data: data, x: position.x, y: position.y, positionH: index % 2 ? 'flipped' : 'normal', positionV: index < 2 ? 'normal' : 'flipped' }));
    })
        .filter(Boolean); // 过滤掉 null 值
    // createAxisElements
    const axisElements = createAxisElements(quadrantWidth, quadrantHeight, showAxis, dashedAxis);
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { width: quadrantWidth * 2, height: quadrantHeight * 2, children: [axisElements, (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements })] })] }));
};
exports.Quadrant = Quadrant;
// 坐标轴绘制函数
function createAxisElements(quadrantWidth, quadrantHeight, showAxis, dashedAxis) {
    if (!showAxis)
        return [];
    const { axisColor, axisArrowSize, strokeWidth, dashArray } = QUADRANT_CONFIG;
    const centerX = quadrantWidth;
    const centerY = quadrantHeight;
    const maxX = quadrantWidth * 2;
    const maxY = quadrantHeight * 2;
    const strokeDasharray = dashedAxis ? dashArray : undefined;
    return [
        // X 轴
        (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M 0 ${centerY} L ${maxX} ${centerY}`, stroke: axisColor, strokeWidth: strokeWidth, strokeDasharray: strokeDasharray, fill: "none", "data-element-type": "shape" }),
        // X 轴正方向箭头（右侧）
        (0, jsx_runtime_1.jsxs)(components_1.ShapesGroup, { transform: `translate(${maxX}, ${centerY})`, children: [(0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M 0 0 L ${-axisArrowSize} ${-axisArrowSize / 2}`, stroke: axisColor, strokeWidth: strokeWidth, fill: "none" }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M 0 0 L ${-axisArrowSize} ${axisArrowSize / 2}`, stroke: axisColor, strokeWidth: strokeWidth, fill: "none" })] }),
        // X 轴负方向箭头（左侧）
        (0, jsx_runtime_1.jsxs)(components_1.ShapesGroup, { transform: `translate(0, ${centerY})`, children: [(0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M 0 0 L ${axisArrowSize} ${-axisArrowSize / 2}`, stroke: axisColor, strokeWidth: strokeWidth, fill: "none" }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M 0 0 L ${axisArrowSize} ${axisArrowSize / 2}`, stroke: axisColor, strokeWidth: strokeWidth, fill: "none" })] }),
        // Y 轴
        (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M ${centerX} 0 L ${centerX} ${maxY}`, stroke: axisColor, strokeWidth: strokeWidth, strokeDasharray: strokeDasharray, fill: "none", "data-element-type": "shape" }),
        // Y 轴正方向箭头（上方）
        (0, jsx_runtime_1.jsxs)(components_1.ShapesGroup, { transform: `translate(${centerX}, 0)`, children: [(0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M 0 0 L ${-axisArrowSize / 2} ${axisArrowSize}`, stroke: axisColor, strokeWidth: strokeWidth, fill: "none" }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M 0 0 L ${axisArrowSize / 2} ${axisArrowSize}`, stroke: axisColor, strokeWidth: strokeWidth, fill: "none" })] }),
        // Y 轴负方向箭头（下方）
        (0, jsx_runtime_1.jsxs)(components_1.ShapesGroup, { transform: `translate(${centerX}, ${maxY})`, children: [(0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M 0 0 L ${-axisArrowSize / 2} ${-axisArrowSize}`, stroke: axisColor, strokeWidth: strokeWidth, fill: "none" }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M 0 0 L ${axisArrowSize / 2} ${-axisArrowSize}`, stroke: axisColor, strokeWidth: strokeWidth, fill: "none" })] }),
    ];
}
// 象限位置计算函数 - 默认居中对齐
function calculateQuadrantPositions(quadrantWidth, quadrantHeight, itemBounds) {
    // 计算每个象限的中心点，然后将 item 居中放置
    const centerX = quadrantWidth / 2;
    const centerY = quadrantHeight / 2;
    return [
        {
            x: centerX - itemBounds.width / 2,
            y: centerY - itemBounds.height / 2,
        }, // 第一象限 (左上)
        {
            x: quadrantWidth + centerX - itemBounds.width / 2,
            y: centerY - itemBounds.height / 2,
        }, // 第二象限 (右上)
        {
            x: centerX - itemBounds.width / 2,
            y: quadrantHeight + centerY - itemBounds.height / 2,
        }, // 第三象限 (左下)
        {
            x: quadrantWidth + centerX - itemBounds.width / 2,
            y: quadrantHeight + centerY - itemBounds.height / 2,
        }, // 第四象限 (右下)
    ];
}
(0, registry_1.registerStructure)('quadrant', {
    component: exports.Quadrant,
    composites: ['title', 'item'],
});
