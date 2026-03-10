"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceTimeline = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const SequenceTimeline = (props) => {
    const { Title, Item, data, gap = 10, showStepLabels = true, options } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const colorPrimary = (0, utils_1.getColorPrimary)(options);
    const palette = (0, utils_1.getPaletteColors)(options);
    const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: items[0], positionH: "normal" }));
    const btnElements = [];
    const itemElements = [];
    const decorElements = [];
    const stepLabelX = 10;
    const timelineX = stepLabelX + 70 + 10;
    const itemX = timelineX + 30;
    const nodeRadius = 6;
    // Add continuous timeline line first (so it appears behind the dots)
    if (items.length > 1) {
        const firstNodeY = itemBounds.height / 2 + nodeRadius;
        const lastNodeY = (items.length - 1) * (itemBounds.height + gap) +
            itemBounds.height / 2 -
            nodeRadius;
        const continuousLinePath = `M ${timelineX} ${firstNodeY} L ${timelineX} ${lastNodeY}`;
        const linearGradientId = 'gradient-timeline-line';
        const totalHeight = lastNodeY - firstNodeY;
        // Generate gradient stops for each item
        const gradientStops = items.map((_, index) => {
            const nodeY = index * (itemBounds.height + gap) + itemBounds.height / 2;
            const offset = ((nodeY - firstNodeY) / totalHeight) * 100;
            const color = (0, utils_1.getPaletteColor)(options, [index]);
            return (0, jsx_runtime_1.jsx)("stop", { offset: `${offset}%`, stopColor: color || colorPrimary });
        });
        decorElements.push((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: (0, jsx_runtime_1.jsx)("linearGradient", { id: linearGradientId, x1: timelineX, y1: firstNodeY, x2: timelineX, y2: lastNodeY, gradientUnits: "userSpaceOnUse", children: gradientStops }) }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: continuousLinePath, stroke: `url(#${linearGradientId})`, strokeWidth: 2, width: 1, height: lastNodeY - firstNodeY })] }));
    }
    items.forEach((item, index) => {
        const itemY = index * (itemBounds.height + gap);
        const nodeY = itemY + itemBounds.height / 2;
        const indexes = [index];
        if (showStepLabels) {
            decorElements.push((0, jsx_runtime_1.jsx)(jsx_1.Text, { x: stepLabelX, y: nodeY, width: 70, fontSize: 18, fontWeight: "bold", alignHorizontal: "left", alignVertical: "middle", fill: palette[index % palette.length], children: `STEP ${index + 1}` }));
        }
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: itemY, positionH: "normal" }));
        decorElements.push((0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: timelineX - nodeRadius, y: nodeY - nodeRadius, width: nodeRadius * 2, height: nodeRadius * 2, fill: palette[index % palette.length] }));
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: indexes, x: itemX - btnBounds.width - 10, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
        if (index === 0) {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: itemY - btnBounds.height - 10 }));
        }
        else {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: itemY - gap / 2 - btnBounds.height / 2 }));
        }
    });
    if (items.length > 0) {
        const lastItemY = (items.length - 1) * (itemBounds.height + gap);
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [items.length], x: itemX + (itemBounds.width - btnBounds.width) / 2, y: lastItemY + itemBounds.height + 10 }));
    }
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.ShapesGroup, { children: decorElements }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.SequenceTimeline = SequenceTimeline;
(0, registry_1.registerStructure)('sequence-timeline', {
    component: exports.SequenceTimeline,
    composites: ['title', 'item'],
});
