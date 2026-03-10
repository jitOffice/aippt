"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceInteractionFlow = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const DEFAULT_LANE_GAP = 350;
const DEFAULT_NODE_GAP = 80;
const DEFAULT_LIFELINE_WIDTH = 2;
const DEFAULT_ARROW_WIDTH = 2;
const DEFAULT_PADDING = 40;
const DEFAULT_LANE_HEADER_HEIGHT = 60;
const DEFAULT_ITEM_WIDTH = 120;
const DEFAULT_ITEM_HEIGHT = 50;
const FONT_SIZE = 14;
const ARROW_SIZE = 14;
const CORNER_RADIUS_NODE = 6;
const LIFELINE_MASK_GAP = 2;
const LANE_PADDING = 60;
const BTN_HALF_SIZE = 12;
const BTN_MARGIN = 10;
const BTN_LANE_ADD_Gap = 20;
const BOTTOM_AREA_HEIGHT = 60;
const LANE_HEADER_MARGIN = 10;
const LABEL_OFFSET_Y = 10;
const FIRST_GAP = 20;
const PATH_OFFSET = 40;
const calculateEdgePath = (fromId, toId, fromLayout, toLayout, edgeMap, fromOutDegree, toInDegree, fromInDegree, toOutDegree) => {
    const fromAnchors = (0, utils_1.getNodesAnchors)(fromLayout);
    const toAnchors = (0, utils_1.getNodesAnchors)(toLayout);
    const reverseKey = `${toId}-${fromId}`;
    const hasReverse = edgeMap.has(reverseKey);
    const isStartLane = fromLayout.laneIndex === 0;
    let points = [];
    if (fromId === toId) {
        // 1. 自连接 (A->A)
        //  RT -> Right Arc -> RB
        const start = isStartLane ? fromAnchors.LT : fromAnchors.RT;
        const end = isStartLane ? fromAnchors.LB : fromAnchors.RB;
        const offset = isStartLane ? -PATH_OFFSET : PATH_OFFSET;
        points = [
            [start.x, start.y],
            [start.x + offset, start.y],
            [end.x + offset, end.y],
            [end.x, end.y],
        ];
    }
    else if (fromLayout.laneIndex === toLayout.laneIndex) {
        // 2. 同泳道回环 (Bottom -> Top)
        const start = isStartLane ? fromAnchors.LB : fromAnchors.RB;
        const end = isStartLane ? toAnchors.LT : toAnchors.RT;
        const offset = isStartLane ? -PATH_OFFSET : PATH_OFFSET;
        points = [
            [start.x, start.y],
            [start.x + offset, start.y],
            [end.x + offset, end.y],
            [end.x, end.y],
        ];
    }
    else {
        // 3. 互连 & 单向连接
        const isToRight = toLayout.centerX > fromLayout.centerX;
        const isToLeft = toLayout.centerX < fromLayout.centerX;
        const isSameY = Math.abs(fromLayout.centerY - toLayout.centerY) < 1;
        const isTargetBelow = toLayout.centerY > fromLayout.centerY;
        const isTargetStrictRight = toLayout.x >= fromLayout.x + fromLayout.width;
        let startPoint;
        let endPoint;
        // 优先处理同行情况
        if (isSameY) {
            startPoint = isToRight ? fromAnchors.RC : fromAnchors.LC;
            endPoint = isToRight ? toAnchors.LC : toAnchors.RC;
        }
        // 处理互连情况 (避免重叠，使用对角锚点)
        else if (hasReverse) {
            if (isTargetBelow) {
                startPoint = isToRight ? fromAnchors.RB : fromAnchors.LT;
                endPoint = isToRight ? toAnchors.LT : toAnchors.RB;
            }
            else {
                startPoint = isToRight ? fromAnchors.RT : fromAnchors.LT;
                endPoint = isToRight ? toAnchors.LB : toAnchors.RB;
            }
        }
        // 处理普通单向连接
        else {
            // 1. 确定终点 (End Point)
            if (toInDegree === 1 && toOutDegree === 0) {
                endPoint = isToRight ? toAnchors.LC : toAnchors.RC;
            }
            else if (isTargetBelow) {
                endPoint = isTargetStrictRight ? toAnchors.LT : toAnchors.RT;
            }
            else {
                endPoint = isTargetStrictRight ? toAnchors.LB : toAnchors.RB;
            }
            // 2. 确定起点 (Start Point)
            if (fromOutDegree === 1 && fromInDegree === 0) {
                startPoint = isToRight ? fromAnchors.RC : fromAnchors.LC;
            }
            else if (isToRight) {
                startPoint = fromAnchors.RB;
            }
            else if (isToLeft) {
                startPoint = fromAnchors.LB;
            }
            else {
                startPoint = fromAnchors.RB;
            }
        }
        if (hasReverse && !isSameY) {
            // 1. 跨行（不同 Y 轴）的双向连接
            const startArr = [startPoint.x, startPoint.y];
            const endArr = [endPoint.x, endPoint.y];
            const cx = (startArr[0] + endArr[0]) / 2;
            const cy = startArr[1];
            points = [startArr, [cx, cy], endArr];
        }
        else if (hasReverse && isSameY) {
            // 2. 同行（相同 Y 轴）的双向连接
            const startArr = [startPoint.x, startPoint.y];
            const endArr = [endPoint.x, endPoint.y];
            const midX = (startArr[0] + endArr[0]) / 2;
            const midY = (startArr[1] + endArr[1]) / 2;
            const offsetY = 30;
            const isL2R = startArr[0] < endArr[0];
            const cpY = isL2R ? midY - offsetY : midY + offsetY;
            points = [startArr, [midX, cpY], endArr];
        }
        else {
            // 3. 普通单向连接
            points = [
                [startPoint.x, startPoint.y],
                [endPoint.x, endPoint.y],
            ];
        }
    }
    return { points };
};
const SequenceInteractionFlow = (props) => {
    var _a, _b, _c, _d, _e, _f, _g;
    // 生成实例级唯一ID以避免多图表冲突
    const instanceId = Math.random().toString(36).slice(2, 9);
    const { Title, Item, data, laneGap = DEFAULT_LANE_GAP, nodeGap = DEFAULT_NODE_GAP, lifelineWidth = DEFAULT_LIFELINE_WIDTH, arrowWidth = DEFAULT_ARROW_WIDTH, showLifeline = true, padding = DEFAULT_PADDING, arrowType = 'triangle', showLaneHeader = true, laneHeaderHeight = DEFAULT_LANE_HEADER_HEIGHT, edgeStyle = 'solid', animated = false, edgeColorMode = 'gradient', options, } = props;
    // 获取主题颜色
    const themeColors = (0, utils_1.getThemeColors)(options.themeConfig, options);
    const colorText = (_a = themeColors === null || themeColors === void 0 ? void 0 : themeColors.colorText) !== null && _a !== void 0 ? _a : '#333333';
    const colorBg = (_b = themeColors === null || themeColors === void 0 ? void 0 : themeColors.colorBg) !== null && _b !== void 0 ? _b : '#ffffff';
    const colorBorder = (_c = themeColors === null || themeColors === void 0 ? void 0 : themeColors.colorTextSecondary) !== null && _c !== void 0 ? _c : '#e0e0e0';
    const flowData = data;
    const { title, desc, items = [], relations = [] } = flowData;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    // 空状态处理
    if (!items || items.length === 0) {
        const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
        return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: (0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0], x: -btnBounds.width / 2, y: -btnBounds.height / 2 }) }), (0, jsx_runtime_1.jsx)(jsx_1.Text, { x: 0, y: btnBounds.height / 2 + BTN_MARGIN, width: 200, height: 40, fontSize: 14, alignHorizontal: "center", alignVertical: "middle", fill: (_d = themeColors === null || themeColors === void 0 ? void 0 : themeColors.colorTextSecondary) !== null && _d !== void 0 ? _d : '#999', children: "\u6682\u65E0\u6570\u636E" })] })] }));
    }
    // 泳道列表（每个顶层item是一个泳道）
    const lanes = items;
    // 计算最大行数（所有泳道中 children 的最大 step 或 索引），至少为1
    let maxStep = 0;
    lanes.forEach((lane) => {
        var _a;
        (_a = lane.children) === null || _a === void 0 ? void 0 : _a.forEach((child, index) => {
            var _a;
            const currentStep = (_a = child.step) !== null && _a !== void 0 ? _a : index;
            if (currentStep > maxStep) {
                maxStep = currentStep;
            }
        });
    });
    const maxRows = Math.max(1, maxStep + 1);
    const nodeLayoutById = new Map();
    // 测量Item尺寸
    const designItem = (_e = options.design) === null || _e === void 0 ? void 0 : _e.item;
    const itemConfig = Array.isArray(designItem) ? designItem[0] : designItem;
    // 使用类型安全的访问或默认值
    let itemWidth = (_f = itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.width) !== null && _f !== void 0 ? _f : DEFAULT_ITEM_WIDTH;
    let itemHeight = (_g = itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.height) !== null && _g !== void 0 ? _g : DEFAULT_ITEM_HEIGHT;
    // 构建一个扁平化的节点列表用于Item渲染
    const flatNodes = [];
    lanes.forEach((lane, laneIndex) => {
        var _a;
        (_a = lane.children) === null || _a === void 0 ? void 0 : _a.forEach((child, rowIndex) => {
            flatNodes.push({ datum: child, laneIndex, rowIndex });
        });
    });
    // 尝试通过采样修正尺寸 (仅当配置未指定时)
    if ((!(itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.width) || !(itemConfig === null || itemConfig === void 0 ? void 0 : itemConfig.height)) &&
        Item &&
        flatNodes.length > 0) {
        const sampleNode = flatNodes[0];
        const sampleBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], datum: sampleNode.datum, positionH: "center", positionV: "middle" }));
        // 确保尺寸有效
        if (sampleBounds.width > 0)
            itemWidth = sampleBounds.width;
        if (sampleBounds.height > 0)
            itemHeight = sampleBounds.height;
    }
    // 测量relations标签的最大宽度，自动调整泳道间距
    let maxLabelWidth = 0;
    relations.forEach((relation) => {
        if (relation.label) {
            const labelBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(jsx_1.Text, { fontSize: FONT_SIZE, fontWeight: "normal", children: relation.label }));
            maxLabelWidth = Math.max(maxLabelWidth, labelBounds.width);
        }
    });
    // 动态计算泳道宽度：需要兼顾节点宽度、标签宽度需求以及用户设置的间距
    const baseWidth = itemWidth + LANE_PADDING;
    const labelWidthRequirement = itemWidth + maxLabelWidth + LANE_PADDING * 2;
    const laneWidth = Math.max(laneGap, baseWidth, labelWidthRequirement);
    // 计算行高度和总高度
    const headerOffset = showLaneHeader ? laneHeaderHeight : 0;
    const contentHeight = FIRST_GAP + maxRows * itemHeight + Math.max(0, maxRows - 1) * nodeGap;
    const totalHeight = headerOffset + contentHeight + padding * 2 + BOTTOM_AREA_HEIGHT;
    const totalWidth = laneWidth * lanes.length + padding * 2;
    // 计算每个泳道的中心X坐标
    const getLaneCenterX = (laneIndex) => {
        return padding + laneWidth / 2 + laneIndex * laneWidth;
    };
    // 计算每行的Y坐标
    const getRowY = (rowIndex) => {
        return (padding +
            headerOffset +
            FIRST_GAP +
            rowIndex * (itemHeight + nodeGap) +
            itemHeight / 2);
    };
    const itemElements = [];
    const decorElements = [];
    const defsElements = [];
    const btnElements = [];
    // 绘制泳道标题
    if (showLaneHeader) {
        lanes.forEach((lane, laneIndex) => {
            const centerX = getLaneCenterX(laneIndex);
            const laneColor = (0, utils_1.getPaletteColor)(options, [laneIndex]);
            const laneThemeColors = (0, utils_1.getThemeColors)({ colorPrimary: laneColor }, options);
            // 泳道标题背景
            if (Item) {
                decorElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: [laneIndex], datum: {
                        label: lane.label,
                        icon: lane.icon,
                        desc: lane.desc,
                    }, x: centerX - itemWidth / 2, y: padding, width: itemWidth, height: laneHeaderHeight - LANE_HEADER_MARGIN, themeColors: laneThemeColors, positionH: "center" }));
                // 泳道标题删除按钮 (右上角)
                btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: [laneIndex], x: centerX + itemWidth / 2 - BTN_MARGIN, y: padding - BTN_MARGIN }));
            }
        });
    }
    // 绘制节点（按行对齐）
    lanes.forEach((lane, laneIndex) => {
        var _a, _b, _c, _d;
        (_a = lane.children) === null || _a === void 0 ? void 0 : _a.forEach((child, rowIndex) => {
            var _a, _b;
            // 使用 step 属性作为行索引，如果未定义则回退到数组索引
            const effectiveRowIndex = (_a = child.step) !== null && _a !== void 0 ? _a : rowIndex;
            const centerX = getLaneCenterX(laneIndex);
            const centerY = getRowY(effectiveRowIndex);
            const x = centerX - itemWidth / 2;
            const y = centerY - itemHeight / 2;
            // 保存节点布局信息
            nodeLayoutById.set(child.id, {
                x,
                y,
                width: itemWidth,
                height: itemHeight,
                centerX,
                centerY,
                laneIndex,
                rowIndex: effectiveRowIndex,
            });
            const nodeColor = (0, utils_1.getPaletteColor)(options, [laneIndex]);
            const nodeThemeColors = (0, utils_1.getThemeColors)({ colorPrimary: nodeColor }, options);
            // 构造类似 hierarchy-tree 的 _originalIndex
            const originalIndex = [laneIndex, rowIndex];
            // 附加到数据上，确保 Item 组件能正确识别
            const childWithIndex = Object.assign(Object.assign({}, child), { _originalIndex: originalIndex });
            if (Item) {
                itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: originalIndex, datum: childWithIndex, data: data, x: x, y: y, positionH: "center", positionV: "middle", themeColors: nodeThemeColors }));
                // 节点删除按钮 (底部剧中)
                btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: originalIndex, x: x + itemWidth / 2 - BTN_MARGIN, y: y + itemHeight + BTN_MARGIN / 2 }));
            }
            else {
                // 默认节点渲染
                decorElements.push((0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: x, y: y, width: itemWidth, height: itemHeight, fill: (_b = nodeThemeColors === null || nodeThemeColors === void 0 ? void 0 : nodeThemeColors.colorPrimaryBg) !== null && _b !== void 0 ? _b : colorBg, stroke: nodeColor, strokeWidth: 2, rx: CORNER_RADIUS_NODE, "data-element-type": "shape" }));
                if (child.label) {
                    decorElements.push((0, jsx_runtime_1.jsx)(jsx_1.Text, { x: x, y: y, width: itemWidth, height: itemHeight, fontSize: 14, fontWeight: "bold", alignHorizontal: "center", alignVertical: "middle", fill: colorText, children: child.label }));
                }
            }
        });
        // 每个泳道底部的添加节点按钮
        const childCount = (_c = (_b = lane.children) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
        // 找出当前泳道最大的 step
        let lastEffectRowIndex = -1;
        (_d = lane.children) === null || _d === void 0 ? void 0 : _d.forEach((child, index) => {
            var _a;
            const s = (_a = child.step) !== null && _a !== void 0 ? _a : index;
            if (s > lastEffectRowIndex)
                lastEffectRowIndex = s;
        });
        const lastRowY = lastEffectRowIndex >= 0
            ? getRowY(lastEffectRowIndex)
            : padding + headerOffset;
        const addNodeY = childCount > 0
            ? lastRowY + itemHeight / 2 + BTN_LANE_ADD_Gap
            : lastRowY + FIRST_GAP + BTN_MARGIN;
        const centerX = getLaneCenterX(laneIndex);
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [laneIndex, childCount], x: centerX - BTN_HALF_SIZE, y: addNodeY }));
    });
    // 绘制生命线（使用 mask 挖空节点区域，避免虚线穿透半透明节点）
    if (showLifeline) {
        // 预先按泳道分组节点，避免每条泳道都遍历全部节点
        const nodeRectsByLane = new Map();
        nodeLayoutById.forEach((layout) => {
            let list = nodeRectsByLane.get(layout.laneIndex);
            if (!list) {
                list = [];
                nodeRectsByLane.set(layout.laneIndex, list);
            }
            list.push({
                x: layout.x,
                y: layout.y,
                width: layout.width,
                height: layout.height,
            });
        });
        lanes.forEach((_lane, laneIndex) => {
            var _a;
            const centerX = getLaneCenterX(laneIndex);
            const startY = padding + headerOffset;
            const endY = totalHeight - padding;
            const laneNodeRects = (_a = nodeRectsByLane.get(laneIndex)) !== null && _a !== void 0 ? _a : [];
            // 如果该泳道有节点，创建 mask 来挖空节点区域
            let lifelineMaskAttr;
            if (laneNodeRects.length > 0) {
                const maskId = `lifeline-mask-${instanceId}-${laneIndex}`;
                defsElements.push((0, jsx_runtime_1.jsxs)("mask", { id: maskId, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: totalWidth, height: totalHeight, children: [(0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: 0, y: 0, width: totalWidth, height: totalHeight, fill: "white" }), laneNodeRects.map((rect) => ((0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: rect.x, y: rect.y - LIFELINE_MASK_GAP, width: rect.width, height: rect.height + LIFELINE_MASK_GAP * 2, fill: "black" })))] }));
                lifelineMaskAttr = `url(#${maskId})`;
            }
            decorElements.push((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M ${centerX} ${startY} L ${centerX} ${endY}`, stroke: colorBorder, strokeWidth: lifelineWidth, strokeDasharray: "5,5", fill: "none", "data-element-type": "shape", mask: lifelineMaskAttr }));
            // 绘制生命线末端箭头（实心）
            decorElements.push(...(0, utils_1.createArrowElements)(centerX, endY, Math.PI / 2, 'triangle', colorBorder, 1, 10));
        });
    }
    // 添加新泳道按钮 (最右侧)
    const lastLaneRightX = getLaneCenterX(lanes.length - 1) + laneWidth / 2;
    const newLaneX = lanes.length > 0 ? lastLaneRightX + BTN_LANE_ADD_Gap : padding;
    const newLaneY = padding + headerOffset / 2 - BTN_HALF_SIZE; // 垂直居中于标题栏
    btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [lanes.length], x: newLaneX, y: newLaneY }));
    // 预处理边，方便快速查找反向边
    const edgeMap = new Map();
    // 统计入度和出度
    const inDegreeMap = new Map();
    const outDegreeMap = new Map();
    relations.forEach((r) => {
        var _a;
        const key = `${r.from}-${r.to}`;
        if (!edgeMap.has(key))
            edgeMap.set(key, []);
        (_a = edgeMap.get(key)) === null || _a === void 0 ? void 0 : _a.push(r);
        const fromId = String(r.from);
        const toId = String(r.to);
        if (fromId === toId)
            return;
        outDegreeMap.set(fromId, (outDegreeMap.get(fromId) || 0) + 1);
        inDegreeMap.set(toId, (inDegreeMap.get(toId) || 0) + 1);
    });
    // 绘制消息箭头
    relations.forEach((relation, relIndex) => {
        var _a, _b;
        const fromId = String(relation.from);
        const toId = String(relation.to);
        // 使用精确的节点布局信息
        const fromLayout = nodeLayoutById.get(fromId);
        const toLayout = nodeLayoutById.get(toId);
        if (!fromLayout || !toLayout)
            return;
        // 颜色处理
        const fromColor = (0, utils_1.getPaletteColor)(options, [fromLayout.laneIndex]) || '#000000';
        const toColor = (0, utils_1.getPaletteColor)(options, [toLayout.laneIndex]) || '#000000';
        const themePrimary = (0, utils_1.getColorPrimary)(options);
        // 确定线条和箭头颜色
        let edgeStroke = themePrimary || '#999999';
        let targetArrowColor = themePrimary || '#999999';
        let sourceArrowColor = themePrimary || '#999999';
        // 如果是渐变模式，使用渐变色
        const gradientId = `arrow-gradient-${instanceId}-${relIndex}`;
        if (edgeColorMode === 'gradient') {
            edgeStroke = `url(#${gradientId})`;
            targetArrowColor = toColor;
            sourceArrowColor = fromColor;
        }
        const { points } = calculateEdgePath(fromId, toId, fromLayout, toLayout, edgeMap, outDegreeMap.get(fromId) || 0, inDegreeMap.get(toId) || 0, inDegreeMap.get(fromId) || 0, outDegreeMap.get(toId) || 0);
        let maskId;
        let labelRenderNode = null;
        if (relation.label) {
            const labelPoint = (0, utils_1.getLabelPosition)(points);
            if (labelPoint) {
                const labelX = labelPoint[0];
                const labelY = labelPoint[1] - LABEL_OFFSET_Y;
                // 预先计算 Label 的尺寸
                const labelBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: [relIndex], fontSize: FONT_SIZE, fontWeight: "normal", children: relation.label }));
                const bgX = labelX - labelBounds.width / 2;
                const bgY = labelY - labelBounds.height / 2;
                const bgW = labelBounds.width;
                const bgH = labelBounds.height;
                maskId = `edge-mask-${instanceId}-${relIndex}`;
                // 将 Mask 推入 defsElements
                // 逻辑：白色区域显示(全图)，黑色区域隐藏(标签位置)
                defsElements.push((0, jsx_runtime_1.jsxs)("mask", { id: maskId, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: totalWidth, height: totalHeight, children: [(0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: 0, y: 0, width: totalWidth, height: totalHeight, fill: "white" }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: bgX, y: bgY, width: bgW, height: bgH, fill: "black" })] }));
                labelRenderNode = ((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: [relIndex], x: labelX - labelBounds.width / 2, y: labelY - labelBounds.height / 2, width: labelBounds.width, height: labelBounds.height, fontSize: FONT_SIZE, fontWeight: "normal", alignHorizontal: "center", alignVertical: "middle", fill: colorText, children: relation.label }));
            }
        }
        // 生成路径字符串
        const pathD = (0, utils_1.getEdgePathD)(points);
        if (edgeColorMode === 'gradient') {
            const startPoint = points[0];
            const endPoint = points[points.length - 1];
            defsElements.push((0, jsx_runtime_1.jsxs)("linearGradient", { id: gradientId, gradientUnits: "userSpaceOnUse", x1: startPoint[0], y1: startPoint[1], x2: endPoint[0], y2: endPoint[1], children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: fromColor }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: toColor })] }));
        }
        decorElements.push((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: pathD, stroke: edgeStroke, strokeWidth: arrowWidth, fill: "none", "data-element-type": "shape", 
            // 如果存在 maskId，则应用遮罩
            mask: maskId ? `url(#${maskId})` : undefined, strokeDasharray: relation.lineStyle === 'solid'
                ? undefined
                : ((_a = relation.lineStyle) !== null && _a !== void 0 ? _a : edgeStyle) === 'dashed' || animated
                    ? '5,5'
                    : undefined, children: animated && ((0, jsx_runtime_1.jsx)("animate", { attributeName: "stroke-dashoffset", from: "10", to: "0", dur: "1s", repeatCount: "indefinite" })) }));
        // 绘制箭头头部 (箭头不需要遮罩，保持原样)
        const effectiveArrowSize = ARROW_SIZE;
        const direction = (_b = relation.direction) !== null && _b !== void 0 ? _b : 'forward';
        const arrowConfigs = [
            {
                show: direction === 'forward' || direction === 'both',
                angle: (0, utils_1.getTangentAngle)(points, 1),
                point: points[points.length - 1],
                color: targetArrowColor,
            },
            {
                show: direction === 'both',
                angle: (0, utils_1.getTangentAngle)(points, 0) + Math.PI,
                point: points[0],
                color: sourceArrowColor,
            },
        ];
        arrowConfigs.forEach((cfg) => {
            var _a;
            if (cfg.show) {
                decorElements.push(...(0, utils_1.createArrowElements)(cfg.point[0], cfg.point[1], cfg.angle, (_a = relation.arrowType) !== null && _a !== void 0 ? _a : arrowType, cfg.color, arrowWidth, effectiveArrowSize));
            }
        });
        if (labelRenderNode) {
            decorElements.push(labelRenderNode);
        }
    });
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: 0, y: 0, width: totalWidth, height: totalHeight, fill: "none" }), (0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: defsElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: decorElements }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.SequenceInteractionFlow = SequenceInteractionFlow;
(0, registry_1.registerStructure)('sequence-interaction', {
    component: exports.SequenceInteractionFlow,
    composites: ['title', 'item'],
});
