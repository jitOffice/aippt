import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { getElementBounds, Group } from '../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { registerStructure } from './registry.js';
export const ListRow = (props) => {
    const { Title, Item, data, gap = 20, zigzag } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    const btnBounds = getElementBounds(_jsx(BtnAdd, { indexes: [0] }));
    const itemBounds = getElementBounds(_jsx(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
    const btnElements = [];
    const itemElements = [];
    const btnAddY = (itemBounds.height - btnBounds.height) / 2;
    const btnRemoveY = itemBounds.height;
    items.forEach((item, index) => {
        const itemX = (itemBounds.width + gap) * index;
        const indexes = [index];
        itemElements.push(_jsx(Item, { indexes: indexes, datum: item, data: data, x: itemX, positionH: "center", positionV: zigzag && index % 2 === 0 ? 'normal' : 'flipped' }));
        btnElements.push(_jsx(BtnRemove, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: btnRemoveY }));
        const btnAddX = index === 0
            ? -(gap + btnBounds.width) / 2
            : itemX - (gap + btnBounds.width) / 2;
        btnElements.push(_jsx(BtnAdd, { indexes: indexes, x: btnAddX, y: btnAddY }));
    });
    if (items.length > 0) {
        const lastItemX = (itemBounds.width + gap) * (items.length - 1);
        const extraAddBtnX = lastItemX + itemBounds.width + (gap - btnBounds.width) / 2;
        btnElements.push(_jsx(BtnAdd, { indexes: [items.length], x: extraAddBtnX, y: btnAddY }));
    }
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { children: [_jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('list-row', {
    component: ListRow,
    composites: ['title', 'item'],
});
