import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../../jsx-runtime.js";
import { Defs, getElementBounds, Group, Path, Rect } from '../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { getColorPrimary, getPaletteColor } from '../utils/index.js';
import { registerStructure } from './registry.js';
export const SequenceColorSnakeSteps = (props) => {
    const { Title, Item, data, gap = 0, rowGap = 0, itemsPerRow = 3, circleStrokeWidth = 18, options, } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    const colorPrimary = getColorPrimary(options);
    const btnBounds = getElementBounds(_jsx(BtnAdd, { indexes: [0] }));
    const itemBounds = getElementBounds(_jsx(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
    const btnElements = [];
    const itemElements = [];
    const decorElements = [];
    const arcRadius = (rowGap + itemBounds.height) / 2;
    const arcWidth = arcRadius;
    items.forEach((item, index) => {
        const rowIndex = Math.floor(index / itemsPerRow);
        const colIndex = index % itemsPerRow;
        const isReversedRow = rowIndex % 2 === 1;
        const actualColIndex = isReversedRow
            ? itemsPerRow - 1 - colIndex
            : colIndex;
        const itemX = actualColIndex * (itemBounds.width + gap) + arcWidth;
        const itemY = rowIndex * (itemBounds.height + rowGap);
        const indexes = [index];
        itemElements.push(_jsx(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: itemY, positionH: "center", positionV: index % 2 === 1 ? 'flipped' : 'normal' }));
        btnElements.push(_jsx(BtnRemove, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: itemY + itemBounds.height + 10 }));
        if (index === 0) {
            btnElements.push(_jsx(BtnAdd, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: itemY - btnBounds.height - 10 }));
        }
        if (index < items.length - 1) {
            const nextRowIndex = Math.floor((index + 1) / itemsPerRow);
            const isSameRow = rowIndex === nextRowIndex;
            if (isSameRow) {
                btnElements.push(_jsx(BtnAdd, { indexes: [index + 1], x: itemX + (itemBounds.width - btnBounds.width) / 2, y: itemY - btnBounds.height - 10 }));
            }
            else {
                const currentItemY = itemY + itemBounds.height / 2;
                const nextItemY = itemY + itemBounds.height + rowGap + itemBounds.height / 2;
                let arcX, pathD, sweepFlag;
                if (isReversedRow) {
                    arcX = itemX;
                    sweepFlag = 0;
                    pathD = `M ${arcX} ${currentItemY} A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${arcX} ${nextItemY}`;
                }
                else {
                    arcX = itemX + itemBounds.width;
                    sweepFlag = 1;
                    pathD = `M ${arcX} ${currentItemY} A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${arcX} ${nextItemY}`;
                }
                const arcHeight = nextItemY - currentItemY;
                const currentColor = getPaletteColor(options, indexes);
                const nextColor = getPaletteColor(options, [index + 1]);
                const linearGradientId = `gradient-arc-${index}`;
                decorElements.push(_jsxs(_Fragment, { children: [_jsx(Defs, { children: _jsxs("linearGradient", { id: linearGradientId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: currentColor || colorPrimary }), _jsx("stop", { offset: "100%", stopColor: nextColor || colorPrimary })] }) }), _jsx(Path, { d: pathD, stroke: `url(#${linearGradientId})`, strokeWidth: circleStrokeWidth, fill: "none", width: arcWidth, height: arcHeight, "data-element-type": "shape" })] }));
                const btnX = isReversedRow
                    ? arcX - arcRadius - btnBounds.width / 2
                    : arcX + arcRadius - btnBounds.width / 2;
                const btnY = itemY + itemBounds.height + rowGap / 2 - btnBounds.height / 2;
                btnElements.push(_jsx(BtnAdd, { indexes: [index + 1], x: btnX, y: btnY }));
            }
        }
    });
    if (items.length > 0) {
        const lastIndex = items.length - 1;
        const lastRowIndex = Math.floor(lastIndex / itemsPerRow);
        const lastColIndex = lastIndex % itemsPerRow;
        const isLastReversedRow = lastRowIndex % 2 === 1;
        const lastActualColIndex = isLastReversedRow
            ? itemsPerRow - 1 - lastColIndex
            : lastColIndex;
        const lastItemX = lastActualColIndex * (itemBounds.width + gap);
        const lastItemY = lastRowIndex * (itemBounds.height + rowGap);
        btnElements.push(_jsx(BtnAdd, { indexes: [items.length], x: lastItemX + (itemBounds.width - btnBounds.width) / 2, y: lastItemY + itemBounds.height + btnBounds.height + 20 }));
    }
    // Add left rectangle bar for the first item when there's an arc on the left side
    if (items.length / itemsPerRow > 2) {
        const arcRadius = (rowGap + itemBounds.height) / 2;
        const firstItemColor = getPaletteColor(options, [0]);
        decorElements.push(_jsx(Rect, { x: 0, y: itemBounds.height / 2 - circleStrokeWidth / 2, width: arcRadius, height: circleStrokeWidth, fill: firstItemColor || colorPrimary, "data-element-type": "shape" }));
    }
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { width: itemsPerRow * itemBounds.width +
                    (itemsPerRow - 1) * gap +
                    arcRadius * 2, height: Math.ceil(items.length / itemsPerRow) * (itemBounds.height + rowGap), children: [_jsx(Group, { children: decorElements }), _jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('sequence-color-snake-steps', {
    component: SequenceColorSnakeSteps,
    composites: ['title', 'item'],
});
