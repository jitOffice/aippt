"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceHorizontalZigzag = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const SequenceHorizontalZigzag = (props) => {
    const { Title, Item, data, gap = 30, cardPadding = 10, options } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const colorPrimary = (0, utils_1.getColorPrimary)(options);
    const themeColors = (0, utils_1.getThemeColors)({ colorPrimary }, options);
    const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
    const btnElements = [];
    const itemElements = [];
    const decoElements = [];
    const cardWidth = itemBounds.width + cardPadding * 2;
    const cardHeight = itemBounds.height + cardPadding * 2 + 30;
    const dotSize = 8;
    const dotGap = 6;
    const topMargin = Math.max(btnBounds.height + 20, 40);
    const levelOffset = 40;
    items.forEach((item, index) => {
        const isEven = index % 2 === 0;
        const cardX = index * (cardWidth + gap);
        let cardY;
        if (isEven) {
            if (index % 4 === 2) {
                cardY = topMargin;
            }
            else {
                cardY = topMargin + levelOffset;
            }
        }
        else {
            cardY = topMargin + levelOffset + 60;
        }
        const indexes = [index];
        const itemColor = (0, utils_1.getPaletteColor)(options, indexes) || colorPrimary;
        if (isEven) {
            // Use item color with opacity for background
            const backgroundColor = itemColor === colorPrimary
                ? themeColors.colorPrimaryBg || '#E8F3FF'
                : `${itemColor}20`; // 20 = ~12% opacity in hex
            const cardBackground = ((0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: cardX, y: cardY, width: cardWidth, height: cardHeight, fill: backgroundColor, rx: 20, ry: 20 }));
            decoElements.push(cardBackground);
        }
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: cardX + cardPadding, y: cardY + cardPadding, positionH: "center", positionV: "normal" }));
        const totalDotsWidth = items.length * dotSize + (items.length - 1) * dotGap;
        const dotsStartX = cardX + (cardWidth - totalDotsWidth) / 2;
        const dotsY = cardY + itemBounds.height + 20;
        for (let i = 0; i < items.length; i++) {
            const dotX = dotsStartX + i * (dotSize + dotGap);
            const isCurrent = i === index;
            decoElements.push((0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: dotX, y: dotsY, width: dotSize, height: dotSize, fill: isCurrent ? itemColor : 'transparent', stroke: itemColor, strokeWidth: 2 }));
        }
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: indexes, x: cardX + (cardWidth - btnBounds.width) / 2, y: cardY + cardHeight + 10 }));
        if (index === 0) {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: indexes, x: cardX + (cardWidth - btnBounds.width) / 2, y: cardY - btnBounds.height - 10 }));
        }
        else {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: indexes, x: cardX - gap / 2 - btnBounds.width / 2, y: topMargin - btnBounds.height - 10 }));
        }
    });
    if (items.length > 0) {
        const pathSegments = [];
        const radius = 35;
        const padding = gap / 2;
        const circleRadius = 6;
        const firstCardY = topMargin + levelOffset;
        const startX = 0 - padding;
        const startY = firstCardY + cardHeight / 2;
        pathSegments.push(`M ${startX} ${startY - circleRadius}`);
        items.forEach((_, index) => {
            const isEven = index % 2 === 0;
            const cardX = index * (cardWidth + gap);
            let cardY;
            if (isEven) {
                if (index % 4 === 2) {
                    cardY = topMargin;
                }
                else {
                    cardY = topMargin + levelOffset;
                }
            }
            else {
                cardY = topMargin + levelOffset + 60;
            }
            const left = cardX - padding;
            const right = cardX + cardWidth + padding;
            const top = cardY - padding;
            const bottom = cardY + cardHeight + padding;
            const middleY = cardY + cardHeight / 2;
            if (isEven) {
                pathSegments.push(`L ${left} ${top + radius}`);
                pathSegments.push(`Q ${left} ${top} ${left + radius} ${top}`);
                pathSegments.push(`L ${right - radius} ${top}`);
                pathSegments.push(`Q ${right} ${top} ${right} ${top + radius}`);
                pathSegments.push(`L ${right} ${middleY - circleRadius}`);
            }
            else {
                pathSegments.push(`L ${left} ${middleY}`);
                pathSegments.push(`L ${left} ${bottom - radius}`);
                pathSegments.push(`Q ${left} ${bottom} ${left + radius} ${bottom}`);
                pathSegments.push(`L ${right - radius} ${bottom}`);
                pathSegments.push(`Q ${right} ${bottom} ${right} ${bottom - radius}`);
                pathSegments.push(`L ${right} ${middleY + circleRadius}`);
            }
        });
        const lastIndex = items.length - 1;
        const lastIsEven = lastIndex % 2 === 0;
        const lastCardX = lastIndex * (cardWidth + gap);
        let lastCardY;
        if (lastIsEven) {
            if (lastIndex % 4 === 2) {
                lastCardY = topMargin;
            }
            else {
                lastCardY = topMargin + levelOffset;
            }
        }
        else {
            lastCardY = topMargin + levelOffset + 60;
        }
        const endX = lastCardX + cardWidth + padding;
        const endY = lastCardY + cardHeight / 2;
        const pathD = pathSegments.join(' ');
        // Create gradient for the path with stops for each item
        const linearGradientId = 'gradient-zigzag-path';
        const firstColor = (0, utils_1.getPaletteColor)(options, [0]) || colorPrimary;
        const lastColor = (0, utils_1.getPaletteColor)(options, [items.length - 1]) || colorPrimary;
        // Generate gradient stops for each item
        const gradientStops = items.map((_, index) => {
            const offset = (index / (items.length - 1)) * 100;
            const color = (0, utils_1.getPaletteColor)(options, [index]) || colorPrimary;
            return (0, jsx_runtime_1.jsx)("stop", { offset: `${offset}%`, stopColor: color });
        });
        decoElements.unshift((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: (0, jsx_runtime_1.jsx)("linearGradient", { id: linearGradientId, x1: startX, y1: startY, x2: endX, y2: endY, gradientUnits: "userSpaceOnUse", children: gradientStops }) }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: pathD, stroke: `url(#${linearGradientId})`, strokeWidth: 2, fill: "none", width: (items.length - 1) * (cardWidth + gap) + cardWidth + padding * 2, height: cardHeight + 120 })] }));
        decoElements.unshift((0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: startX - circleRadius, y: startY - circleRadius, width: circleRadius * 2, height: circleRadius * 2, fill: "transparent", stroke: firstColor, strokeWidth: 2 }));
        decoElements.unshift((0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: endX - circleRadius, y: endY - circleRadius, width: circleRadius * 2, height: circleRadius * 2, fill: "transparent", stroke: lastColor, strokeWidth: 2 }));
    }
    if (items.length > 0) {
        const lastIndex = items.length - 1;
        const lastCardX = lastIndex * (cardWidth + gap);
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [items.length], x: lastCardX + cardWidth + (gap - btnBounds.width) / 2, y: topMargin - btnBounds.height - 10 }));
    }
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.ShapesGroup, { children: decoElements }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.SequenceHorizontalZigzag = SequenceHorizontalZigzag;
(0, registry_1.registerStructure)('sequence-horizontal-zigzag', {
    component: exports.SequenceHorizontalZigzag,
    composites: ['title', 'item'],
});
