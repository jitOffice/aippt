"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceStairsFront = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const SequenceStairsFront = (props) => {
    const { Title, Item, data, options, gap = 16, perspectiveFactor = 0.2, width = 720, } = props;
    const { title, desc, items = [] } = data;
    const TitleComponent = Title;
    const titleContent = TitleComponent ? ((0, jsx_runtime_1.jsx)(TitleComponent, { title: title, desc: desc })) : null;
    if (items.length === 0) {
        const btnAddElement = (0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0], x: 0, y: 0 });
        return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnAddElement }) })] }));
    }
    const colorPrimary = (0, utils_1.getColorPrimary)(options);
    const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: items[0] || {}, positionH: "center" }));
    const connectorGap = 12;
    const baseConnectorWidth = Math.min(width * 0.1, 100);
    const bottomStepWidth = Math.min(width * 0.45, Math.max(80, width - itemBounds.width - connectorGap - baseConnectorWidth));
    const baseDepth = Math.max(24, bottomStepWidth * perspectiveFactor * 0.35);
    const baseStepHeight = 56;
    const minStepHeight = baseStepHeight * 0.7;
    const heightStep = items.length > 1
        ? (baseStepHeight - minStepHeight) / (items.length - 1)
        : 0;
    const topMargin = Math.max(btnBounds.height + baseDepth + 20, baseDepth + 28);
    const centerX = bottomStepWidth / 2;
    const itemX = bottomStepWidth + baseConnectorWidth + connectorGap;
    const stepHeights = items.map((_, index) => baseStepHeight - heightStep * index);
    const stepDepths = items.map((_, index) => Math.max(baseDepth * (1 - index * 0.05), baseDepth * 0.7));
    const stepYs = [];
    const depthFromTop = [];
    const lastIndex = items.length - 1;
    stepYs[lastIndex] = topMargin;
    depthFromTop[lastIndex] = 0;
    for (let i = lastIndex - 1; i >= 0; i -= 1) {
        depthFromTop[i] = depthFromTop[i + 1] + stepDepths[i] + gap;
        stepYs[i] = stepYs[i + 1] + stepDepths[i] + stepHeights[i + 1] + gap;
    }
    const totalDepthSpan = depthFromTop[0] || stepDepths[0] || baseDepth;
    const minStepWidth = bottomStepWidth * (0.55 + perspectiveFactor * 0.1);
    const widthShrink = bottomStepWidth - minStepWidth;
    const stepWidths = items.map((_, index) => {
        const ratio = totalDepthSpan === 0 ? 1 : depthFromTop[index] / totalDepthSpan;
        return minStepWidth + widthShrink * ratio;
    });
    const connectorWidths = stepWidths.map((stepWidth) => {
        const connectorStartX = centerX + stepWidth / 2;
        return Math.max(0, itemX - connectorGap - connectorStartX);
    });
    const stepElements = [];
    const itemElements = [];
    const btnElements = [];
    const connectorElements = [];
    const spineElements = [];
    const spineTop = 0;
    const spineBottom = (stepYs[0] || topMargin) + (stepHeights[0] || baseStepHeight);
    const arrowHeight = spineBottom - spineTop;
    const arrowHeadHeight = 35;
    const topStepWidth = stepWidths[lastIndex] || minStepWidth;
    const arrowTopWidth = topStepWidth * 0.8;
    const arrowNeckWidth = arrowTopWidth * 0.65;
    const arrowBottomWidth = (stepWidths[0] || bottomStepWidth) * 0.9;
    spineElements.push((0, jsx_runtime_1.jsx)(jsx_1.Polygon, { points: [
            { x: centerX, y: spineTop },
            { x: centerX + arrowTopWidth / 2, y: spineTop + arrowHeadHeight },
            { x: centerX + arrowNeckWidth / 2, y: spineTop + arrowHeadHeight },
            { x: centerX + arrowBottomWidth / 2, y: spineBottom },
            { x: centerX - arrowBottomWidth / 2, y: spineBottom },
            { x: centerX - arrowNeckWidth / 2, y: spineTop + arrowHeadHeight },
            { x: centerX - arrowTopWidth / 2, y: spineTop + arrowHeadHeight },
        ], fill: "rgba(0,0,0,0.12)", width: arrowBottomWidth, height: arrowHeight, "data-element-type": "shape" }));
    let previousCenterY = stepYs[lastIndex] + stepHeights[lastIndex] / 2;
    items.forEach((item, index) => {
        const indexes = [index];
        const stepWidth = stepWidths[index];
        const stepDepth = stepDepths[index];
        const stepX = centerX - stepWidth / 2;
        const stepHeight = stepHeights[index];
        const stepY = stepYs[index];
        const topY = stepY - stepDepth;
        const rectCenterY = stepY + stepHeight / 2;
        const stepColor = (0, utils_1.getPaletteColor)(options, indexes) || colorPrimary;
        stepElements.push((0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: stepX, y: stepY, width: stepWidth, height: stepHeight, fill: stepColor, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(jsx_1.Polygon, { points: [
                { x: stepX, y: stepY },
                { x: stepX + stepWidth, y: stepY },
                { x: stepX + stepWidth - stepDepth / 2, y: topY },
                { x: stepX + stepDepth / 2, y: topY },
            ], fill: stepColor, opacity: "0.3", width: stepWidth, height: stepDepth, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(jsx_1.Text, { x: stepX, y: stepY, width: stepWidth, height: stepHeight, fontSize: stepHeight / 2, fontWeight: "bold", alignHorizontal: "center", alignVertical: "middle", fill: "#ffffff", children: String(index + 1).padStart(2, '0') }));
        const connectorStartX = stepX + stepWidth;
        const connectorEndY = rectCenterY;
        const connectorWidth = connectorWidths[index];
        const lineEndX = connectorStartX + connectorWidth;
        connectorElements.push((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M ${connectorStartX} ${connectorEndY} L ${lineEndX} ${connectorEndY}`, stroke: stepColor, strokeWidth: 2, fill: "none", width: connectorWidth, height: 2, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M ${lineEndX} ${connectorEndY} L ${lineEndX} ${connectorEndY}`, stroke: stepColor, strokeWidth: 6, strokeLinecap: "round", width: 1, height: 1, "data-element-type": "shape" }));
        const itemY = rectCenterY - itemBounds.height / 2;
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: itemY, positionV: "middle" }));
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: indexes, x: itemX + itemBounds.width + 10, y: itemY + itemBounds.height / 2 - btnBounds.height / 2 }));
        if (index === 0) {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0], x: itemX + (itemBounds.width - btnBounds.width) / 2, y: itemY - btnBounds.height - 12 }));
        }
        else {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: (previousCenterY + rectCenterY) / 2 - btnBounds.height / 2 }));
        }
        previousCenterY = rectCenterY;
    });
    const lastCenterY = previousCenterY;
    const lastItemY = lastCenterY - itemBounds.height / 2;
    btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [items.length], x: itemX + (itemBounds.width - btnBounds.width) / 2, y: lastItemY + itemBounds.height + 12 }));
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Group, { children: spineElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: stepElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: connectorElements }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.SequenceStairsFront = SequenceStairsFront;
(0, registry_1.registerStructure)('sequence-stairs-front', {
    component: exports.SequenceStairsFront,
    composites: ['title', 'item'],
});
