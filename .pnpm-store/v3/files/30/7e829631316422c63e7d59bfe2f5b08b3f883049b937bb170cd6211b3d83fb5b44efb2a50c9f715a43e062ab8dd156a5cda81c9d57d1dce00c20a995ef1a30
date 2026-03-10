import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Defs, Ellipse, getElementBounds, Group, Path } from '../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemIcon, ItemsGroup, } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { getColorPrimary, getPaletteColor, getThemeColors } from '../utils/index.js';
import { registerStructure } from './registry.js';
import * as d3 from 'd3';
const ITEM_DISTANCE = 20;
const LINE_GAP = 5;
export const SequenceCircleArrows = (props) => {
    const { Title, Item, data, options, radius = 150, arrowSize = 4, strokeWidth = 10, } = props;
    const { title, desc, items = [] } = data;
    const btnBounds = getElementBounds(_jsx(BtnAdd, { indexes: [0] }));
    const colorPrimary = getColorPrimary(options);
    if (!Item) {
        const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
        return (_jsxs(FlexLayout, { flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsx(Group, { children: _jsx(BtnsGroup, { children: _jsx(BtnAdd, { indexes: [0], x: 0, y: 0 }) }) })] }));
    }
    const count = items.length;
    if (count === 0) {
        const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
        return (_jsxs(FlexLayout, { flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsx(Group, { children: _jsx(BtnsGroup, { children: _jsx(BtnAdd, { indexes: [0], x: 0, y: 0 }) }) })] }));
    }
    const itemBounds = getElementBounds(_jsx(Item, { indexes: [0], data: data, datum: items[0] }));
    const centerX = 0;
    const centerY = 0;
    const angleStep = (2 * Math.PI) / count;
    const positions = [];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    // 计算圆上的点位置，从顶部（-90度）开始顺时针排列
    for (let i = 0; i < count; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        positions.push({ x, y });
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    }
    // 预计算所有连线和 Item 的位置信息
    const lineData = [];
    for (let i = 0; i < count; i++) {
        const startPos = positions[i];
        const endPos = positions[(i + 1) % count];
        const lineLength = Math.sqrt(Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2));
        const circleBigW = Math.min(lineLength * 0.5, 100);
        const midX = (startPos.x + endPos.x) / 2;
        const midY = (startPos.y + endPos.y) / 2;
        minX = Math.min(minX, midX - circleBigW / 2);
        minY = Math.min(minY, midY - circleBigW / 2);
        maxX = Math.max(maxX, midX + circleBigW / 2);
        maxY = Math.max(maxY, midY + circleBigW / 2);
        // 计算连线中点相对于圆心的角度
        const midAngle = Math.atan2(midY - centerY, midX - centerX);
        // 将角度标准化到 [0, 2*PI)
        const normalizedAngle = midAngle < 0 ? midAngle + 2 * Math.PI : midAngle;
        let itemX;
        let itemY;
        // 根据连线中点在圆上的位置，决定 Item 的摆放方向
        // 将圆分为8个区域，每个区域45度
        const deg = (normalizedAngle * 180) / Math.PI;
        // 计算从中点到 Item 的距离（圆心到圆边的距离 + 间距）
        const distanceFromCenter = circleBigW / 2 + ITEM_DISTANCE;
        // 使用极坐标方式计算 Item 位置，确保所有方向的距离一致
        const itemCenterX = midX + Math.cos(midAngle) * distanceFromCenter;
        const itemCenterY = midY + Math.sin(midAngle) * distanceFromCenter;
        // 根据角度微调 Item 的对齐方式
        if (deg >= 337.5 || deg < 22.5) {
            // 右侧 (0度附近)，Item 左对齐
            itemX = itemCenterX;
            itemY = itemCenterY - itemBounds.height / 2;
        }
        else if (deg >= 22.5 && deg < 67.5) {
            // 右下角，Item 左上对齐
            itemX = itemCenterX;
            itemY = itemCenterY;
        }
        else if (deg >= 67.5 && deg < 112.5) {
            // 下方 (90度附近)，Item 顶部居中对齐
            itemX = itemCenterX - itemBounds.width / 2;
            itemY = itemCenterY;
        }
        else if (deg >= 112.5 && deg < 157.5) {
            // 左下角，Item 右上对齐
            itemX = itemCenterX - itemBounds.width;
            itemY = itemCenterY;
        }
        else if (deg >= 157.5 && deg < 202.5) {
            // 左侧 (180度附近)，Item 右对齐
            itemX = itemCenterX - itemBounds.width;
            itemY = itemCenterY - itemBounds.height / 2;
        }
        else if (deg >= 202.5 && deg < 247.5) {
            // 左上角，Item 右下对齐
            itemX = itemCenterX - itemBounds.width;
            itemY = itemCenterY - itemBounds.height;
        }
        else if (deg >= 247.5 && deg < 292.5) {
            // 上方 (270度附近)，Item 底部居中对齐
            itemX = itemCenterX - itemBounds.width / 2;
            itemY = itemCenterY - itemBounds.height;
        }
        else {
            // 右上角 (deg >= 292.5 && deg < 337.5)，Item 左下对齐
            itemX = itemCenterX;
            itemY = itemCenterY - itemBounds.height;
        }
        lineData.push({ lineLength, circleBigW, midX, midY, itemX, itemY });
        minX = Math.min(minX, itemX);
        minY = Math.min(minY, itemY);
        maxX = Math.max(maxX, itemX + itemBounds.width + btnBounds.width + 5);
        maxY = Math.max(maxY, itemY + itemBounds.height);
    }
    const offsetX = Math.max(0, -minX);
    const offsetY = Math.max(0, -minY);
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    const btnElements = [];
    const itemElements = [];
    const decorElements = [];
    const defsElements = [];
    const itemPositions = positions.map((pos) => ({
        x: pos.x + offsetX,
        y: pos.y + offsetY,
    }));
    for (let i = 0; i < count; i++) {
        const startPos = itemPositions[i];
        const endPos = itemPositions[(i + 1) % count];
        const nextIndex = (i + 1) % count;
        const indexes = [i];
        // 使用预计算的数据
        const { lineLength, circleBigW, midX, midY } = lineData[i];
        const CIRCLE_SMALL_W = Math.max(circleBigW - 20, 20);
        const ICON_SIZE = Math.max(CIRCLE_SMALL_W * 0.4, 16);
        const color = getPaletteColor(options, indexes) || colorPrimary;
        const dx = endPos.x - startPos.x;
        const dy = endPos.y - startPos.y;
        const length = lineLength;
        const unitX = dx / length;
        const unitY = dy / length;
        const minLineLength = LINE_GAP * 2 + arrowSize;
        const actualGap = Math.min(LINE_GAP, (length - minLineLength) / 2);
        const adjustedStartX = Math.max(0, startPos.x + unitX * actualGap);
        const adjustedStartY = Math.max(0, startPos.y + unitY * actualGap);
        const adjustedEndX = Math.max(0, endPos.x - unitX * actualGap);
        const adjustedEndY = Math.max(0, endPos.y - unitY * actualGap);
        const line = d3
            .line()
            .x((d) => Math.max(0, d.x))
            .y((d) => Math.max(0, d.y))
            .curve(d3.curveLinear);
        const pathD = line([
            { x: adjustedStartX, y: adjustedStartY },
            { x: adjustedEndX, y: adjustedEndY },
        ]) || '';
        const colorClean = color.replace(/[^a-zA-Z0-9]/g, '');
        const arrowId = `fork-arrow-${colorClean}-${i}`;
        const forkArrowPath = `
      M ${-arrowSize * 0.6} ${-arrowSize * 0.4}
      L 0 0
      L ${-arrowSize * 0.6} ${arrowSize * 0.4}
    `;
        defsElements.push(_jsx("marker", { id: arrowId, viewBox: `${-arrowSize} ${-arrowSize * 0.6} ${arrowSize * 1.2} ${arrowSize * 1.2}`, refX: -arrowSize * 0.08, refY: 0, markerWidth: arrowSize, markerHeight: arrowSize, orient: "auto", markerUnits: "strokeWidth", children: _jsx("path", { d: forkArrowPath, fill: "none", stroke: color, strokeLinecap: "round", strokeLinejoin: "round", "data-element-type": "shape" }) }));
        decorElements.push(_jsx(Path, { d: pathD, stroke: color, strokeWidth: strokeWidth, fill: "none", markerEnd: `url(#${arrowId})`, strokeLinecap: "round", "data-element-type": "shape" }));
        // 使用预计算的 midX 和 midY（需要加上 offset）
        const adjustedMidX = midX + offsetX;
        const adjustedMidY = midY + offsetY;
        const themeColors = getThemeColors({
            colorPrimary: color || colorPrimary,
        }, options);
        decorElements.push(_jsx(Ellipse, { x: Math.max(0, adjustedMidX - circleBigW / 2), y: Math.max(0, adjustedMidY - circleBigW / 2), width: circleBigW, height: circleBigW, fill: themeColors.colorPrimaryBg, "data-element-type": "shape" }));
        decorElements.push(_jsx(Ellipse, { x: Math.max(0, adjustedMidX - CIRCLE_SMALL_W / 2), y: Math.max(0, adjustedMidY - CIRCLE_SMALL_W / 2), width: CIRCLE_SMALL_W, height: CIRCLE_SMALL_W, fill: "#ffffff" }));
        decorElements.push(_jsx(ItemIcon, { x: Math.max(0, adjustedMidX - ICON_SIZE / 2), y: Math.max(0, adjustedMidY - ICON_SIZE / 2), size: ICON_SIZE, indexes: indexes, fill: color }));
        const btnAddX = Math.max(0, adjustedMidX - btnBounds.width / 2);
        const btnAddY = Math.max(0, adjustedMidY - btnBounds.height / 2);
        btnElements.push(_jsx(BtnAdd, { indexes: [nextIndex], x: btnAddX, y: btnAddY }));
    }
    for (let i = 0; i < count; i++) {
        const indexes = [i];
        const item = items[i];
        // 使用预计算的 Item 位置（需要加上 offset）
        const { itemX: preItemX, itemY: preItemY } = lineData[i];
        const itemX = Math.max(0, preItemX + offsetX);
        const itemY = Math.max(0, preItemY + offsetY);
        itemElements.push(_jsx(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: itemY }));
        const btnRemoveX = Math.max(0, itemX + itemBounds.width + 5);
        const btnRemoveY = Math.max(0, itemY + itemBounds.height / 2 - btnBounds.height / 2);
        btnElements.push(_jsx(BtnRemove, { indexes: indexes, x: btnRemoveX, y: btnRemoveY }));
    }
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 30, children: [titleContent, _jsxs(Group, { x: 0, y: 0, children: [_jsx(Defs, { children: defsElements }), _jsx(Group, { children: decorElements }), _jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('sequence-circle-arrows', {
    component: SequenceCircleArrows,
    composites: ['title', 'item'],
});
