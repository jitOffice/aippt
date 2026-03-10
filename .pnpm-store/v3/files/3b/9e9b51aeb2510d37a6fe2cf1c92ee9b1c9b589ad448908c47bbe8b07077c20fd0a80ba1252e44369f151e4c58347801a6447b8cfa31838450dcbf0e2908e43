"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListColumn = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const registry_1 = require("./registry");
const ListColumn = (props) => {
    const { Title, Item, data, gap = 20, width: contentWidth, zigzag } = props;
    const { title, desc, items = [] } = data;
    const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: items[0] }));
    const width = contentWidth || itemBounds.width;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const btnElements = [];
    const itemElements = [];
    const btnAddX = (width - btnBounds.width) / 2;
    items.forEach((item, index) => {
        const itemY = (itemBounds.height + gap) * index;
        const indexes = [index];
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, y: itemY, width: width, positionV: "middle", positionH: zigzag ? (index % 2 === 0 ? 'normal' : 'flipped') : 'normal' }));
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: indexes, x: -btnBounds.width - 10, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
        const btnAddY = index === 0 ? -btnBounds.height : itemY - gap / 2 - btnBounds.height / 2;
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: indexes, x: btnAddX, y: btnAddY }));
    });
    if (items.length > 0) {
        const lastItemY = (itemBounds.height + gap) * (items.length - 1);
        const extraAddBtnY = lastItemY + itemBounds.height;
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [items.length], x: btnAddX, y: extraAddBtnY }));
    }
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.ListColumn = ListColumn;
(0, registry_1.registerStructure)('list-column', {
    component: exports.ListColumn,
    composites: ['title', 'item'],
});
