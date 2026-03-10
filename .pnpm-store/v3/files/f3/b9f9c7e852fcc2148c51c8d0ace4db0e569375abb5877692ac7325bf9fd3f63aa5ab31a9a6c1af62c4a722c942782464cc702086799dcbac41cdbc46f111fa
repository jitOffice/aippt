"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceSteps = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const decorations_1 = require("../decorations");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const SequenceSteps = (props) => {
    const { Title, Item, data, gap = 40, options } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const colorPrimary = (0, utils_1.getColorPrimary)(options);
    const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
    const btnElements = [];
    const itemElements = [];
    const decorElements = [];
    const arrowWidth = 25;
    const arrowHeight = 25;
    const topMargin = Math.max(btnBounds.height + 20, 30);
    items.forEach((item, index) => {
        const itemX = index * (itemBounds.width + gap);
        const indexes = [index];
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: topMargin, positionH: "center" }));
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: topMargin + itemBounds.height + 10 }));
        if (index === 0) {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: topMargin - btnBounds.height - 10 }));
        }
        else {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: indexes, x: itemX - gap / 2 - btnBounds.width / 2, y: topMargin - btnBounds.height - 10 }));
        }
        if (index < items.length - 1) {
            const arrowX = itemX + itemBounds.width + (gap - arrowWidth) / 2;
            const arrowY = topMargin + itemBounds.height / 2 - arrowHeight / 2;
            decorElements.push((0, jsx_runtime_1.jsx)(decorations_1.SimpleArrow, { x: arrowX, y: arrowY, width: arrowWidth, height: arrowHeight, colorPrimary: colorPrimary }));
        }
    });
    if (items.length > 0) {
        const lastItemX = (items.length - 1) * (itemBounds.width + gap);
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [items.length], x: lastItemX + itemBounds.width + (gap - btnBounds.width) / 2, y: topMargin - btnBounds.height - 10 }));
    }
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Group, { children: decorElements }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.SequenceSteps = SequenceSteps;
(0, registry_1.registerStructure)('sequence-steps', {
    component: exports.SequenceSteps,
    composites: ['title', 'item'],
});
