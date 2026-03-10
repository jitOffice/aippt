"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceAscendingSteps = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const registry_1 = require("./registry");
const SequenceAscendingSteps = (props) => {
    const { Title, Item, data, hGap = 0, vGap = 0 } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: items[0] }));
    const itemElements = [];
    const btnElements = [];
    const n = items.length;
    const stepX = itemBounds.width + hGap;
    const stepY = itemBounds.height / 2 + vGap;
    const startX = itemBounds.width / 2;
    const endY = 0;
    const startY = endY + (n - 1) * stepY;
    items.forEach((datum, index) => {
        const x = startX + index * stepX;
        const y = startY - index * stepY;
        const indexes = [index];
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: datum, data: data, x: x, y: y }));
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: indexes, x: x + itemBounds.width - 30, y: y + itemBounds.height / 2 + 10 }));
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: indexes, x: x + itemBounds.width + hGap / 2, y: y - 30 }));
    });
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.SequenceAscendingSteps = SequenceAscendingSteps;
(0, registry_1.registerStructure)('sequence-ascending-steps', {
    component: exports.SequenceAscendingSteps,
    composites: ['title', 'item'],
});
