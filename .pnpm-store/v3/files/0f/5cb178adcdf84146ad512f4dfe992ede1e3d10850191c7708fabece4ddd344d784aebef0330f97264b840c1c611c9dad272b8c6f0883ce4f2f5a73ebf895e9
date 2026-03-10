import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import * as d3 from 'd3';
import { Defs, Ellipse, getElementBounds, Group, Path, Polygon, } from '../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup, ShapesGroup, } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { getColorPrimary, getHierarchyColorIndexes, getItemComponent, getPaletteColor, getThemeColors, } from '../utils/index.js';
import { registerStructure } from './registry.js';
const distributedPadding = (rawPadding, size) => {
    const maxPadding = Math.max(0, size / 2 - 1);
    return Math.min(rawPadding, maxPadding);
};
export const HierarchyTree = (props) => {
    const { Title, Items, data, 
    // 布局配置
    levelGap = 80, nodeGap = 60, 
    // 连接线样式配置
    edgeType = 'straight', edgeColorMode = 'gradient', edgeWidth = 3, edgeStyle = 'solid', edgeDashPattern = '5,5', edgeCornerRadius = 0, 
    // 连接线位置配置
    edgeOffset = 0, edgeOrigin = 'center', edgeOriginPadding = 20, 
    // 装饰元素配置
    edgeMarker = 'none', markerSize = 12, 
    // 着色模式配置
    colorMode = 'branch', 
    // 布局方向
    orientation = 'top-bottom', options, } = props;
    const isHorizontal = orientation === 'left-right' || orientation === 'right-left';
    const mainSign = orientation === 'bottom-top' || orientation === 'right-left' ? -1 : 1;
    const { title, desc } = data;
    const colorPrimary = getColorPrimary(options);
    const groupColorIndexMap = new Map();
    let nextGroupColorIndex = 0;
    // 内置工具方法：数据预处理
    const normalizeItems = (items) => {
        var _a;
        const list = [...items];
        if (!((_a = list[0]) === null || _a === void 0 ? void 0 : _a.children)) {
            list[0] = Object.assign(Object.assign({}, list[0]), { children: list.slice(1) });
            list.splice(1);
        }
        return list;
    };
    // 内置工具方法：生成圆角路径
    const createRoundedPath = (x1, y1, x2, y2, radius, direction = 'vertical') => {
        const isVertical = direction === 'vertical';
        const deltaMain = isVertical ? y2 - y1 : x2 - x1;
        const deltaCross = isVertical ? x2 - x1 : y2 - y1;
        const signMain = deltaMain === 0 ? 1 : Math.sign(deltaMain);
        const signCross = deltaCross === 0 ? 1 : Math.sign(deltaCross);
        const midMain = isVertical ? y1 + deltaMain / 2 : x1 + deltaMain / 2;
        const effectiveRadius = Math.min(radius, Math.abs(deltaMain) / 2, Math.abs(deltaCross) / 2);
        if (effectiveRadius === 0) {
            return isVertical
                ? `M ${x1} ${y1} L ${x1} ${midMain} L ${x2} ${midMain} L ${x2} ${y2}`
                : `M ${x1} ${y1} L ${midMain} ${y1} L ${midMain} ${y2} L ${x2} ${y2}`;
        }
        if (isVertical) {
            return `M ${x1} ${y1}
              L ${x1} ${midMain - signMain * effectiveRadius}
              Q ${x1} ${midMain} ${x1 + signCross * effectiveRadius} ${midMain}
              L ${x2 - signCross * effectiveRadius} ${midMain}
              Q ${x2} ${midMain} ${x2} ${midMain + signMain * effectiveRadius}
              L ${x2} ${y2}`;
        }
        return `M ${x1} ${y1}
            L ${midMain - signMain * effectiveRadius} ${y1}
            Q ${midMain} ${y1} ${midMain} ${y1 + signCross * effectiveRadius}
            L ${midMain} ${y2 - signCross * effectiveRadius}
            Q ${midMain} ${y2} ${midMain + signMain * effectiveRadius} ${y2}
            L ${x2} ${y2}`;
    };
    const getLayoutPoint = (node) => {
        const { x, y } = node;
        return isHorizontal ? { x: y * mainSign, y: x } : { x, y: y * mainSign };
    };
    const getNodeRect = (node, bounds, offsets) => {
        const { x, y } = getLayoutPoint(node);
        const centerX = x + offsets.x;
        const top = y + offsets.y;
        const centerY = top + bounds.height / 2;
        return {
            centerX,
            centerY,
            left: centerX - bounds.width / 2,
            right: centerX + bounds.width / 2,
            top,
            bottom: top + bounds.height,
        };
    };
    // 内置工具方法：构建层级数据
    const buildHierarchyData = (list) => {
        var _a;
        if (!list.length)
            return null;
        const rootItem = list[0];
        const buildNode = (node, parentIndexes = [], idx = 0) => {
            var _a, _b;
            const indexes = [...parentIndexes, idx];
            return Object.assign(Object.assign({}, node), { _originalIndex: indexes, _depth: indexes.length - 1, children: (_b = (_a = node.children) === null || _a === void 0 ? void 0 : _a.map((c, i) => buildNode(c, indexes, i))) !== null && _b !== void 0 ? _b : [] });
        };
        return ((_a = rootItem.children) === null || _a === void 0 ? void 0 : _a.length)
            ? buildNode(rootItem)
            : Object.assign(Object.assign({}, rootItem), { _originalIndex: [0], _depth: 0, children: list.slice(1).map((child, i) => (Object.assign(Object.assign({}, child), { _originalIndex: [i + 1], _depth: 1 }))) });
    };
    // 内置工具方法：计算各层节点边界
    const computeLevelBounds = (rootNode) => {
        var _a, _b;
        let maxWidth = 0, maxHeight = 0;
        const levelBounds = new Map();
        const sampleDatumByLevel = new Map();
        // 记录每个深度遇到的首个节点，用于计算该层的尺寸
        rootNode.each((node) => {
            if (!sampleDatumByLevel.has(node.depth)) {
                sampleDatumByLevel.set(node.depth, node.data);
            }
        });
        for (let level = 0; level < rootNode.height + 1; level++) {
            const ItemComponent = getItemComponent(Items, level);
            const sampleDatum = (_a = sampleDatumByLevel.get(level)) !== null && _a !== void 0 ? _a : {};
            const indexes = (_b = sampleDatum._originalIndex) !== null && _b !== void 0 ? _b : Array(level + 1).fill(0);
            const bounds = getElementBounds(_jsx(ItemComponent, { indexes: indexes, data: data, datum: sampleDatum, positionH: "center" }));
            levelBounds.set(level, bounds);
            maxWidth = Math.max(maxWidth, bounds.width);
            maxHeight = Math.max(maxHeight, bounds.height);
        }
        return { levelBounds, maxWidth, maxHeight };
    };
    const getNodeColorIndexes = (nodeData, depth) => {
        var _a;
        if (colorMode === 'group') {
            const groupKey = String((_a = nodeData === null || nodeData === void 0 ? void 0 : nodeData.group) !== null && _a !== void 0 ? _a : '');
            let groupIndex = groupColorIndexMap.get(groupKey);
            if (groupIndex == null) {
                groupIndex = nextGroupColorIndex;
                groupColorIndexMap.set(groupKey, groupIndex);
                nextGroupColorIndex += 1;
            }
            return [groupIndex];
        }
        return getHierarchyColorIndexes({
            depth,
            originalIndexes: nodeData._originalIndex,
            flatIndex: nodeData._flatIndex,
        }, colorMode);
    };
    // 内置工具方法：渲染单个节点
    const renderNode = (node, levelBounds, btnBounds, offsets, gradientDefs, allNodes) => {
        const { depth, data: nodeData, parent } = node;
        const indexes = nodeData._originalIndex;
        const NodeComponent = getItemComponent(Items, depth);
        const bounds = levelBounds.get(depth);
        const nodeRect = getNodeRect(node, bounds, offsets);
        const nodeX = nodeRect.left;
        const nodeY = nodeRect.top;
        const elements = {
            items: [],
            btns: [],
            deco: [],
        };
        // 计算节点颜色
        const colorIndexes = getNodeColorIndexes(nodeData, depth);
        const nodeColor = getPaletteColor(options, colorIndexes);
        const nodeThemeColors = getThemeColors({
            colorPrimary: nodeColor,
        }, options);
        // 节点本体
        elements.items.push(_jsx(NodeComponent, { indexes: indexes, datum: nodeData, data: data, x: nodeX, y: nodeY, positionH: "center", themeColors: nodeThemeColors }));
        // 删除和添加按钮
        elements.btns.push(_jsx(BtnRemove, { indexes: indexes, x: nodeX + (bounds.width - btnBounds.width) / 2, y: nodeY + bounds.height + 5 }), _jsx(BtnAdd, { indexes: [...indexes, 0], x: nodeX + (bounds.width - btnBounds.width) / 2, y: nodeY + bounds.height + btnBounds.height + 10 }));
        // 父子连线
        if (parent) {
            const parentBounds = levelBounds.get(parent.depth);
            const parentRect = getNodeRect(parent, parentBounds, offsets);
            // 计算父节点的子节点数量和当前节点在兄弟中的索引
            const siblings = allNodes.filter((n) => n.parent === parent);
            const siblingIndex = siblings.findIndex((s) => s === node);
            const siblingCount = siblings.length;
            // 计算连接线起点
            let parentX;
            let parentY;
            if (edgeOrigin === 'distributed' && siblingCount > 1) {
                // 分布式起点：根据子节点数量分配起点位置
                if (isHorizontal) {
                    const padding = distributedPadding(edgeOriginPadding, parentBounds.height);
                    const startY = parentRect.top + padding;
                    const endY = parentRect.bottom - padding;
                    const segmentHeight = (endY - startY) / siblingCount;
                    parentY = startY + segmentHeight * siblingIndex + segmentHeight / 2;
                    parentX =
                        (mainSign > 0 ? parentRect.right : parentRect.left) +
                            edgeOffset * mainSign;
                }
                else {
                    const padding = distributedPadding(edgeOriginPadding, parentBounds.width);
                    const startX = parentRect.left + padding;
                    const endX = parentRect.right - padding;
                    const segmentWidth = (endX - startX) / siblingCount;
                    parentX = startX + segmentWidth * siblingIndex + segmentWidth / 2;
                    parentY =
                        (mainSign > 0 ? parentRect.bottom : parentRect.top) +
                            edgeOffset * mainSign;
                }
            }
            else {
                // 中心起点：所有线从节点中心出发
                parentX = isHorizontal
                    ? (mainSign > 0 ? parentRect.right : parentRect.left) +
                        edgeOffset * mainSign
                    : parentRect.centerX;
                parentY = isHorizontal
                    ? parentRect.centerY
                    : (mainSign > 0 ? parentRect.bottom : parentRect.top) +
                        edgeOffset * mainSign;
            }
            const baseChildX = isHorizontal
                ? (mainSign > 0 ? nodeRect.left : nodeRect.right) -
                    edgeOffset * mainSign
                : nodeRect.centerX;
            const baseChildY = isHorizontal
                ? nodeRect.centerY
                : (mainSign > 0 ? nodeRect.top : nodeRect.bottom) -
                    edgeOffset * mainSign;
            let childX = baseChildX;
            let childY = baseChildY;
            // 调整终点位置（为箭头留出空间）
            if (edgeMarker === 'arrow') {
                if (isHorizontal) {
                    childX -= markerSize * mainSign;
                }
                else {
                    childY -= markerSize * mainSign;
                }
            }
            // 生成路径
            let pathD;
            if (edgeType === 'curved') {
                // 使用贝塞尔曲线绘制曲线连接
                if (isHorizontal) {
                    const midX = parentX + (childX - parentX) / 2;
                    pathD = `M ${parentX} ${parentY} C ${midX} ${parentY}, ${midX} ${childY}, ${childX} ${childY}`;
                }
                else {
                    const midY = parentY + (childY - parentY) / 2;
                    pathD = `M ${parentX} ${parentY} C ${parentX} ${midY}, ${childX} ${midY}, ${childX} ${childY}`;
                }
            }
            else if (edgeCornerRadius > 0) {
                // 使用圆角路径
                pathD = createRoundedPath(parentX, parentY, childX, childY, edgeCornerRadius, isHorizontal ? 'horizontal' : 'vertical');
            }
            else {
                // 使用直角折线
                if (isHorizontal) {
                    const midX = parentX + (childX - parentX) / 2;
                    pathD = `M ${parentX} ${parentY} L ${midX} ${parentY} L ${midX} ${childY} L ${childX} ${childY}`;
                }
                else {
                    const midY = parentY + (childY - parentY) / 2;
                    pathD = `M ${parentX} ${parentY} L ${parentX} ${midY} L ${childX} ${midY} L ${childX} ${childY}`;
                }
            }
            // 确定连接线颜色
            let strokeColor = colorPrimary;
            if (edgeColorMode === 'gradient') {
                // 使用渐变色
                const parentColorIndexes = getNodeColorIndexes(parent.data, parent.depth);
                const childColorIndexes = getNodeColorIndexes(nodeData, depth);
                const parentColor = getPaletteColor(options, parentColorIndexes);
                const childColor = getPaletteColor(options, childColorIndexes);
                const gradientId = `gradient-${parent.data._originalIndex.join('-')}-${indexes.join('-')}`;
                gradientDefs.push(_jsxs("linearGradient", { id: gradientId, x1: parentX, y1: parentY, x2: childX, y2: childY, gradientUnits: "userSpaceOnUse", children: [_jsx("stop", { offset: "0%", stopColor: parentColor }), _jsx("stop", { offset: "100%", stopColor: childColor })] }));
                strokeColor = `url(#${gradientId})`;
            }
            // 确定虚线样式
            const dashArray = edgeStyle === 'dashed' ? edgeDashPattern : '';
            // 绘制连接线
            elements.deco.push(_jsx(Path, { d: pathD, stroke: strokeColor, strokeWidth: edgeWidth, strokeDasharray: dashArray, fill: "none" }));
            // 添加箭头
            if (edgeMarker === 'arrow') {
                const arrowColor = edgeColorMode === 'gradient'
                    ? getPaletteColor(options, colorIndexes)
                    : getColorPrimary(options);
                // 三角形箭头
                const arrowPoints = isHorizontal
                    ? [
                        { x: baseChildX, y: baseChildY },
                        {
                            x: baseChildX - markerSize * mainSign,
                            y: baseChildY - markerSize / 2,
                        },
                        {
                            x: baseChildX - markerSize * mainSign,
                            y: baseChildY + markerSize / 2,
                        },
                    ]
                    : [
                        { x: baseChildX, y: baseChildY },
                        {
                            x: baseChildX - markerSize / 2,
                            y: baseChildY - markerSize * mainSign,
                        },
                        {
                            x: baseChildX + markerSize / 2,
                            y: baseChildY - markerSize * mainSign,
                        },
                    ];
                elements.deco.push(_jsx(Polygon, { points: arrowPoints, fill: arrowColor, width: markerSize, height: markerSize }));
            }
            // 添加连接点装饰
            if (edgeMarker === 'dot') {
                const parentColorIndexes = getNodeColorIndexes(parent.data, parent.depth);
                const parentDotColor = edgeColorMode === 'gradient'
                    ? getPaletteColor(options, parentColorIndexes)
                    : getColorPrimary(options);
                // 父节点连接点
                elements.deco.push(_jsx(Ellipse, { x: (isHorizontal
                        ? mainSign > 0
                            ? parentRect.right + edgeOffset
                            : parentRect.left - edgeOffset
                        : parentX) - markerSize, y: (isHorizontal
                        ? parentY
                        : mainSign > 0
                            ? parentRect.bottom + edgeOffset
                            : parentRect.top - edgeOffset) - markerSize, width: markerSize * 2, height: markerSize * 2, fill: parentDotColor }));
                // 子节点连接点
                const childDotColor = edgeColorMode === 'gradient'
                    ? getPaletteColor(options, colorIndexes)
                    : getColorPrimary(options);
                elements.deco.push(_jsx(Ellipse, { x: baseChildX - markerSize, y: baseChildY - markerSize, width: markerSize * 2, height: markerSize * 2, fill: childDotColor }));
            }
        }
        return elements;
    };
    // 内置工具方法：渲染兄弟节点间按钮
    const renderSiblingBtns = (nodes, btnBounds, offsets) => {
        const nodesByParent = new Map();
        nodes.forEach((node) => {
            var _a;
            const key = node.parent
                ? node.parent.data._originalIndex.join('-')
                : 'root';
            ((_a = nodesByParent.get(key)) !== null && _a !== void 0 ? _a : nodesByParent.set(key, []).get(key)).push(node);
        });
        const btns = [];
        nodesByParent.forEach((siblings) => {
            if (siblings.length <= 1)
                return;
            const sorted = siblings
                .slice()
                .sort((a, b) => isHorizontal
                ? getLayoutPoint(a).y - getLayoutPoint(b).y
                : getLayoutPoint(a).x - getLayoutPoint(b).x);
            if (sorted.length === 0)
                return;
            for (let i = 0; i < sorted.length - 1; i++) {
                const current = getLayoutPoint(sorted[i]);
                const next = getLayoutPoint(sorted[i + 1]);
                const parentIndexes = sorted[i].data._originalIndex.slice(0, -1);
                const insertIndex = sorted[i].data._originalIndex.at(-1) + 1;
                if (isHorizontal) {
                    const btnX = current.x +
                        offsets.x +
                        (mainSign > 0 ? -btnBounds.width - 5 : btnBounds.width + 5);
                    const btnY = (current.y + next.y) / 2 + offsets.y - btnBounds.height / 2;
                    btns.push(_jsx(BtnAdd, { indexes: [...parentIndexes, insertIndex], x: btnX, y: btnY }));
                }
                else {
                    const siblingY = current.y + offsets.y - btnBounds.height - 5;
                    const btnX = (current.x + next.x) / 2 + offsets.x - btnBounds.width / 2;
                    btns.push(_jsx(BtnAdd, { indexes: [...parentIndexes, insertIndex], x: btnX, y: siblingY }));
                }
            }
        });
        return btns;
    };
    // 主逻辑
    const items = normalizeItems(data.items);
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    const btnBounds = getElementBounds(_jsx(BtnAdd, { indexes: [0] }));
    // 空状态处理
    if (!items.length) {
        return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsx(Group, { children: _jsx(BtnsGroup, { children: _jsx(BtnAdd, { indexes: [0], x: -btnBounds.width / 2, y: -btnBounds.height / 2 }) }) })] }));
    }
    // 构建和布局
    const hierarchyData = buildHierarchyData(items);
    const root = d3.hierarchy(hierarchyData);
    const { levelBounds, maxWidth, maxHeight } = computeLevelBounds(root);
    const treeLayout = d3
        .tree()
        .nodeSize(isHorizontal
        ? [maxHeight + nodeGap, maxWidth + levelGap]
        : [maxWidth + nodeGap, maxHeight + levelGap])
        .separation(() => 1);
    const nodes = treeLayout(root).descendants();
    // 计算偏移量
    const layoutPoints = nodes.map((d) => getLayoutPoint(d));
    const minX = Math.min(...layoutPoints.map((d) => d.x));
    const minY = Math.min(...layoutPoints.map((d) => d.y));
    const offsets = {
        x: Math.max(0, -minX + maxWidth / 2),
        y: Math.max(0, -minY + btnBounds.height + 10),
    };
    // 收集所有渲染元素
    const itemElements = [];
    const btnElements = [];
    const decoElements = [];
    const gradientDefs = [];
    // 为 node-flat 模式添加扁平索引
    nodes.forEach((node, index) => {
        // 将扁平索引附加到节点数据上，用于 node-flat 模式
        node.data._flatIndex = index;
        const { x, y } = getLayoutPoint(node);
        node.__layout = { x, y };
    });
    nodes.forEach((node) => {
        const { items, btns, deco } = renderNode(node, levelBounds, btnBounds, offsets, gradientDefs, nodes);
        itemElements.push(...items);
        btnElements.push(...btns);
        decoElements.push(...deco);
    });
    btnElements.push(...renderSiblingBtns(nodes, btnBounds, offsets));
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { children: [gradientDefs.length > 0 && _jsx(Defs, { children: gradientDefs }), _jsx(ShapesGroup, { children: decoElements }), _jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('hierarchy-tree', {
    component: HierarchyTree,
    composites: ['title', 'item'],
});
