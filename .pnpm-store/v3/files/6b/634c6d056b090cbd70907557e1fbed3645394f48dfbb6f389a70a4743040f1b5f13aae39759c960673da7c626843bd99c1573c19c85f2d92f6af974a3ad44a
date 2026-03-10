"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HierarchyMindmap = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const hierarchy_1 = require("@antv/hierarchy");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const DEFAULT_LEVEL_GAP = 60;
const DEFAULT_NODE_GAP = 14;
const LAYOUT_PADDING = 30;
const DEFAULT_EDGE_ALIGN = 'center';
const DEFAULT_EDGE_TYPE = 'curved';
const DEFAULT_EDGE_WIDTH = 2;
const DEFAULT_COLOR_MODE = 'node';
const DEFAULT_EDGE_COLOR_MODE = 'solid';
const annotateTree = (node, parentIndexes = [], index = 0) => {
    var _a, _b;
    const indexes = [...parentIndexes, index];
    return Object.assign(Object.assign({}, node), { _indexes: indexes, children: (_b = (_a = node.children) === null || _a === void 0 ? void 0 : _a.map((child, childIndex) => annotateTree(child, indexes, childIndex))) !== null && _b !== void 0 ? _b : [] });
};
const collectNodes = (node, nodes, links, parent) => {
    var _a;
    var _b;
    nodes.push(node);
    (_a = (_b = node.data)._flatIndex) !== null && _a !== void 0 ? _a : (_b._flatIndex = nodes.length - 1);
    if (parent)
        links.push({ parent, child: node });
    const children = node.children;
    children === null || children === void 0 ? void 0 : children.forEach((child) => collectNodes(child, nodes, links, node));
};
const createCurvePath = (sx, sy, tx, ty) => {
    const offsetX = Math.abs(tx - sx) / 2;
    const ctrlX1 = tx > sx ? sx + offsetX : sx - offsetX;
    const ctrlX2 = tx > sx ? tx - offsetX : tx + offsetX;
    return `M ${sx} ${sy} C ${ctrlX1} ${sy} ${ctrlX2} ${ty} ${tx} ${ty}`;
};
const createStraightPath = (sx, sy, tx, ty) => `M ${sx} ${sy} L ${tx} ${ty}`;
const getEdgeAnchors = (parentLayout, childLayout, childSide, align = DEFAULT_EDGE_ALIGN) => {
    const clampRatio = (val) => Math.max(0, Math.min(1, val));
    const toRatio = (value) => {
        if (value === 'top')
            return 0;
        if (value === 'bottom')
            return 1;
        if (value === 'center')
            return 0.5;
        return clampRatio(value);
    };
    const ratio = toRatio(align);
    const parentCy = parentLayout.y + parentLayout.height * ratio;
    const childCy = childLayout.y + childLayout.height * ratio;
    if (childSide === 'left') {
        return {
            sx: parentLayout.x,
            sy: parentCy,
            tx: childLayout.x + childLayout.width,
            ty: childCy,
        };
    }
    return {
        sx: parentLayout.x + parentLayout.width,
        sy: parentCy,
        tx: childLayout.x,
        ty: childCy,
    };
};
const HierarchyMindmap = (props) => {
    var _a, _b;
    const { Title, Items, data, levelGap = DEFAULT_LEVEL_GAP, nodeGap = DEFAULT_NODE_GAP, edgeAlign = DEFAULT_EDGE_ALIGN, colorMode = DEFAULT_COLOR_MODE, edgeColorMode = DEFAULT_EDGE_COLOR_MODE, edgeType = DEFAULT_EDGE_TYPE, edgeWidth = DEFAULT_EDGE_WIDTH, options, } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const colorPrimary = (0, utils_1.getColorPrimary)(options);
    const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
    const groupColorIndexMap = new Map();
    let nextGroupColorIndex = 0;
    if (!items.length || !(Items === null || Items === void 0 ? void 0 : Items.length)) {
        return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: (0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0], x: 0, y: 0 }) })] }));
    }
    const root = annotateTree(items[0]);
    const nodeSizeCache = new WeakMap();
    const colorCache = new WeakMap();
    const themeCache = new WeakMap();
    const getNodeColorIndexes = (datum, depth) => {
        var _a;
        if (colorMode === 'group') {
            const groupKey = String((_a = datum.group) !== null && _a !== void 0 ? _a : '');
            let groupIndex = groupColorIndexMap.get(groupKey);
            if (groupIndex == null) {
                groupIndex = nextGroupColorIndex;
                groupColorIndexMap.set(groupKey, groupIndex);
                nextGroupColorIndex += 1;
            }
            return [groupIndex];
        }
        return (0, utils_1.getHierarchyColorIndexes)({
            depth,
            originalIndexes: datum._indexes,
            flatIndex: datum._flatIndex,
        }, colorMode);
    };
    const getNodeThemeColors = (datum, depth) => {
        const cachedTheme = themeCache.get(datum);
        if (cachedTheme)
            return cachedTheme;
        const colorIndexes = getNodeColorIndexes(datum, depth);
        const primary = (0, utils_1.getPaletteColor)(options, colorIndexes);
        const themeColors = (0, utils_1.getThemeColors)({ colorPrimary: primary }, options);
        themeCache.set(datum, themeColors);
        colorCache.set(datum, primary);
        return themeColors;
    };
    const measureNode = (datum) => {
        const cached = nodeSizeCache.get(datum);
        if (cached)
            return cached;
        const depth = Math.max(datum._indexes.length - 1, 0);
        const Component = (0, utils_1.getItemComponent)(Items, depth);
        const bounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Component, { indexes: datum._indexes, data: data, datum: datum, positionH: "center", positionV: "middle", themeColors: getNodeThemeColors(datum, depth) }));
        nodeSizeCache.set(datum, bounds);
        return bounds;
    };
    const mindmapRoot = (0, hierarchy_1.mindmap)(root, {
        direction: 'H',
        getSide: (node, index) => {
            if (!node.parent)
                return 'right';
            const order = (node.parent.children || []).indexOf(node);
            const rank = order >= 0 ? order : index;
            return rank % 2 === 0 ? 'left' : 'right';
        },
        getWidth: (datum) => measureNode(datum).width,
        getHeight: (datum) => measureNode(datum).height,
        getHGap: () => levelGap,
        getVGap: () => nodeGap,
    });
    const layoutNodes = [];
    const nodeLinks = [];
    collectNodes(mindmapRoot, layoutNodes, nodeLinks);
    const minX = layoutNodes.length > 0 ? Math.min(...layoutNodes.map((node) => node.x)) : 0;
    const minY = layoutNodes.length > 0 ? Math.min(...layoutNodes.map((node) => node.y)) : 0;
    const shiftX = LAYOUT_PADDING - minX;
    const shiftY = LAYOUT_PADDING - minY;
    const defsElements = [];
    const decorElements = [];
    const itemElements = [];
    const btnElements = [];
    const layoutStore = new WeakMap();
    layoutNodes.forEach((node) => {
        var _a, _b;
        const datum = node.data;
        const measured = measureNode(datum);
        const displayX = node.x + shiftX + ((_a = node.hgap) !== null && _a !== void 0 ? _a : 0);
        const displayY = node.y + shiftY + ((_b = node.vgap) !== null && _b !== void 0 ? _b : 0);
        const Component = (0, utils_1.getItemComponent)(Items, node.depth);
        const positionH = node.depth === 0 ? 'center' : node.side === 'left' ? 'flipped' : 'normal';
        const themeColors = getNodeThemeColors(datum, node.depth);
        itemElements.push((0, jsx_runtime_1.jsx)(Component, { indexes: datum._indexes, data: data, datum: datum, x: displayX, y: displayY, positionH: positionH, positionV: "middle", themeColors: themeColors }));
        layoutStore.set(node, {
            x: displayX,
            y: displayY,
            width: measured.width,
            height: measured.height,
            centerX: displayX + measured.width / 2,
            centerY: displayY + measured.height / 2,
        });
    });
    nodeLinks.forEach((link) => {
        var _a, _b, _c, _d;
        const { parent, child } = link;
        const childLayout = layoutStore.get(child);
        const parentLayout = layoutStore.get(parent);
        if (!childLayout || !parentLayout) {
            return;
        }
        const childDatum = child.data;
        const { sx, sy, tx, ty } = getEdgeAnchors(parentLayout, childLayout, child.side, edgeAlign);
        const childColor = (_a = colorCache.get(childDatum)) !== null && _a !== void 0 ? _a : (0, utils_1.getPaletteColor)(options, getNodeColorIndexes(childDatum, child.depth));
        const parentColor = (_b = colorCache.get(parent.data)) !== null && _b !== void 0 ? _b : (0, utils_1.getPaletteColor)(options, getNodeColorIndexes(parent.data, parent.depth));
        const pathD = edgeType === 'straight'
            ? createStraightPath(sx, sy, tx, ty)
            : createCurvePath(sx, sy, tx, ty);
        const gradientId = `edge-gradient-${childDatum._indexes.join('-')}`;
        decorElements.push((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: pathD, stroke: edgeColorMode === 'gradient'
                ? `url(#${gradientId})`
                : (childColor !== null && childColor !== void 0 ? childColor : colorPrimary), strokeWidth: edgeWidth, fill: "none" }));
        if (edgeColorMode === 'gradient') {
            defsElements.push((0, jsx_runtime_1.jsxs)("linearGradient", { id: gradientId, gradientUnits: "userSpaceOnUse", x1: sx, y1: sy, x2: tx, y2: ty, children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: parentColor !== null && parentColor !== void 0 ? parentColor : colorPrimary }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: childColor !== null && childColor !== void 0 ? childColor : colorPrimary })] }));
        }
        const appendIndex = (_d = (_c = childDatum.children) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0;
        const addIndexes = [...childDatum._indexes, appendIndex];
        const btnX = childLayout.x + (childLayout.width - btnBounds.width) / 2;
        const removeY = childLayout.y + childLayout.height + 8;
        const addY = removeY + btnBounds.height + 6;
        if (child.depth > 0) {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: childDatum._indexes, x: btnX, y: removeY }));
        }
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: addIndexes, x: btnX, y: addY }));
    });
    const rootLayout = layoutStore.get(mindmapRoot);
    if (rootLayout) {
        const rootDatum = mindmapRoot.data;
        const appendIndex = (_b = (_a = rootDatum.children) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        const addIndexes = [...rootDatum._indexes, appendIndex];
        const btnX = rootLayout.x + (rootLayout.width - btnBounds.width) / 2;
        const addY = rootLayout.y + rootLayout.height + 8 + btnBounds.height + 6;
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: addIndexes, x: btnX, y: addY }));
    }
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [defsElements.length > 0 ? (0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: defsElements }) : null, (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: decorElements }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.HierarchyMindmap = HierarchyMindmap;
(0, registry_1.registerStructure)('hierarchy-mindmap', {
    component: exports.HierarchyMindmap,
    composites: ['title', 'item'],
});
