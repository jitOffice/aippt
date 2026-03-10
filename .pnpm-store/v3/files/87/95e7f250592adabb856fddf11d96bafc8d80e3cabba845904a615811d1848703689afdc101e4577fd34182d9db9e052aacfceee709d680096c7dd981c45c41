import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { getElementBounds, Group } from '../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { registerStructure } from './registry.js';
export const ListWaterfall = (props) => {
    const { Title, Item, data, columns = 4, gap = 20, stepOffset = 40 } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    const btnBounds = getElementBounds(_jsx(BtnAdd, { indexes: [0] }));
    const itemBounds = getElementBounds(_jsx(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
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
        itemElements.push(_jsx(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: itemY, positionH: "center" }));
        btnElements.push(_jsx(BtnRemove, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: itemY + itemBounds.height + 5 }));
    });
    items.forEach((item, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        const itemX = col * colWidth;
        const baseY = row * (itemBounds.height + gap);
        const columnStepOffset = col * stepOffset;
        const itemY = baseY + columnStepOffset;
        if (index === 0) {
            btnElements.push(_jsx(BtnAdd, { indexes: [0], x: itemX - gap / 2 - btnBounds.width / 2, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
        }
        if (col < columns - 1 && index < items.length - 1) {
            const nextRow = Math.floor((index + 1) / columns);
            if (row === nextRow) {
                btnElements.push(_jsx(BtnAdd, { indexes: [index + 1], x: itemX + itemBounds.width + (gap - btnBounds.width) / 2, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
            }
        }
        if (col === columns - 1 || index === items.length - 1) {
            btnElements.push(_jsx(BtnAdd, { indexes: [index + 1], x: itemX + itemBounds.width + (gap - btnBounds.width) / 2, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
        }
    });
    if (items.length === 0) {
        btnElements.push(_jsx(BtnAdd, { indexes: [0], x: ((columns - 1) * colWidth) / 2 +
                (itemBounds.width - btnBounds.width) / 2, y: 0 }));
    }
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { children: [_jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('list-waterfall', {
    component: ListWaterfall,
    composites: ['title', 'item'],
});
