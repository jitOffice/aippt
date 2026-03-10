import { jsx as _jsx, jsxs as _jsxs } from "../../../jsx-runtime.js";
import { getElementBounds, Group } from '../../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../../components/index.js';
import { FlexLayout } from '../../layouts/index.js';
import { getPaletteColor, getThemeColors } from '../../utils/index.js';
import { registerStructure } from '../registry.js';
import './dividers/index.js';
import { getDividerComponent } from './dividers/index.js';
export const CompareBinaryHorizontal = (props) => {
    const { Title, Item, data, gap = 20, groupGap = 20, opposite = true, flipped = true, dividerType = 'vs', options, } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    if (items.length === 0) {
        return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsx(Group, { children: _jsx(BtnsGroup, { children: _jsx(BtnAdd, { indexes: [0], x: 0, y: 0 }) }) })] }));
    }
    const leftRoot = items[0] || { children: [] };
    const rightRoot = items[1] || { children: [] };
    const leftChildren = leftRoot.children || [];
    const rightChildren = rightRoot.children || [];
    const colors = getThemeColors(options.themeConfig);
    const itemBounds = getElementBounds(_jsx(Item, { indexes: [0, 0], data: data, datum: leftChildren[0] || {} }));
    const btnBounds = getElementBounds(_jsx(BtnAdd, { indexes: [0] }));
    const Divider = getDividerComponent(dividerType);
    const dividerBounds = Divider
        ? getElementBounds(_jsx(Divider, { x: 0, y: 0, colorPrimary: colors.colorPrimary, colorBg: colors.colorBg, colorPositive: colors.colorPrimary, colorNegative: colors.colorPrimary }))
        : { width: 0, height: 0 };
    const itemElements = [];
    const btnElements = [];
    const decorElements = [];
    const maxChildren = Math.max(leftChildren.length, rightChildren.length);
    const itemsHeight = maxChildren > 0 ? maxChildren * (itemBounds.height + gap) - gap : 0;
    const btnSpacing = 5;
    const topOffset = maxChildren > 0 ? gap / 2 + btnBounds.height / 2 : btnBounds.height / 2;
    const leftX = btnBounds.width + btnSpacing;
    // groupGap 现在表示左侧数据项到 divider 左边缘的距离
    // 总的两组数据项之间的间距 = groupGap + divider宽度 + groupGap
    const dividerX = leftX + itemBounds.width + groupGap;
    const rightX = dividerX + dividerBounds.width + groupGap;
    const leftPositionH = flipped ? 'flipped' : opposite ? 'normal' : 'normal';
    const rightPositionH = flipped ? 'normal' : opposite ? 'flipped' : 'normal';
    leftChildren.forEach((child, index) => {
        const childY = topOffset + index * (itemBounds.height + gap);
        const indexes = [0, index];
        itemElements.push(_jsx(Item, { indexes: indexes, datum: child, data: data, x: leftX, y: childY, positionH: leftPositionH, positionV: "middle" }));
        btnElements.push(_jsx(BtnRemove, { indexes: indexes, x: leftX - btnBounds.width - btnSpacing, y: childY + (itemBounds.height - btnBounds.height) / 2 }));
        if (index < leftChildren.length - 1) {
            btnElements.push(_jsx(BtnAdd, { indexes: [0, index + 1], x: leftX + (itemBounds.width - btnBounds.width) / 2, y: childY + itemBounds.height + gap / 2 - btnBounds.height / 2 }));
        }
    });
    if (leftChildren.length > 0) {
        btnElements.push(_jsx(BtnAdd, { indexes: [0, 0], x: leftX + (itemBounds.width - btnBounds.width) / 2, y: topOffset - gap / 2 - btnBounds.height / 2 }));
        const lastChildY = topOffset + (leftChildren.length - 1) * (itemBounds.height + gap);
        btnElements.push(_jsx(BtnAdd, { indexes: [0, leftChildren.length], x: leftX + (itemBounds.width - btnBounds.width) / 2, y: lastChildY + itemBounds.height + gap / 2 - btnBounds.height / 2 }));
    }
    else if (items.length >= 1) {
        btnElements.push(_jsx(BtnAdd, { indexes: [0, 0], x: leftX + (itemBounds.width - btnBounds.width) / 2, y: topOffset - btnBounds.height / 2 }));
    }
    rightChildren.forEach((child, index) => {
        const childY = topOffset + index * (itemBounds.height + gap);
        const indexes = [1, index];
        itemElements.push(_jsx(Item, { indexes: indexes, datum: child, data: data, x: rightX, y: childY, positionH: rightPositionH, positionV: "middle" }));
        btnElements.push(_jsx(BtnRemove, { indexes: indexes, x: rightX + itemBounds.width + btnSpacing, y: childY + (itemBounds.height - btnBounds.height) / 2 }));
        if (index < rightChildren.length - 1) {
            btnElements.push(_jsx(BtnAdd, { indexes: [1, index + 1], x: rightX + (itemBounds.width - btnBounds.width) / 2, y: childY + itemBounds.height + gap / 2 - btnBounds.height / 2 }));
        }
    });
    if (rightChildren.length > 0) {
        btnElements.push(_jsx(BtnAdd, { indexes: [1, 0], x: rightX + (itemBounds.width - btnBounds.width) / 2, y: topOffset - gap / 2 - btnBounds.height / 2 }));
        const lastChildY = topOffset + (rightChildren.length - 1) * (itemBounds.height + gap);
        btnElements.push(_jsx(BtnAdd, { indexes: [1, rightChildren.length], x: rightX + (itemBounds.width - btnBounds.width) / 2, y: lastChildY + itemBounds.height + gap / 2 - btnBounds.height / 2 }));
    }
    else if (items.length >= 2) {
        btnElements.push(_jsx(BtnAdd, { indexes: [1, 0], x: rightX + (itemBounds.width - btnBounds.width) / 2, y: topOffset - btnBounds.height / 2 }));
    }
    if (items.length < 2) {
        btnElements.push(_jsx(BtnAdd, { indexes: [1], x: rightX + (itemBounds.width - btnBounds.width) / 2, y: topOffset + (itemsHeight - btnBounds.height) / 2 }));
    }
    if (Divider) {
        decorElements.push(_jsx(Divider, { x: dividerX, y: topOffset + (itemsHeight - dividerBounds.height) / 2, colorPrimary: colors.colorPrimary, colorBg: colors.colorBg, colorPositive: getPaletteColor(options, [0]) || colors.colorPrimary, colorNegative: getPaletteColor(options, [1]) || colors.colorPrimary }));
    }
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { children: [_jsx(Group, { children: decorElements }), _jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('compare-binary-horizontal', {
    component: CompareBinaryHorizontal,
    composites: ['title', 'item'],
});
