import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { getElementBounds, Group } from '../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components/index.js';
import { SimpleArrow } from '../decorations/index.js';
import { FlexLayout } from '../layouts/index.js';
import { getColorPrimary } from '../utils/index.js';
import { registerStructure } from './registry.js';
export const SequenceSteps = (props) => {
    const { Title, Item, data, gap = 40, options } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    const colorPrimary = getColorPrimary(options);
    const btnBounds = getElementBounds(_jsx(BtnAdd, { indexes: [0] }));
    const itemBounds = getElementBounds(_jsx(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
    const btnElements = [];
    const itemElements = [];
    const decorElements = [];
    const arrowWidth = 25;
    const arrowHeight = 25;
    const topMargin = Math.max(btnBounds.height + 20, 30);
    items.forEach((item, index) => {
        const itemX = index * (itemBounds.width + gap);
        const indexes = [index];
        itemElements.push(_jsx(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: topMargin, positionH: "center" }));
        btnElements.push(_jsx(BtnRemove, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: topMargin + itemBounds.height + 10 }));
        if (index === 0) {
            btnElements.push(_jsx(BtnAdd, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: topMargin - btnBounds.height - 10 }));
        }
        else {
            btnElements.push(_jsx(BtnAdd, { indexes: indexes, x: itemX - gap / 2 - btnBounds.width / 2, y: topMargin - btnBounds.height - 10 }));
        }
        if (index < items.length - 1) {
            const arrowX = itemX + itemBounds.width + (gap - arrowWidth) / 2;
            const arrowY = topMargin + itemBounds.height / 2 - arrowHeight / 2;
            decorElements.push(_jsx(SimpleArrow, { x: arrowX, y: arrowY, width: arrowWidth, height: arrowHeight, colorPrimary: colorPrimary }));
        }
    });
    if (items.length > 0) {
        const lastItemX = (items.length - 1) * (itemBounds.width + gap);
        btnElements.push(_jsx(BtnAdd, { indexes: [items.length], x: lastItemX + itemBounds.width + (gap - btnBounds.width) / 2, y: topMargin - btnBounds.height - 10 }));
    }
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { children: [_jsx(Group, { children: decorElements }), _jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('sequence-steps', {
    component: SequenceSteps,
    composites: ['title', 'item'],
});
