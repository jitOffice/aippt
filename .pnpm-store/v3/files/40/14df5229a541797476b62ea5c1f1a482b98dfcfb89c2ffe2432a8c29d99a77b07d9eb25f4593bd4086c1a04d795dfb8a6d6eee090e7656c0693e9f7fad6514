import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../../jsx-runtime.js";
import tinycolor from 'tinycolor2';
import { Defs, getElementBounds, Group, Path, Rect, Text } from '../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { getColorPrimary, getPaletteColor } from '../utils/index.js';
import { registerStructure } from './registry.js';
const calculateDepthOffset = (pairIndex, cylinderRx) => {
    if (pairIndex === 0)
        return 0;
    if (pairIndex === 1)
        return cylinderRx / 2;
    return cylinderRx / 2 + (pairIndex - 1) * ((cylinderRx / 2) * 3);
};
const calculateLateralOffset = (isLeft, pairIndex, cylinderRx) => {
    if (isLeft)
        return 0;
    const firstPairGap = 2;
    const normalGap = cylinderRx;
    const gap = pairIndex === 0 ? firstPairGap : normalGap;
    return cylinderRx * 2 + gap;
};
const calculateLayoutMetrics = (itemsCount, itemBounds, cylinderRx, baseHeight, heightIncrement, depthSpacing, firstDecorationWidth, gapFromCylinder) => {
    const planeStepY = Math.max(6, depthSpacing * 0.15);
    const lastCylinderHeight = baseHeight + (itemsCount - 1) * heightIncrement;
    const totalPlaneOffset = itemsCount * planeStepY;
    const bottomMargin = 100;
    const topMargin = 50;
    const canvasHeight = lastCylinderHeight + totalPlaneOffset + bottomMargin + topMargin;
    const startY = canvasHeight - bottomMargin;
    let leftItemAlignedX = 0;
    let rightItemAlignedX = 0;
    let cylindersCenterX = 0;
    let cylinderAreaStartX = 0;
    if (itemsCount > 0) {
        const tempCylinderStart = 0;
        let minCylinderX = Infinity;
        let maxCylinderX = -Infinity;
        for (let index = 0; index < itemsCount; index++) {
            const isLeft = index % 2 === 0;
            const pairIndex = Math.floor(index / 2);
            const depthOffset = calculateDepthOffset(pairIndex, cylinderRx);
            const lateralOffset = calculateLateralOffset(isLeft, pairIndex, cylinderRx);
            const x = tempCylinderStart + lateralOffset + depthOffset;
            minCylinderX = Math.min(minCylinderX, x - cylinderRx);
            maxCylinderX = Math.max(maxCylinderX, x + cylinderRx);
        }
        const relativeCylindersCenterX = (minCylinderX + maxCylinderX) / 2;
        const firstCylinderRelativeX = tempCylinderStart;
        leftItemAlignedX = 0;
        const leftLineEndX = leftItemAlignedX + itemBounds.width + gapFromCylinder;
        const firstCylinderLeftEdge = leftLineEndX + firstDecorationWidth;
        const requiredFirstCylinderX = firstCylinderLeftEdge + cylinderRx;
        cylinderAreaStartX = requiredFirstCylinderX;
        cylindersCenterX =
            cylinderAreaStartX - firstCylinderRelativeX + relativeCylindersCenterX;
        const firstItemCenterX = leftItemAlignedX + itemBounds.width / 2;
        const distanceToCenter = cylindersCenterX - firstItemCenterX;
        const rightItemCenterX = cylindersCenterX + distanceToCenter;
        rightItemAlignedX = rightItemCenterX - itemBounds.width / 2;
    }
    return {
        canvasHeight,
        startY,
        leftItemAlignedX,
        rightItemAlignedX,
        cylinderAreaStartX,
    };
};
const calculateCylinderPosition = (index, cylinderRx, baseHeight, heightIncrement, planeStepY, startY, cylinderAreaStartX) => {
    const isLeft = index % 2 === 0;
    const pairIndex = Math.floor(index / 2);
    const depthOffset = calculateDepthOffset(pairIndex, cylinderRx);
    const lateralOffset = calculateLateralOffset(isLeft, pairIndex, cylinderRx);
    const x = cylinderAreaStartX + lateralOffset + depthOffset;
    const bottomY = startY - index * planeStepY;
    const height = baseHeight + index * heightIncrement;
    const topY = bottomY - height;
    return { x, y: topY, height, bottomY, topY };
};
const calculateItemPosition = (index, cylinderPos, itemBounds, cylinderRx, leftItemAlignedX, rightItemAlignedX, itemVerticalAlign, itemVerticalOffset, gapFromCylinder) => {
    const isLeft = index % 2 === 0;
    const lineY = cylinderPos.topY + cylinderPos.height * 0.05;
    let itemX;
    let lineEndX;
    if (isLeft) {
        itemX = leftItemAlignedX;
        lineEndX = itemX + itemBounds.width + gapFromCylinder;
    }
    else {
        itemX = rightItemAlignedX;
        lineEndX = itemX - gapFromCylinder;
    }
    let itemY;
    if (itemVerticalAlign === 'top') {
        itemY = lineY;
    }
    else if (itemVerticalAlign === 'bottom') {
        itemY = lineY - itemBounds.height;
    }
    else {
        itemY = lineY - itemBounds.height / 2;
    }
    itemY += itemVerticalOffset;
    const cylinderEdgeX = isLeft
        ? cylinderPos.x - cylinderRx
        : cylinderPos.x + cylinderRx;
    const lineStartX = isLeft
        ? cylinderEdgeX - gapFromCylinder
        : cylinderEdgeX + gapFromCylinder;
    return { itemPos: { x: itemX, y: itemY }, lineStartX, lineEndX, lineY };
};
const createGradientDefs = (index, color) => {
    const baseColor = tinycolor(color);
    const defs = [];
    defs.push(_jsxs("linearGradient", { id: `cylinderGradient${index}`, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: baseColor.toRgbString(), stopOpacity: 0.7 }), _jsx("stop", { offset: "40%", stopColor: baseColor.clone().lighten(5).toRgbString(), stopOpacity: 0.65 }), _jsx("stop", { offset: "70%", stopColor: baseColor.clone().lighten(15).toRgbString(), stopOpacity: 0.6 }), _jsx("stop", { offset: "100%", stopColor: baseColor.clone().lighten(20).toRgbString(), stopOpacity: 0.55 })] }));
    defs.push(_jsxs("linearGradient", { id: `topGradient${index}`, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: baseColor.clone().lighten(15).toRgbString(), stopOpacity: 1 }), _jsx("stop", { offset: "100%", stopColor: "#fafafa", stopOpacity: 1 })] }));
    defs.push(_jsxs("linearGradient", { id: `bottomGradient${index}`, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: baseColor.clone().darken(8).toRgbString(), stopOpacity: 0.75 }), _jsx("stop", { offset: "50%", stopColor: baseColor.clone().darken(5).toRgbString(), stopOpacity: 0.7 }), _jsx("stop", { offset: "100%", stopColor: baseColor.clone().darken(12).toRgbString(), stopOpacity: 0.65 })] }));
    defs.push(_jsxs("linearGradient", { id: `numberGradient${index}`, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: baseColor.clone().darken(0).toRgbString(), stopOpacity: 0.9 }), _jsx("stop", { offset: "50%", stopColor: baseColor.clone().lighten(5).toRgbString(), stopOpacity: 0.85 }), _jsx("stop", { offset: "100%", stopColor: baseColor.clone().lighten(10).toRgbString(), stopOpacity: 0.8 })] }));
    defs.push(_jsxs("linearGradient", { id: `glowGradient${index}`, x1: "0%", y1: "100%", x2: "0%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#FFFFFF", stopOpacity: 0.2 }), _jsx("stop", { offset: "90%", stopColor: "#FFFFFF", stopOpacity: 0 })] }));
    return defs;
};
const createCylinderElements = (index, cylinderPos, cylinderRx, cylinderRy) => {
    const { x, topY, bottomY } = cylinderPos;
    const elements = [];
    elements.push(_jsx("ellipse", { id: `cylinder-bottom-${index}`, cx: x, cy: bottomY, rx: cylinderRx, ry: cylinderRy, fill: `url(#bottomGradient${index})`, opacity: 0.7 }));
    elements.push(_jsx(Path, { id: `cylinder-body-${index}`, d: `
        M ${x - cylinderRx} ${topY}
        A ${cylinderRx} ${cylinderRy} 0 0 0 ${x} ${topY + cylinderRy}
        A ${cylinderRx} ${cylinderRy} 0 0 0 ${x + cylinderRx} ${topY}
        L ${x + cylinderRx} ${bottomY}
        A ${cylinderRx} ${cylinderRy} 0 0 1 ${x} ${bottomY + cylinderRy}
        A ${cylinderRx} ${cylinderRy} 0 0 1 ${x - cylinderRx} ${bottomY}
        Z
      `, fill: `url(#cylinderGradient${index})`, stroke: "none" }));
    elements.push(_jsx(Rect, { id: `cylinder-glow-${index}`, x: x - cylinderRx, y: topY - cylinderRy * 3, width: cylinderRx * 2, height: cylinderRy * 3, fill: `url(#glowGradient${index})` }));
    elements.push(_jsx("ellipse", { id: `cylinder-top-${index}`, cx: x, cy: topY, rx: cylinderRx, ry: cylinderRy, fill: `url(#topGradient${index})` }));
    const numberX = x - 10;
    const numberY = topY - 15;
    const scaleY = 0.6;
    const skewX = -0.6;
    const transformValue = `translate(${numberX}, ${numberY}) matrix(1, 0, ${skewX}, ${scaleY}, 0, 0)`;
    elements.push(_jsx(Text, { id: `cylinder-number-${index}`, width: 50, height: 50, fontFamily: "Arial Black, sans-serif", fontSize: 32, fontWeight: 900, fill: `url(#numberGradient${index})`, alignHorizontal: "center", alignVertical: "middle", transform: transformValue, children: index + 1 }));
    return elements;
};
const createDecorationElements = (index, lineStartX, lineEndX, lineY, color) => {
    const dotRadius = 2;
    const elements = [];
    elements.push(_jsx("circle", { id: `decoration-dot-start-${index}`, cx: lineStartX, cy: lineY, r: dotRadius, fill: color }));
    elements.push(_jsx("line", { id: `decoration-line-${index}`, x1: lineStartX, y1: lineY, x2: lineEndX, y2: lineY, stroke: color, strokeWidth: 1, opacity: 0.8 }));
    elements.push(_jsx("circle", { id: `decoration-dot-end-${index}`, cx: lineEndX, cy: lineY, r: dotRadius, fill: color, opacity: 0.9 }));
    return elements;
};
const createBasePlate = (itemsCount, cylinderRx, cylinderAreaStartX, startY, planeStepY) => {
    if (itemsCount === 0)
        return null;
    const positions = [];
    for (let index = 0; index < itemsCount; index++) {
        const isLeft = index % 2 === 0;
        const pairIndex = Math.floor(index / 2);
        const depthOffset = calculateDepthOffset(pairIndex, cylinderRx);
        const lateralOffset = calculateLateralOffset(isLeft, pairIndex, cylinderRx);
        const x = cylinderAreaStartX + lateralOffset + depthOffset;
        const bottomY = startY - index * planeStepY;
        positions.push({ x, y: bottomY });
    }
    const leftmostPos = positions[0];
    const rightmostPos = positions[positions.length - 1];
    // 底板的厚度
    const plateThickness = 6;
    const plateMargin = itemsCount > 5 ? itemsCount * 16 : 100;
    const frontLeftX = leftmostPos.x - cylinderRx - plateMargin;
    const frontRightX = leftmostPos.x + cylinderRx + plateMargin;
    const frontY = leftmostPos.y + plateThickness + plateMargin / 6;
    const backLeftX = rightmostPos.x - cylinderRx - plateMargin;
    const backRightX = rightmostPos.x + cylinderRx + plateMargin;
    const backY = rightmostPos.y + plateThickness - plateMargin / 6;
    const platePath = `
    M ${frontLeftX} ${frontY}
    L ${frontRightX} ${frontY}
    L ${backRightX} ${backY}
    L ${backLeftX} ${backY}
    Z
  `;
    const sidePath = `
    M ${frontRightX} ${frontY}
    L ${frontRightX} ${frontY + plateThickness}
    L ${backRightX} ${backY + plateThickness}
    L ${backRightX} ${backY}
    Z
  `;
    const frontPath = `
    M ${frontLeftX} ${frontY}
    L ${frontRightX} ${frontY}
    L ${frontRightX} ${frontY + plateThickness}
    L ${frontLeftX} ${frontY + plateThickness}
    Z
  `;
    const plateGradients = (_jsxs(_Fragment, { children: [_jsxs("linearGradient", { id: "basePlateTopGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#fafafa", stopOpacity: 1 }), _jsx("stop", { offset: "50%", stopColor: "#ffffff", stopOpacity: 0.98 }), _jsx("stop", { offset: "100%", stopColor: "#ececec", stopOpacity: 0.95 })] }), _jsxs("linearGradient", { id: "basePlateFrontGradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#e0e0e0", stopOpacity: 0.95 }), _jsx("stop", { offset: "50%", stopColor: "#d2d2d2", stopOpacity: 0.93 }), _jsx("stop", { offset: "100%", stopColor: "#c5c5c5", stopOpacity: 0.9 })] }), _jsxs("linearGradient", { id: "basePlateSideGradient", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "#b8b8b8", stopOpacity: 0.92 }), _jsx("stop", { offset: "50%", stopColor: "#c0c0c0", stopOpacity: 0.88 }), _jsx("stop", { offset: "100%", stopColor: "#adadad", stopOpacity: 0.85 })] })] }));
    return (_jsxs(Group, { children: [_jsx(Defs, { children: plateGradients }), _jsx(Path, { id: "base-plate-front", d: frontPath, fill: "url(#basePlateFrontGradient)", stroke: "#c5c5c5", strokeWidth: 0.3, opacity: 0.92 }), _jsx(Path, { id: "base-plate-side", d: sidePath, fill: "url(#basePlateSideGradient)", stroke: "#aaaaaa", strokeWidth: 0.3, opacity: 0.88 }), _jsx(Path, { id: "base-plate-top", d: platePath, fill: "url(#basePlateTopGradient)", stroke: "#e5e5e5", strokeWidth: 0.5, opacity: 0.93 })] }));
};
export const sequenceCylinders3d = (props) => {
    const { Title, Item, data, options, cylinderRx = 28, cylinderRy = 18, baseHeight = 120, heightIncrement = 40, depthSpacing = 60, itemVerticalAlign = 'top', itemVerticalOffset = -12, firstDecorationWidth = 90, } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    const itemBounds = getElementBounds(_jsx(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
    const btnBounds = getElementBounds(_jsx(BtnAdd, { indexes: [0] }));
    const colorPrimary = getColorPrimary(options);
    const gapFromCylinder = 10;
    const planeStepY = Math.max(6, depthSpacing * 0.15);
    const layoutMetrics = calculateLayoutMetrics(items.length, itemBounds, cylinderRx, baseHeight, heightIncrement, depthSpacing, firstDecorationWidth, gapFromCylinder);
    const { startY, leftItemAlignedX, rightItemAlignedX, cylinderAreaStartX } = layoutMetrics;
    const defsElements = [];
    const perItemGroups = [];
    items.forEach((item, index) => {
        const color = getPaletteColor(options, [index]) || colorPrimary;
        defsElements.push(...createGradientDefs(index, color));
        const cylinderPos = calculateCylinderPosition(index, cylinderRx, baseHeight, heightIncrement, planeStepY, startY, cylinderAreaStartX);
        const cylinderNodes = createCylinderElements(index, cylinderPos, cylinderRx, cylinderRy);
        const { itemPos, lineStartX, lineEndX, lineY } = calculateItemPosition(index, cylinderPos, itemBounds, cylinderRx, leftItemAlignedX, rightItemAlignedX, itemVerticalAlign, itemVerticalOffset, gapFromCylinder);
        const decorationNodes = createDecorationElements(index, lineStartX, lineEndX, lineY, color);
        cylinderNodes.push(...decorationNodes);
        const itemNode = (_jsx(Item, { indexes: [index], datum: item, data: data, x: itemPos.x, y: itemPos.y, positionH: index % 2 === 0 ? 'flipped' : 'normal' }));
        const btnNodes = [
            _jsx(BtnRemove, { indexes: [index], x: itemPos.x + itemBounds.width / 2 - btnBounds.width / 2, y: itemPos.y + itemBounds.height + 10 }),
            _jsx(BtnAdd, { indexes: [index], x: itemPos.x + itemBounds.width / 2 - btnBounds.width / 2, y: itemPos.y - btnBounds.height - 10 }),
        ];
        perItemGroups[index] = {
            cylinderNodes,
            itemNode,
            btnNodes,
            itemX: itemPos.x,
            itemY: itemPos.y,
        };
    });
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    perItemGroups.forEach((group) => {
        const { itemX, itemY } = group;
        minX = Math.min(minX, itemX);
        minY = Math.min(minY, itemY);
        maxX = Math.max(maxX, itemX + itemBounds.width);
        maxY = Math.max(maxY, itemY + itemBounds.height);
    });
    const itemsBoundsWidth = maxX - minX;
    const itemsBoundsHeight = maxY - minY;
    const itemElements = [_jsx(Defs, { children: defsElements })];
    const btnElements = [];
    // 添加底板
    const basePlate = createBasePlate(items.length, cylinderRx, cylinderAreaStartX, startY, planeStepY);
    if (basePlate) {
        itemElements.push(basePlate);
    }
    for (let i = items.length - 1; i >= 0; i--) {
        const g = perItemGroups[i];
        if (!g)
            continue;
        itemElements.push(_jsxs(Group, { children: [_jsx(Group, { children: g.cylinderNodes }), g.itemNode] }));
        btnElements.push(...g.btnNodes);
    }
    if (items.length > 0) {
        const isNextLeft = items.length % 2 === 0;
        const nextPairIndex = Math.floor(items.length / 2);
        const nextDepthOffset = calculateDepthOffset(nextPairIndex, cylinderRx);
        const nextLateralOffset = calculateLateralOffset(isNextLeft, nextPairIndex, cylinderRx);
        const nextX = cylinderAreaStartX + nextLateralOffset + nextDepthOffset;
        const nextY = startY - items.length * planeStepY;
        btnElements.push(_jsx(BtnAdd, { indexes: [items.length], x: nextX, y: nextY - 100 }));
    }
    return (_jsxs(FlexLayout, { flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { width: itemsBoundsWidth, height: itemsBoundsHeight, children: [_jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('sequence-cylinders-3d', {
    component: sequenceCylinders3d,
    composites: ['title', 'item'],
});
