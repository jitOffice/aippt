"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPyramid = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const registry_1 = require("./registry");
const ListPyramid = (props) => {
    const { Title, Item, data, gap = 20, levelGap = 20 } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
    const btnElements = [];
    const itemElements = [];
    const levels = Math.ceil(Math.sqrt(items.length));
    const levelSizes = [];
    let remainingItems = items.length;
    for (let level = 0; level < levels; level++) {
        const itemsInLevel = Math.min(level + 1, remainingItems);
        levelSizes.push(itemsInLevel);
        remainingItems -= itemsInLevel;
        if (remainingItems <= 0)
            break;
    }
    let itemIndex = 0;
    const maxLevelSize = Math.max(...levelSizes);
    const maxLevelWidth = maxLevelSize * itemBounds.width + (maxLevelSize - 1) * gap;
    const baseOffset = maxLevelWidth / 2;
    levelSizes.forEach((levelSize, level) => {
        const levelY = level * (itemBounds.height + levelGap);
        const totalLevelWidth = levelSize * itemBounds.width + (levelSize - 1) * gap;
        const startX = baseOffset - totalLevelWidth / 2;
        for (let i = 0; i < levelSize && itemIndex < items.length; i++) {
            const itemX = startX + i * (itemBounds.width + gap);
            const item = items[itemIndex];
            const indexes = [itemIndex];
            itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: levelY, positionH: "center" }));
            // Remove button - positioned below item
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: levelY + itemBounds.height }));
            // Add horizontal buttons between items (vertically centered with items)
            if (i < levelSize - 1) {
                btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [itemIndex + 1], x: itemX + itemBounds.width + (gap - btnBounds.width) / 2, y: levelY + (itemBounds.height - btnBounds.height) / 2 }));
            }
            // Add button at the left side of first item in each level
            if (i === 0) {
                btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [itemIndex], x: itemX - gap / 2 - btnBounds.width / 2, y: levelY + (itemBounds.height - btnBounds.height) / 2 }));
            }
            // Add button at the right side of last item in each level
            if (i === levelSize - 1) {
                btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [itemIndex + 1], x: itemX + itemBounds.width + gap / 2 - btnBounds.width / 2, y: levelY + (itemBounds.height - btnBounds.height) / 2 }));
            }
            itemIndex++;
        }
    });
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.ListPyramid = ListPyramid;
(0, registry_1.registerStructure)('list-pyramid', {
    component: exports.ListPyramid,
    composites: ['title', 'item'],
});
