"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListRow = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const registry_1 = require("./registry");
const ListRow = (props) => {
    const { Title, Item, data, gap = 20, zigzag } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
    const btnElements = [];
    const itemElements = [];
    const btnAddY = (itemBounds.height - btnBounds.height) / 2;
    const btnRemoveY = itemBounds.height;
    items.forEach((item, index) => {
        const itemX = (itemBounds.width + gap) * index;
        const indexes = [index];
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: itemX, positionH: "center", positionV: zigzag && index % 2 === 0 ? 'normal' : 'flipped' }));
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: btnRemoveY }));
        const btnAddX = index === 0
            ? -(gap + btnBounds.width) / 2
            : itemX - (gap + btnBounds.width) / 2;
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: indexes, x: btnAddX, y: btnAddY }));
    });
    if (items.length > 0) {
        const lastItemX = (itemBounds.width + gap) * (items.length - 1);
        const extraAddBtnX = lastItemX + itemBounds.width + (gap - btnBounds.width) / 2;
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [items.length], x: extraAddBtnX, y: btnAddY }));
    }
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.ListRow = ListRow;
(0, registry_1.registerStructure)('list-row', {
    component: exports.ListRow,
    composites: ['title', 'item'],
});
