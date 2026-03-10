"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareHierarchyLeftRight = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const defs_1 = require("../defs");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const decorationWidthMap = {
    none: 5,
    'dot-line': 100,
    'arc-dot': 20,
    'split-line': 5,
};
const CompareHierarchyLeftRight = (props) => {
    var _a, _b;
    const { Title, Items, data, gap = 20, groupGap = 0, decoration = 'none', surround = true, flipRoot = false, flipLeaf = false, options, } = props;
    const [RootItem, Item] = Items;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const rootItemContent = ((0, jsx_runtime_1.jsx)(RootItem, { indexes: [0], data: data, datum: data.items[0], themeColors: {} }));
    const itemContent = ((0, jsx_runtime_1.jsx)(Item, { indexes: [0, 0], data: data, datum: ((_b = (_a = items[0]) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b[0]) || items[2] }));
    const rootItemBounds = (0, jsx_1.getElementBounds)(rootItemContent);
    const itemBounds = (0, jsx_1.getElementBounds)(itemContent);
    const itemElements = [];
    const decoElements = [];
    const [leftRoot, rightRoot] = items;
    const leftItems = (leftRoot === null || leftRoot === void 0 ? void 0 : leftRoot.children) || [];
    const rightItems = (rightRoot === null || rightRoot === void 0 ? void 0 : rightRoot.children) || [];
    const totalHeight = Math.max(rootItemBounds.height, leftItems.length * (itemBounds.height + gap) - gap, rightItems.length * (itemBounds.height + gap) - gap);
    const decorationWidth = decorationWidthMap[decoration] || 0;
    // create root items
    const leftRootX = itemBounds.width + decorationWidth;
    const rightRootX = leftRootX + rootItemBounds.width + groupGap;
    const rootY = (totalHeight - rootItemBounds.height) / 2;
    if (leftRoot) {
        itemElements.push((0, jsx_runtime_1.jsx)(RootItem, { indexes: [0], x: leftRootX, y: rootY, data: data, datum: leftRoot, positionH: flipRoot ? 'normal' : 'flipped' }));
    }
    if (rightRoot) {
        itemElements.push((0, jsx_runtime_1.jsx)(RootItem, { indexes: [1], x: rightRootX, y: rootY, data: data, datum: rightRoot, positionH: flipRoot ? 'flipped' : 'normal' }));
    }
    const addDecoElement = (side, pos, indexes) => {
        if (decoration === 'none')
            return;
        const [x, y] = pos;
        const currentColor = (0, utils_1.getPaletteColor)(options, indexes);
        const props = {
            x,
            y,
            width: itemBounds.width,
            height: itemBounds.height,
            side,
            color: currentColor || '#ccc',
            colorBg: options.themeConfig.colorBg || '#fff',
        };
        if (decoration === 'split-line') {
            decoElements.push((0, jsx_runtime_1.jsx)(SplitLine, Object.assign({}, props)));
        }
        else if (decoration === 'dot-line') {
            decoElements.push((0, jsx_runtime_1.jsx)(DotLine, Object.assign({}, props)));
        }
    };
    if (surround) {
        const diameter = 2 * rootItemBounds.width + groupGap + itemBounds.width;
        const radius = diameter / 2 + decorationWidth;
        const circleCenterX = leftRootX + rootItemBounds.width + groupGap / 2;
        const circleCenterY = rootY + rootItemBounds.height / 2;
        leftItems.forEach((item, index) => {
            const leftItemsHeight = leftItems.length * (itemBounds.height + gap) - gap;
            const leftStartY = (totalHeight - leftItemsHeight) / 2;
            const itemY = leftStartY + index * (itemBounds.height + gap);
            const itemCenterY = itemY + itemBounds.height / 2;
            const dy = itemCenterY - circleCenterY;
            const dxSq = Math.max(0, radius * radius - dy * dy);
            const xCenter = circleCenterX - Math.sqrt(dxSq);
            const leftX = xCenter - itemBounds.width / 2;
            itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: [0, index], datum: item, data: data, x: leftX, y: itemY, positionH: flipLeaf ? 'flipped' : 'normal' }));
            addDecoElement('left', [leftX, itemY], [0, index]);
        });
        rightItems.forEach((item, index) => {
            const rightItemsHeight = rightItems.length * (itemBounds.height + gap) - gap;
            const rightStartY = (totalHeight - rightItemsHeight) / 2;
            const itemY = rightStartY + index * (itemBounds.height + gap);
            const itemCenterY = itemY + itemBounds.height / 2;
            const dy = itemCenterY - circleCenterY;
            const dxSq = Math.max(0, radius * radius - dy * dy);
            const xCenter = circleCenterX + Math.sqrt(dxSq);
            const rightX = xCenter - itemBounds.width / 2;
            itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: [1, index], datum: item, data: data, x: rightX, y: itemY, positionH: flipLeaf ? 'normal' : 'flipped' }));
            addDecoElement('right', [rightX, itemY], [1, index]);
        });
    }
    else {
        // create left items
        leftItems.forEach((item, index) => {
            const leftItemsHeight = leftItems.length * (itemBounds.height + gap) - gap;
            const leftStartY = (totalHeight - leftItemsHeight) / 2;
            const itemY = leftStartY + index * (itemBounds.height + gap);
            const indexes = [0, index];
            const leftX = 0;
            itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: leftX, y: itemY, positionH: flipLeaf ? 'flipped' : 'normal' }));
            addDecoElement('left', [leftX, itemY], indexes);
        });
        // create right items
        rightItems.forEach((item, index) => {
            const rightItemsHeight = rightItems.length * (itemBounds.height + gap) - gap;
            const rightStartY = (totalHeight - rightItemsHeight) / 2;
            const itemY = rightStartY + index * (itemBounds.height + gap);
            const indexes = [1, index];
            const rightX = rightRootX + rootItemBounds.width + decorationWidth;
            itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: rightX, y: itemY, positionH: flipLeaf ? 'normal' : 'flipped' }));
            addDecoElement('right', [rightX, itemY], indexes);
        });
    }
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { width: 0, height: 0, children: decoElements })] })] }));
};
exports.CompareHierarchyLeftRight = CompareHierarchyLeftRight;
const SplitLine = (props) => {
    const { x, y, width, height, color, colorBg, side } = props;
    const lineY = y + height;
    const linearGradientId = `split-line-linear-gradient-${side}`;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: (0, jsx_runtime_1.jsx)(defs_1.LinearGradient, { id: linearGradientId, startColor: color, stopColor: colorBg, direction: side === 'left' ? 'left-right' : 'right-left' }) }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: x, y: lineY, width: width, height: 1, fill: `url(#${linearGradientId})` })] }));
};
const DotLine = (props) => {
    const { x, y, side, width, height, color, colorBg } = props;
    const radius = 6;
    const innerRadius = radius / 3;
    const d = radius * 2;
    const innerD = innerRadius * 2;
    const gap = 5;
    const cx = side === 'left' ? x + width + radius + gap : x - radius - gap;
    const cy = y + height / 2;
    const innerX = cx - innerRadius;
    const innerY = cy - innerRadius;
    const lineLength = 80;
    const dx = side === 'left' ? lineLength : -lineLength;
    const linearGradientId = `dot-line-linear-gradient-${side}`;
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: (0, jsx_runtime_1.jsx)(defs_1.LinearGradient, { id: linearGradientId, startColor: color, stopColor: colorBg, direction: side === 'left' ? 'left-right' : 'right-left' }) }), (0, jsx_runtime_1.jsxs)(components_1.ShapesGroup, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: cx - radius, y: cy - radius, width: d, height: d, fill: "none", strokeWidth: 1, stroke: color }), (0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { x: innerX, y: innerY, width: innerD, height: innerD, fill: color })] }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: side === 'left' ? cx : cx + dx, y: cy - 0.5, width: lineLength, height: 1, fill: `url(#${linearGradientId})` })] }));
};
(0, registry_1.registerStructure)('compare-hierarchy-left-right', {
    component: exports.CompareHierarchyLeftRight,
    composites: ['title', 'item'],
});
