"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceRoadmapVertical = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const decorations_1 = require("../decorations");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const CONFIG = {
    iconSize: 50,
    roadWidth: 24,
    outerRadius: 60,
    rowWidth: 400,
    spacing: 30,
    colorDefault: '#666666',
};
const moveTo = (x, y) => `M ${x} ${y}`;
const lineTo = (x, y) => `L ${x} ${y}`;
const arcTo = (r, sweep, x, y) => `A ${r} ${r} 0 0 ${sweep} ${x} ${y}`;
const getYPositions = (i, { roadWidth, innerRadius, outerRadius, }) => {
    const y1 = (roadWidth + innerRadius * 2) * i;
    return {
        y1,
        y2: y1 + roadWidth,
        y3: y1 + roadWidth + innerRadius,
        y4: y1 + roadWidth + innerRadius * 2,
        y5: y1 + outerRadius * 2,
    };
};
function renderItemRow({ i, direction, x, y, color, data, itemBounds, item, Item, flipped, }) {
    const { iconSize } = CONFIG;
    const isLeft = direction === 'left';
    const iconX = isLeft ? x.x4 - iconSize / 2 : x.x3 - iconSize / 2;
    const iconY = y.y3 - iconSize / 2;
    const itemX = isLeft
        ? x.x6 + CONFIG.spacing
        : x.x1 - CONFIG.spacing - itemBounds.width;
    const itemY = y.y3 - itemBounds.height / 2;
    // 根据 flipped 参数决定 positionH
    const positionH = isLeft
        ? flipped
            ? 'flipped'
            : 'normal'
        : flipped
            ? 'normal'
            : 'flipped';
    return {
        icon: ((0, jsx_runtime_1.jsx)(components_1.ItemIconCircle, { indexes: [i], x: iconX, y: iconY, size: iconSize, fill: color })),
        label: ((0, jsx_runtime_1.jsx)(jsx_1.Text, { width: 40, x: isLeft ? iconX - 50 : iconX + iconSize + 10, y: iconY + iconSize / 2 - 15, fontSize: 30, fill: color, alignHorizontal: isLeft ? 'right' : 'left', children: String(i + 1).padStart(2, '0') })),
        item: ((0, jsx_runtime_1.jsx)(Item, { indexes: [i], data: data, datum: item, x: itemX, y: itemY, positionH: positionH })),
    };
}
function buildDecorations({ direction, x, y, color, elements }) {
    const isLeft = direction === 'left';
    elements.push((0, jsx_runtime_1.jsx)(decorations_1.Triangle, { x: isLeft ? x.x6 + 10 : x.x1 - 20, y: y.y3 - 5, width: 10, height: 8, rotation: isLeft ? 90 : -90, colorPrimary: color, "data-element-type": "shape" }));
}
const SequenceRoadmapVertical = (props) => {
    const { Title, Item, data, spacing = CONFIG.spacing, options, flipped = false, } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
    const { roadWidth, outerRadius, rowWidth, colorDefault } = CONFIG;
    const halfRoadWidth = roadWidth / 2;
    const innerRadius = outerRadius - roadWidth;
    const totalWidth = (itemBounds.width + spacing) * 2 + rowWidth;
    const x1 = itemBounds.width + spacing;
    const x3 = x1 + outerRadius;
    const x4 = x1 + rowWidth - outerRadius;
    const x5 = x4 + innerRadius;
    const x6 = x5 + roadWidth;
    const xMid = x1 + rowWidth / 2;
    const midPath = [];
    const positivePath = [];
    const negativePath = [];
    const itemIcons = [];
    const seriesNumber = [];
    const itemElements = [];
    const decorationElements = [];
    for (let i = 0; i < items.length; i++) {
        const color = (0, utils_1.getPaletteColor)(options, [i]) || colorDefault;
        const direction = i % 2 === 0 ? 'right' : 'left';
        const isFirst = i === 0;
        const isLast = i === items.length - 1;
        const y = getYPositions(i, { roadWidth, innerRadius, outerRadius });
        if (direction === 'right') {
            const p1 = isFirst ? [x6, y.y1] : [x4, y.y1];
            const p2 = [x3, y.y1];
            const p3 = [x3, y.y5];
            const p4 = isFirst ? [x6, y.y2] : [x4, y.y2];
            const p5 = [x3, y.y2];
            midPath.push(isFirst
                ? moveTo(x6, y.y1 + halfRoadWidth)
                : lineTo(x4, y.y1 + halfRoadWidth), lineTo(x3, y.y1 + halfRoadWidth), arcTo(outerRadius - halfRoadWidth, 0, x3, y.y4 + halfRoadWidth));
            positivePath.push(isFirst ? moveTo(...p1) : lineTo(...p1), lineTo(...p2), arcTo(outerRadius, 0, ...p3));
            negativePath.push(lineTo(...p4), lineTo(...p5), arcTo(innerRadius, 1, ...p5));
            if (isLast) {
                const s = roadWidth / 2;
                positivePath.push(lineTo(xMid, y.y5), lineTo(xMid, y.y5 + s), lineTo(xMid + roadWidth, y.y5 - s), lineTo(xMid, y.y4 - s), lineTo(xMid, y.y4), lineTo(x3, y.y4));
                midPath.push(lineTo(xMid, y.y4 + halfRoadWidth));
            }
        }
        else {
            const p1 = [x3, y.y2];
            const p2 = [x4, y.y2];
            const p3 = [x4, y.y4];
            const p4 = [x3, y.y1];
            const p5 = [x4, y.y1];
            midPath.push(lineTo(x4, y.y1 + halfRoadWidth), arcTo(outerRadius - halfRoadWidth, 1, x4, y.y4 + halfRoadWidth));
            positivePath.push(lineTo(...p1), lineTo(...p2), arcTo(innerRadius, 1, ...p3));
            negativePath.push(lineTo(...p4), lineTo(...p5), arcTo(outerRadius, 0, ...p5));
            if (isLast) {
                const s = roadWidth / 2;
                positivePath.push(lineTo(xMid, y.y4), lineTo(xMid, y.y4 - s), lineTo(xMid - roadWidth, y.y4 + s), lineTo(xMid, y.y5 + s), lineTo(xMid, y.y5), lineTo(x4, y.y5));
                midPath.push(lineTo(xMid, y.y4 + halfRoadWidth));
            }
        }
        // 装饰
        buildDecorations({
            direction,
            x: { x1, x4, x6 },
            y,
            color,
            elements: decorationElements,
        });
        // 元素
        const { icon, label, item } = renderItemRow({
            i,
            direction,
            x: { x1, x3, x4, x6 },
            y,
            color,
            data,
            itemBounds,
            item: items[i],
            Item,
            flipped,
        });
        itemIcons.push(icon);
        seriesNumber.push(label);
        itemElements.push(item);
    }
    const pathArr = [...positivePath, ...negativePath.reverse(), 'Z'];
    const roadmapHeight = items.length * (roadWidth + innerRadius * 2) + roadWidth * 1.5;
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { width: totalWidth, height: itemBounds.height <= outerRadius * 2
                    ? roadmapHeight
                    : roadmapHeight + itemBounds.height - outerRadius * 2, children: [(0, jsx_runtime_1.jsx)(jsx_1.Path, { width: rowWidth, height: roadmapHeight, d: pathArr.join(' '), fill: colorDefault, stroke: colorDefault, strokeWidth: "4", strokeLinecap: "round", strokeLinejoin: "round", "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: midPath.join(' '), stroke: "white", fill: "none", strokeWidth: "3", strokeDasharray: "8 8", strokeLinecap: "round", strokeLinejoin: "round", "data-element-type": "shape" }), (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [itemIcons, seriesNumber, itemElements, decorationElements] })] })] }));
};
exports.SequenceRoadmapVertical = SequenceRoadmapVertical;
(0, registry_1.registerStructure)('sequence-roadmap-vertical', {
    component: exports.SequenceRoadmapVertical,
    composites: ['title', 'item'],
});
