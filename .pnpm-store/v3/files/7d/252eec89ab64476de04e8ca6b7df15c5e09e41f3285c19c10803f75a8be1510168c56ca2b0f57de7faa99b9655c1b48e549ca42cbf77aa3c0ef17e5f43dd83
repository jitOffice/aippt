import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Defs, Ellipse, getElementBounds, Group, Path, Text } from '../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup, ShapesGroup, } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { getColorPrimary, getPaletteColor, getPaletteColors } from '../utils/index.js';
import { registerStructure } from './registry.js';
export const SequenceTimeline = (props) => {
    const { Title, Item, data, gap = 10, showStepLabels = true, options } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    const colorPrimary = getColorPrimary(options);
    const palette = getPaletteColors(options);
    const btnBounds = getElementBounds(_jsx(BtnAdd, { indexes: [0] }));
    const itemBounds = getElementBounds(_jsx(Item, { indexes: [0], data: data, datum: items[0], positionH: "normal" }));
    const btnElements = [];
    const itemElements = [];
    const decorElements = [];
    const stepLabelX = 10;
    const timelineX = stepLabelX + 70 + 10;
    const itemX = timelineX + 30;
    const nodeRadius = 6;
    // Add continuous timeline line first (so it appears behind the dots)
    if (items.length > 1) {
        const firstNodeY = itemBounds.height / 2 + nodeRadius;
        const lastNodeY = (items.length - 1) * (itemBounds.height + gap) +
            itemBounds.height / 2 -
            nodeRadius;
        const continuousLinePath = `M ${timelineX} ${firstNodeY} L ${timelineX} ${lastNodeY}`;
        const linearGradientId = 'gradient-timeline-line';
        const totalHeight = lastNodeY - firstNodeY;
        // Generate gradient stops for each item
        const gradientStops = items.map((_, index) => {
            const nodeY = index * (itemBounds.height + gap) + itemBounds.height / 2;
            const offset = ((nodeY - firstNodeY) / totalHeight) * 100;
            const color = getPaletteColor(options, [index]);
            return _jsx("stop", { offset: `${offset}%`, stopColor: color || colorPrimary });
        });
        decorElements.push(_jsxs(_Fragment, { children: [_jsx(Defs, { children: _jsx("linearGradient", { id: linearGradientId, x1: timelineX, y1: firstNodeY, x2: timelineX, y2: lastNodeY, gradientUnits: "userSpaceOnUse", children: gradientStops }) }), _jsx(Path, { d: continuousLinePath, stroke: `url(#${linearGradientId})`, strokeWidth: 2, width: 1, height: lastNodeY - firstNodeY })] }));
    }
    items.forEach((item, index) => {
        const itemY = index * (itemBounds.height + gap);
        const nodeY = itemY + itemBounds.height / 2;
        const indexes = [index];
        if (showStepLabels) {
            decorElements.push(_jsx(Text, { x: stepLabelX, y: nodeY, width: 70, fontSize: 18, fontWeight: "bold", alignHorizontal: "left", alignVertical: "middle", fill: palette[index % palette.length], children: `STEP ${index + 1}` }));
        }
        itemElements.push(_jsx(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: itemY, positionH: "normal" }));
        decorElements.push(_jsx(Ellipse, { x: timelineX - nodeRadius, y: nodeY - nodeRadius, width: nodeRadius * 2, height: nodeRadius * 2, fill: palette[index % palette.length] }));
        btnElements.push(_jsx(BtnRemove, { indexes: indexes, x: itemX - btnBounds.width - 10, y: itemY + (itemBounds.height - btnBounds.height) / 2 }));
        if (index === 0) {
            btnElements.push(_jsx(BtnAdd, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: itemY - btnBounds.height - 10 }));
        }
        else {
            btnElements.push(_jsx(BtnAdd, { indexes: indexes, x: itemX + (itemBounds.width - btnBounds.width) / 2, y: itemY - gap / 2 - btnBounds.height / 2 }));
        }
    });
    if (items.length > 0) {
        const lastItemY = (items.length - 1) * (itemBounds.height + gap);
        btnElements.push(_jsx(BtnAdd, { indexes: [items.length], x: itemX + (itemBounds.width - btnBounds.width) / 2, y: lastItemY + itemBounds.height + 10 }));
    }
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { children: [_jsx(ShapesGroup, { children: decorElements }), _jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('sequence-timeline', {
    component: SequenceTimeline,
    composites: ['title', 'item'],
});
