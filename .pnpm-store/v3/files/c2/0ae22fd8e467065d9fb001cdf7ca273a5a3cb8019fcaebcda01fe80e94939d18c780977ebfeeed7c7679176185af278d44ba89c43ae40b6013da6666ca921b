import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { getElementBounds, Group } from '../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { registerStructure } from './registry.js';
export const ListPyramid = (props) => {
    const { Title, Item, data, gap = 20, levelGap = 20 } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    const btnBounds = getElementBounds(_jsx(BtnAdd, { indexes: [0] }));
    const itemBounds = getElementBounds(_jsx(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
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
            itemElements.push(_jsx(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: levelY, positionH: "center" }));
            // Remove button - positioned below item
            btnElements.push(_jsx(BtnRemove, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: levelY + itemBounds.height }));
            // Add horizontal buttons between items (vertically centered with items)
            if (i < levelSize - 1) {
                btnElements.push(_jsx(BtnAdd, { indexes: [itemIndex + 1], x: itemX + itemBounds.width + (gap - btnBounds.width) / 2, y: levelY + (itemBounds.height - btnBounds.height) / 2 }));
            }
            // Add button at the left side of first item in each level
            if (i === 0) {
                btnElements.push(_jsx(BtnAdd, { indexes: [itemIndex], x: itemX - gap / 2 - btnBounds.width / 2, y: levelY + (itemBounds.height - btnBounds.height) / 2 }));
            }
            // Add button at the right side of last item in each level
            if (i === levelSize - 1) {
                btnElements.push(_jsx(BtnAdd, { indexes: [itemIndex + 1], x: itemX + itemBounds.width + gap / 2 - btnBounds.width / 2, y: levelY + (itemBounds.height - btnBounds.height) / 2 }));
            }
            itemIndex++;
        }
    });
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { children: [_jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('list-pyramid', {
    component: ListPyramid,
    composites: ['title', 'item'],
});
