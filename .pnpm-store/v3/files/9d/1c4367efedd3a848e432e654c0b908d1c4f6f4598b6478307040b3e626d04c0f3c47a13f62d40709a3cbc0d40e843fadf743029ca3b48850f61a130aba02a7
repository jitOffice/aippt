import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { getElementBounds, Group } from '../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { registerStructure } from './registry.js';
export const ListColumn = (props) => {
    const { Title, Item, data, gap = 20, width: contentWidth, zigzag } = props;
    const { title, desc, items = [] } = data;
    const btnBounds = getElementBounds(_jsx(BtnAdd, { indexes: [0] }));
    const itemBounds = getElementBounds(_jsx(Item, { indexes: [0], data: data, datum: items[0] }));
    const width = contentWidth || itemBounds.width;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    const btnElements = [];
    const itemElements = [];
    const btnAddX = (width - btnBounds.width) / 2;
    items.forEach((item, index) => {
        const itemY = (itemBounds.height + gap) * index;
        const indexes = [index];
        itemElements.push(_jsx(Item, { indexes: indexes, datum: item, data: data, y: itemY, width: width, positionV: "middle", positionH: zigzag ? (index % 2 === 0 ? 'normal' : 'flipped') : 'normal' }));
        btnElements.push(_jsx(BtnRemove, { indexes: indexes, x: -btnBounds.width - 10, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
        const btnAddY = index === 0 ? -btnBounds.height : itemY - gap / 2 - btnBounds.height / 2;
        btnElements.push(_jsx(BtnAdd, { indexes: indexes, x: btnAddX, y: btnAddY }));
    });
    if (items.length > 0) {
        const lastItemY = (itemBounds.height + gap) * (items.length - 1);
        const extraAddBtnY = lastItemY + itemBounds.height;
        btnElements.push(_jsx(BtnAdd, { indexes: [items.length], x: btnAddX, y: extraAddBtnY }));
    }
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { children: [_jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('list-column', {
    component: ListColumn,
    composites: ['title', 'item'],
});
