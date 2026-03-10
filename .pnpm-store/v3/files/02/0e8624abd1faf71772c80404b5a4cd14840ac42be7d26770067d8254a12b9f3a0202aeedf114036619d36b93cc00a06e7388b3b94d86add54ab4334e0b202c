import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { getElementBounds, Group } from '../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { registerStructure } from './registry.js';
export const ListGrid = (props) => {
    const { Title, Item, data, columns = 3, gap = 24, zigzag } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    const btnBounds = getElementBounds(_jsx(BtnAdd, { indexes: [0] }));
    const itemBounds = getElementBounds(_jsx(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
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
        itemElements.push(_jsx(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: itemY, positionH: "center", positionV: zigzag && index % 2 === 0 ? 'normal' : 'flipped' }));
        // Remove button - positioned below item
        btnElements.push(_jsx(BtnRemove, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: itemY + itemBounds.height }));
        // Add horizontal buttons between items (vertically centered with items)
        if (col < columns - 1) {
            btnElements.push(_jsx(BtnAdd, { indexes: [index + 1], x: itemX + itemBounds.width + (gap - btnBounds.width) / 2, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
        }
        // Add button at the left side of first item in each row
        if (col === 0 && !processedRows.has(row)) {
            btnElements.push(_jsx(BtnAdd, { indexes: [index], x: itemX - gap / 2 - btnBounds.width / 2, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
            processedRows.add(row);
        }
        // Add button at the right side of last item in each row
        const isLastInRow = col === columns - 1 || index === items.length - 1;
        if (isLastInRow) {
            btnElements.push(_jsx(BtnAdd, { indexes: [index + 1], x: itemX + itemBounds.width + gap / 2 - btnBounds.width / 2, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
        }
    });
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { children: [_jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('list-grid', {
    component: ListGrid,
    composites: ['title', 'item'],
});
