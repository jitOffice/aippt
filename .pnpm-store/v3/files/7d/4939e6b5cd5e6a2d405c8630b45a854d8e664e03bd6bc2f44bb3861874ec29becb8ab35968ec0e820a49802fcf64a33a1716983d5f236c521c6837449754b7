import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { getElementBounds, Group } from '../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { registerStructure } from './registry.js';
export const SequenceAscendingSteps = (props) => {
    const { Title, Item, data, hGap = 0, vGap = 0 } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    const itemBounds = getElementBounds(_jsx(Item, { indexes: [0], data: data, datum: items[0] }));
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
        itemElements.push(_jsx(Item, { indexes: indexes, datum: datum, data: data, x: x, y: y }));
        btnElements.push(_jsx(BtnRemove, { indexes: indexes, x: x + itemBounds.width - 30, y: y + itemBounds.height / 2 + 10 }));
        btnElements.push(_jsx(BtnAdd, { indexes: indexes, x: x + itemBounds.width + hGap / 2, y: y - 30 }));
    });
    return (_jsxs(FlexLayout, { flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { children: [_jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('sequence-ascending-steps', {
    component: SequenceAscendingSteps,
    composites: ['title', 'item'],
});
