"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListGrid = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const registry_1 = require("./registry");
const ListGrid = (props) => {
    const { Title, Item, data, columns = 3, gap = 24, zigzag } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
    const btnElements = [];
    const itemElements = [];
    const rowHeight = itemBounds.height + gap;
    const colWidth = itemBounds.width + gap;
    // Track processed rows for left/right buttons
    const processedRows = new Set();
    items.forEach((item, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        const itemX = col * colWidth;
        const itemY = row * rowHeight;
        const indexes = [index];
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: itemY, positionH: "center", positionV: zigzag && index % 2 === 0 ? 'normal' : 'flipped' }));
        // Remove button - positioned below item
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: itemY + itemBounds.height }));
        // Add horizontal buttons between items (vertically centered with items)
        if (col < columns - 1) {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [index + 1], x: itemX + itemBounds.width + (gap - btnBounds.width) / 2, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
        }
        // Add button at the left side of first item in each row
        if (col === 0 && !processedRows.has(row)) {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [index], x: itemX - gap / 2 - btnBounds.width / 2, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
            processedRows.add(row);
        }
        // Add button at the right side of last item in each row
        const isLastInRow = col === columns - 1 || index === items.length - 1;
        if (isLastInRow) {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [index + 1], x: itemX + itemBounds.width + gap / 2 - btnBounds.width / 2, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
        }
    });
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.ListGrid = ListGrid;
(0, registry_1.registerStructure)('list-grid', {
    component: exports.ListGrid,
    composites: ['title', 'item'],
});
