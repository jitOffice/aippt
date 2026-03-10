import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { DagreLayout } from '@antv/layout';
import { Defs, getElementBounds, Group, Path, Text } from '../../jsx/index.js';
import { BtnAdd, BtnsGroup, ItemsGroup } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { createArrowElements, createRoundedPath, createStraightPath, getColorPrimary, getMidPoint, getPaletteColor, getThemeColors, } from '../utils/index.js';
import { registerStructure } from './registry.js';
const DEFAULT_NODE_SEP = 50;
const DEFAULT_RANK_SEP = 70;
const DEFAULT_EDGE_SEP = 10;
const DEFAULT_EDGE_WIDTH = 2;
const DEFAULT_PADDING = 30;
const checkUndirectedCycle = (nodeIds, edges) => {
    var _a, _b;
    const adj = new Map();
    nodeIds.forEach((id) => adj.set(id, []));
    for (const edge of edges) {
        if (edge.source === edge.target)
            return true;
        (_a = adj.get(edge.source)) === null || _a === void 0 ? void 0 : _a.push({ target: edge.target, edgeId: edge.id });
        (_b = adj.get(edge.target)) === null || _b === void 0 ? void 0 : _b.push({ target: edge.source, edgeId: edge.id });
    }
    const visited = new Set();
    const dfs = (u, parentEdgeId) => {
        visited.add(u);
        const neighbors = adj.get(u) || [];
        for (const { target: v, edgeId } of neighbors) {
            if (edgeId === parentEdgeId)
                continue;
            if (visited.has(v))
                return true;
            if (dfs(v, edgeId))
                return true;
        }
        return false;
    };
    for (const node of nodeIds) {
        if (!visited.has(node)) {
            if (dfs(node, null))
                return true;
        }
    }
    return false;
};
export const RelationDagreFlow = (props) => {
    var _a, _b;
    const { Title, Item, data, rankdir = 'TB', nodesep = DEFAULT_NODE_SEP, ranksep = DEFAULT_RANK_SEP, edgesep = DEFAULT_EDGE_SEP, edgeWidth = DEFAULT_EDGE_WIDTH, showConnections = true, edgeColorMode = 'gradient', edgeStyle = 'solid', edgeDashPattern = '5,5', edgeCornerRadius = 12, edgeRouting = 'orth', showArrow = true, arrowType = 'triangle', padding = DEFAULT_PADDING, edgeAnimation = 'none', edgeAnimationSpeed = 1, options, } = props;
    const { title, desc, items = [], relations = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    if (!Item || items.length === 0) {
        return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsx(Group, { children: _jsx(BtnAdd, { indexes: [0], x: 0, y: 0 }) })] }));
    }
    const nodeMetaMap = new Map();
    const nodeSizeMap = new Map();
    const nodeColorMap = new Map();
    const nodeIdsByIndex = new Map();
    const nodeIdSet = new Set();
    const colorGroupIndexMap = new Map();
    let nextColorGroupIndex = 0;
    const nodes = items.map((item, index) => {
        var _a, _b;
        const datum = item;
        const id = String((_a = datum.id) !== null && _a !== void 0 ? _a : index);
        const indexes = [index];
        let primary;
        const groupKey = String((_b = datum.group) !== null && _b !== void 0 ? _b : '');
        if (groupKey) {
            let groupIndex = colorGroupIndexMap.get(groupKey);
            if (groupIndex == null) {
                groupIndex = nextColorGroupIndex;
                colorGroupIndexMap.set(groupKey, groupIndex);
                nextColorGroupIndex += 1;
            }
            primary = getPaletteColor(options, [groupIndex]);
        }
        else {
            primary = getPaletteColor(options, indexes);
        }
        const themeColors = primary
            ? getThemeColors({ colorPrimary: primary }, options)
            : undefined;
        if (primary) {
            nodeColorMap.set(id, primary);
        }
        const bounds = getElementBounds(_jsx(Item, { indexes: indexes, data: data, datum: datum, positionH: "center", positionV: "middle", themeColors: themeColors }));
        nodeSizeMap.set(id, bounds);
        nodeMetaMap.set(id, { id, indexes, datum, themeColors });
        nodeIdsByIndex.set(index, id);
        nodeIdSet.add(id);
        return { id, parentId: datum.parentId };
    });
    const resolveNodeId = (value) => {
        if (value == null)
            return null;
        const direct = String(value);
        if (nodeIdSet.has(direct))
            return direct;
        const asIndex = Number(value);
        if (!Number.isNaN(asIndex)) {
            const mapped = nodeIdsByIndex.get(asIndex);
            if (mapped)
                return mapped;
        }
        return null;
    };
    const edges = relations
        .map((relation, index) => {
        const source = resolveNodeId(relation.from);
        const target = resolveNodeId(relation.to);
        if (!source || !target)
            return null;
        return {
            id: relation.id ? String(relation.id) : `edge-${index}`,
            source,
            target,
            relation,
        };
    })
        .filter(Boolean);
    const hasCycle = checkUndirectedCycle(Array.from(nodeIdSet), edges);
    const finalEdgeRouting = hasCycle ? 'dagre' : edgeRouting;
    const layout = new DagreLayout({
        rankdir,
        nodesep,
        ranksep,
        edgesep,
        controlPoints: true,
        nodeSize: (node) => {
            var _a;
            const id = String((_a = node.id) !== null && _a !== void 0 ? _a : '');
            const bounds = nodeSizeMap.get(id);
            return bounds ? [bounds.width, bounds.height] : [0, 0];
        },
    });
    layout.execute({ nodes, edges });
    const nodeLayouts = [];
    layout.forEachNode((node) => {
        var _a, _b, _c, _d;
        const id = String(node.id);
        const meta = nodeMetaMap.get(id);
        if (!meta)
            return;
        const bounds = nodeSizeMap.get(id);
        const width = (_a = bounds === null || bounds === void 0 ? void 0 : bounds.width) !== null && _a !== void 0 ? _a : 0;
        const height = (_b = bounds === null || bounds === void 0 ? void 0 : bounds.height) !== null && _b !== void 0 ? _b : 0;
        const x = ((_c = node.x) !== null && _c !== void 0 ? _c : 0) - width / 2;
        const y = ((_d = node.y) !== null && _d !== void 0 ? _d : 0) - height / 2;
        nodeLayouts.push(Object.assign(Object.assign({}, meta), { x,
            y,
            width,
            height, centerX: x + width / 2, centerY: y + height / 2 }));
    });
    if (nodeLayouts.length === 0) {
        return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsx(Group, { children: _jsx(BtnAdd, { indexes: [0], x: 0, y: 0 }) })] }));
    }
    const minX = Math.min(...nodeLayouts.map((node) => node.x));
    const minY = Math.min(...nodeLayouts.map((node) => node.y));
    const offsetX = padding - minX;
    const offsetY = padding - minY;
    const nodeLayoutById = new Map();
    const itemElements = [];
    nodeLayouts.forEach((node) => {
        const displayX = node.x + offsetX;
        const displayY = node.y + offsetY;
        const positionH = rankdir === 'LR' ? 'normal' : rankdir === 'RL' ? 'flipped' : 'center';
        const positionV = rankdir === 'TB' ? 'normal' : rankdir === 'BT' ? 'flipped' : 'middle';
        itemElements.push(_jsx(Item, { indexes: node.indexes, datum: node.datum, data: data, x: displayX, y: displayY, positionH: positionH, positionV: positionV, themeColors: node.themeColors }));
        nodeLayoutById.set(node.id, Object.assign(Object.assign({}, node), { x: displayX, y: displayY, centerX: displayX + node.width / 2, centerY: displayY + node.height / 2 }));
    });
    const defsElements = [];
    const decorElements = [];
    if (showConnections) {
        const defaultStroke = getColorPrimary(options);
        const themeColors = getThemeColors(options.themeConfig, options);
        const labelBackground = (_a = themeColors === null || themeColors === void 0 ? void 0 : themeColors.colorBg) !== null && _a !== void 0 ? _a : '#ffffff';
        const labelTextColor = (_b = themeColors === null || themeColors === void 0 ? void 0 : themeColors.colorText) !== null && _b !== void 0 ? _b : defaultStroke;
        const arrowSize = Math.max(10, edgeWidth * 4);
        const isVertical = rankdir === 'TB' || rankdir === 'BT';
        const enableAnimation = edgeAnimation === 'ant-line';
        const animationDashArray = enableAnimation ? edgeDashPattern : '';
        const staticDashArray = !enableAnimation && edgeStyle === 'dashed' ? edgeDashPattern : '';
        const actualDashArray = enableAnimation
            ? animationDashArray
            : staticDashArray;
        const dashPatternLength = enableAnimation
            ? animationDashArray
                .split(',')
                .reduce((sum, val) => sum + parseFloat(val.trim() || '0'), 0)
            : 0;
        const animationDuration = enableAnimation && dashPatternLength > 0
            ? `${dashPatternLength / (edgeAnimationSpeed * 10)}s`
            : '1s';
        const straightCornerRadius = edgeCornerRadius;
        const getOrthEdgeEndpoints = (sourceId, targetId) => {
            const source = nodeLayoutById.get(sourceId);
            const target = nodeLayoutById.get(targetId);
            if (!source || !target)
                return null;
            if (rankdir === 'TB') {
                return {
                    start: [source.centerX, source.y + source.height],
                    end: [target.centerX, target.y],
                };
            }
            if (rankdir === 'BT') {
                return {
                    start: [source.centerX, source.y],
                    end: [target.centerX, target.y + target.height],
                };
            }
            if (rankdir === 'LR') {
                return {
                    start: [source.x + source.width, source.centerY],
                    end: [target.x, target.centerY],
                };
            }
            return {
                start: [source.x, source.centerY],
                end: [target.x + target.width, target.centerY],
            };
        };
        const getOrthEdgePoints = (sourceId, targetId) => {
            const endpoints = getOrthEdgeEndpoints(sourceId, targetId);
            if (!endpoints)
                return null;
            const { start, end } = endpoints;
            if (isVertical) {
                const midY = start[1] + (end[1] - start[1]) / 2;
                return {
                    start,
                    end,
                    points: [start, [start[0], midY], [end[0], midY], end],
                };
            }
            const midX = start[0] + (end[0] - start[0]) / 2;
            return {
                start,
                end,
                points: [start, [midX, start[1]], [midX, end[1]], end],
            };
        };
        layout.forEachEdge((edge) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const normalizePoints = (rawPoints) => {
                if (!Array.isArray(rawPoints))
                    return [];
                return rawPoints
                    .map((point) => {
                    if (!point)
                        return null;
                    if (Array.isArray(point) && point.length >= 2) {
                        return [Number(point[0]), Number(point[1])];
                    }
                    return null;
                })
                    .filter((point) => !!point && Number.isFinite(point[0]) && Number.isFinite(point[1]));
            };
            const fallbackPoints = () => {
                const source = nodeLayoutById.get(String(edge.source));
                const target = nodeLayoutById.get(String(edge.target));
                if (!source || !target)
                    return [];
                return [
                    [source.centerX - offsetX, source.centerY - offsetY],
                    [target.centerX - offsetX, target.centerY - offsetY],
                ];
            };
            const useOrthRouting = finalEdgeRouting === 'orth';
            const orthEdge = useOrthRouting
                ? getOrthEdgePoints(String(edge.source), String(edge.target))
                : null;
            const normalized = useOrthRouting ? [] : normalizePoints(edge.points);
            const points = useOrthRouting
                ? ((_a = orthEdge === null || orthEdge === void 0 ? void 0 : orthEdge.points) !== null && _a !== void 0 ? _a : [])
                : normalized.length
                    ? normalized
                    : fallbackPoints();
            if (!points.length)
                return;
            const pointsOffsetX = useOrthRouting ? 0 : offsetX;
            const pointsOffsetY = useOrthRouting ? 0 : offsetY;
            const startPoint = useOrthRouting
                ? ((_b = orthEdge === null || orthEdge === void 0 ? void 0 : orthEdge.start) !== null && _b !== void 0 ? _b : points[0])
                : points[0];
            const endPoint = useOrthRouting
                ? ((_c = orthEdge === null || orthEdge === void 0 ? void 0 : orthEdge.end) !== null && _c !== void 0 ? _c : points[points.length - 1])
                : points[points.length - 1];
            const relation = (_d = edge._original) === null || _d === void 0 ? void 0 : _d.relation;
            const sourceColor = (_e = nodeColorMap.get(String(edge.source))) !== null && _e !== void 0 ? _e : defaultStroke;
            const targetColor = (_f = nodeColorMap.get(String(edge.target))) !== null && _f !== void 0 ? _f : defaultStroke;
            const gradientKey = `edge-gradient-${String(sourceColor)}-${String(targetColor)}`.replace(/[^a-zA-Z0-9_-]/g, '');
            const edgeStroke = edgeColorMode === 'gradient' ? `url(#${gradientKey})` : defaultStroke;
            let pathD = '';
            if (straightCornerRadius > 0) {
                pathD = createRoundedPath(points, straightCornerRadius, pointsOffsetX, pointsOffsetY);
            }
            else {
                pathD = createStraightPath(points, pointsOffsetX, pointsOffsetY);
            }
            if (!pathD)
                return;
            const pathElement = (_jsx(Path, { d: pathD, stroke: edgeStroke, strokeWidth: edgeWidth, strokeDasharray: actualDashArray, fill: "none", "data-element-type": "shape", children: enableAnimation && (_jsx("animate", { attributeName: "stroke-dashoffset", from: String(dashPatternLength), to: "0", dur: animationDuration, repeatCount: "indefinite" })) }));
            decorElements.push(pathElement);
            if (edgeColorMode === 'gradient') {
                const start = startPoint;
                const end = endPoint;
                defsElements.push(_jsxs("linearGradient", { id: gradientKey, gradientUnits: "userSpaceOnUse", x1: start[0] + pointsOffsetX, y1: start[1] + pointsOffsetY, x2: end[0] + pointsOffsetX, y2: end[1] + pointsOffsetY, children: [_jsx("stop", { offset: "0%", stopColor: sourceColor }), _jsx("stop", { offset: "100%", stopColor: targetColor })] }));
            }
            if (relation === null || relation === void 0 ? void 0 : relation.label) {
                let labelPoint = null;
                const midPoint = getMidPoint(points);
                if (midPoint) {
                    labelPoint = [
                        midPoint[0] + pointsOffsetX,
                        midPoint[1] + pointsOffsetY,
                    ];
                }
                if (labelPoint) {
                    const labelText = String(relation.label);
                    const labelBounds = getElementBounds(_jsx(Text, { fontSize: 14, fontWeight: "normal", children: labelText }));
                    const labelX = labelPoint[0] - labelBounds.width / 2;
                    const labelY = labelPoint[1] - labelBounds.height / 2;
                    decorElements.push(_jsx(Text, { x: labelX, y: labelY, width: labelBounds.width, height: labelBounds.height, fontSize: 14, fontWeight: "normal", alignHorizontal: "center", alignVertical: "middle", fill: labelTextColor, backgroundColor: labelBackground, children: labelText }));
                }
            }
            const effectiveShowArrow = (_g = relation === null || relation === void 0 ? void 0 : relation.showArrow) !== null && _g !== void 0 ? _g : showArrow;
            const direction = (_h = relation === null || relation === void 0 ? void 0 : relation.direction) !== null && _h !== void 0 ? _h : 'forward';
            const edgeArrowType = (_j = relation === null || relation === void 0 ? void 0 : relation.arrowType) !== null && _j !== void 0 ? _j : arrowType;
            const lastIndex = points.length - 1;
            if (effectiveShowArrow && points.length > 1) {
                if (direction === 'forward' || direction === 'both') {
                    const head = points[lastIndex];
                    const tail = points[lastIndex - 1];
                    const angle = Math.atan2(head[1] - tail[1], head[0] - tail[0]);
                    const arrowFill = edgeColorMode === 'gradient' ? targetColor : defaultStroke;
                    const arrowElements = createArrowElements(head[0] + pointsOffsetX, head[1] + pointsOffsetY, angle, edgeArrowType, arrowFill, edgeWidth, arrowSize);
                    decorElements.push(...arrowElements);
                }
                if (direction === 'both') {
                    const head = points[0];
                    const tail = points[1];
                    const angle = Math.atan2(head[1] - tail[1], head[0] - tail[0]);
                    const arrowFill = edgeColorMode === 'gradient' ? sourceColor : defaultStroke;
                    const arrowElements = createArrowElements(head[0] + pointsOffsetX, head[1] + pointsOffsetY, angle, edgeArrowType, arrowFill, edgeWidth, arrowSize);
                    decorElements.push(...arrowElements);
                }
            }
        });
    }
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { children: [_jsx(Defs, { children: defsElements }), _jsx(Group, { width: 0, height: 0, children: decorElements }), _jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, {})] })] }));
};
registerStructure('relation-dagre-flow', {
    component: RelationDagreFlow,
    composites: ['title', 'item'],
});
