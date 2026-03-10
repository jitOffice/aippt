import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { getElementBounds, Group, Rect } from '../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { getPaletteColors } from '../utils/index.js';
import { registerStructure } from './registry.js';
/**
 * 横向层级对比结构
 * 第一级：横向排列的根节点
 * 第二级：每个根节点下的子节点列表
 */
export const CompareHierarchyRow = (props) => {
    var _a, _b;
    const { Title, Items, data, gap = 0, itemGap = 20, columnWidth = 280, itemPadding = 5, showColumnBackground = true, columnBackgroundAlpha = 0.08, options, } = props;
    const [RootItem, Item] = Items;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    const palette = getPaletteColors(options);
    const itemElements = [];
    const btnElements = [];
    const childItemWidth = columnWidth - itemPadding * 2;
    const rootItemBounds = getElementBounds(_jsx(RootItem, { indexes: [0], data: data, datum: items[0], width: columnWidth }));
    const childItemBounds = getElementBounds(_jsx(Item, { indexes: [0, 0], data: data, datum: ((_b = (_a = items[0]) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b[0]) || {}, width: childItemWidth }));
    const btnBounds = getElementBounds(_jsx(BtnAdd, { indexes: [0] }));
    const maxChildrenCount = Math.max(...items.map((item) => { var _a; return ((_a = item.children) === null || _a === void 0 ? void 0 : _a.length) || 0; }), 0);
    const columnHeight = rootItemBounds.height +
        itemGap +
        maxChildrenCount * (childItemBounds.height + itemGap);
    items.forEach((rootItem, rootIndex) => {
        const { children = [] } = rootItem;
        const columnX = rootIndex * (columnWidth + gap);
        const rootX = columnX;
        const rootY = 0;
        if (showColumnBackground) {
            const baseColor = palette[rootIndex % palette.length];
            const bgColor = `${baseColor}${Math.round(columnBackgroundAlpha * 255)
                .toString(16)
                .padStart(2, '0')}`;
            itemElements.push(_jsx(Rect, { x: columnX, y: rootY, width: columnWidth, height: columnHeight, fill: bgColor, rx: 0, ry: 0, "data-element-type": "shape" }));
        }
        itemElements.push(_jsx(RootItem, { indexes: [rootIndex], datum: rootItem, data: data, x: rootX, y: rootY, width: columnWidth }));
        btnElements.push(_jsx(BtnRemove, { indexes: [rootIndex], x: rootX + rootItemBounds.width - btnBounds.width - 10, y: rootY + 10 }));
        if (rootIndex === 0) {
            btnElements.push(_jsx(BtnAdd, { indexes: [rootIndex], x: rootX + rootItemBounds.width / 2 - btnBounds.width / 2, y: rootY - btnBounds.height - 5 }));
        }
        const childStartY = rootY + rootItemBounds.height + itemGap;
        children.forEach((child, childIndex) => {
            const childY = childStartY + childIndex * (childItemBounds.height + itemGap);
            const childX = rootX + itemPadding;
            const indexes = [rootIndex, childIndex];
            itemElements.push(_jsx(Item, { indexes: indexes, datum: child, data: data, x: childX, y: childY, width: childItemWidth }));
            btnElements.push(_jsx(BtnRemove, { indexes: indexes, x: childX + childItemBounds.width - btnBounds.width - 10, y: childY + (childItemBounds.height - btnBounds.height) / 2 }));
            if (childIndex < children.length - 1) {
                btnElements.push(_jsx(BtnAdd, { indexes: [rootIndex, childIndex + 1], x: childX + childItemBounds.width / 2 - btnBounds.width / 2, y: childY + childItemBounds.height - btnBounds.height / 2 }));
            }
        });
        const childX = rootX + itemPadding;
        if (children.length > 0) {
            const lastChildY = childStartY + children.length * (childItemBounds.height + itemGap);
            btnElements.push(_jsx(BtnAdd, { indexes: [rootIndex, children.length], x: childX + childItemBounds.width / 2 - btnBounds.width / 2, y: lastChildY - childItemBounds.height / 2 - btnBounds.height / 2 }));
        }
        else {
            btnElements.push(_jsx(BtnAdd, { indexes: [rootIndex, 0], x: childX + childItemBounds.width / 2 - btnBounds.width / 2, y: childStartY - itemGap / 2 - btnBounds.height / 2 }));
        }
    });
    if (items.length > 0) {
        const lastColumnX = items.length * (columnWidth + gap);
        btnElements.push(_jsx(BtnAdd, { indexes: [items.length], x: lastColumnX - gap / 2 - btnBounds.width / 2, y: -btnBounds.height - 5 }));
    }
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { children: [_jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('compare-hierarchy-row', {
    component: CompareHierarchyRow,
    composites: ['title', 'item'],
});
