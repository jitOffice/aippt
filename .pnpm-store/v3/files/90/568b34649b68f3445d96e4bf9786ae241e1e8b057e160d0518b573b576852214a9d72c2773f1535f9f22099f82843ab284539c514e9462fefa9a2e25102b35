"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListWaterfall = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const registry_1 = require("./registry");
const ListWaterfall = (props) => {
    const { Title, Item, data, columns = 4, gap = 20, stepOffset = 40 } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
    const btnElements = [];
    const itemElements = [];
    const colWidth = itemBounds.width + gap;
    items.forEach((item, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        const itemX = col * colWidth;
        const baseY = row * (itemBounds.height + gap);
        const columnStepOffset = col * stepOffset;
        const itemY = baseY + columnStepOffset;
        const indexes = [index];
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: itemY, positionH: "center" }));
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: itemY + itemBounds.height + 5 }));
    });
    items.forEach((item, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        const itemX = col * colWidth;
        const baseY = row * (itemBounds.height + gap);
        const columnStepOffset = col * stepOffset;
        const itemY = baseY + columnStepOffset;
        if (index === 0) {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0], x: itemX - gap / 2 - btnBounds.width / 2, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
        }
        if (col < columns - 1 && index < items.length - 1) {
            const nextRow = Math.floor((index + 1) / columns);
            if (row === nextRow) {
                btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [index + 1], x: itemX + itemBounds.width + (gap - btnBounds.width) / 2, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
            }
        }
        if (col === columns - 1 || index === items.length - 1) {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [index + 1], x: itemX + itemBounds.width + (gap - btnBounds.width) / 2, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
        }
    });
    if (items.length === 0) {
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0], x: ((columns - 1) * colWidth) / 2 +
                (itemBounds.width - btnBounds.width) / 2, y: 0 }));
    }
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.ListWaterfall = ListWaterfall;
(0, registry_1.registerStructure)('list-waterfall', {
    component: exports.ListWaterfall,
    composites: ['title', 'item'],
});
