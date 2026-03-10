"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceFunnel = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
/**
 * 序列漏斗结构（SequenceFunnel）
 * 用途：
 * - 在左侧渲染分层漏斗形状（倒置梯形堆叠），右侧渲染对应的 item 卡片与图标
 * - 形状上宽下窄，底部平滑（梯形），卡片背景插入漏斗下方
 */
const round_polygon_1 = __importStar(require("round-polygon"));
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
// Constants
const FUNNEL_CORNER_RADIUS = 6;
const ICON_SIZE = 32;
const FUNNEL_LAYER_HEIGHT_RATIO = 1.25;
const OVERLAP_DIST = 25;
const TEXT_GAP = 15;
const SequenceFunnel = (props) => {
    const { Title, Item, data, gap = 10, width = 700, funnelWidth, itemHeight = 60, minBottomRatio = 0.25, // 默认底部保留 25% 的宽度，形成梯形
    options, } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    if (items.length === 0) {
        return ((0, jsx_runtime_1.jsx)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: titleContent }));
    }
    const themeColors = (0, utils_1.getThemeColors)(options.themeConfig);
    // 计算各区域尺寸
    const actualFunnelWidth = funnelWidth !== null && funnelWidth !== void 0 ? funnelWidth : width * 0.55; // 稍微调窄一点漏斗，给右侧留更多空间
    const itemAreaWidth = width - actualFunnelWidth;
    // 漏斗层高度
    const funnelLayerHeight = itemHeight * FUNNEL_LAYER_HEIGHT_RATIO;
    const totalHeight = items.length * funnelLayerHeight + (items.length - 1) * gap;
    // 计算底部的最小像素宽度
    const minFunnelPixelWidth = actualFunnelWidth * minBottomRatio;
    const elements = items.map((item, index) => {
        const indexes = [index];
        // 获取颜色
        const color = (0, utils_1.getPaletteColor)(options, [index]) || themeColors.colorPrimary;
        // 1. 计算当前层的梯形形状
        // 使用线性插值，从 actualFunnelWidth 收缩到 minFunnelPixelWidth
        const { points, topWidth } = calculateTrapezoidSegment(actualFunnelWidth, minFunnelPixelWidth, funnelLayerHeight, gap, totalHeight, index);
        // 圆角处理
        const rounded = (0, round_polygon_1.default)(points, FUNNEL_CORNER_RADIUS);
        const segments = (0, round_polygon_1.getSegments)(rounded, 'AMOUNT', 10);
        // 坐标计算
        const funnelCenterX = actualFunnelWidth / 2;
        const funnelY = index * (funnelLayerHeight + gap);
        // 2. 背景与 Item 的位置计算
        // 在漏斗（倒梯形）中，顶边（topWidth）总是比底边（bottomWidth）宽
        // 所以右侧边缘的最外点是 topWidth 的一半
        const rightTopX = funnelCenterX + topWidth / 2;
        // 背景卡片：
        // X 轴起点：从漏斗最宽处向左回缩 overlapDist，形成“插入”效果
        const backgroundX = rightTopX - OVERLAP_DIST;
        // 宽度：填满剩余空间，但要补上左侧回缩的距离
        const backgroundWidth = itemAreaWidth + OVERLAP_DIST - 10; // -10 用于右侧留白
        const backgroundYOffset = (funnelLayerHeight - itemHeight) / 2;
        const backgroundY = funnelY + backgroundYOffset;
        // 文本内容 (Item)：
        // X 轴起点：不应该跟着背景向左缩，而应该在漏斗边缘右侧，避免被漏斗遮挡
        const itemX = rightTopX + TEXT_GAP;
        const itemWidth = backgroundWidth - OVERLAP_DIST - TEXT_GAP;
        const itemY = backgroundY;
        // 图标位置
        const iconX = funnelCenterX - ICON_SIZE / 2;
        const iconY = funnelY + funnelLayerHeight / 2 - ICON_SIZE / 2;
        const funnelColorId = `${color.replace('#', '')}-funnel-${index}`;
        return {
            background: ((0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: backgroundX, y: backgroundY, width: backgroundWidth, height: itemHeight, ry: "8" // 背景圆角稍微大一点，显得柔和
                , fill: (0, tinycolor2_1.default)(color).setAlpha(0.1).toRgbString(), "data-element-type": "shape" })),
            funnel: [
                (0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: (0, jsx_runtime_1.jsxs)("linearGradient", { id: funnelColorId, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0%", stopColor: (0, tinycolor2_1.default)(color).lighten(10).toString() }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", stopColor: color })] }) }),
                (0, jsx_runtime_1.jsx)(jsx_1.Polygon, { points: segments, fill: `url(#${funnelColorId})`, y: funnelY, "data-element-type": "shape", 
                    // 添加轻微阴影效果增加层次感（可选，依赖环境支持 filter）
                    style: { filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.15))' } }),
            ],
            icon: ((0, jsx_runtime_1.jsx)(components_1.ItemIcon, { indexes: indexes, x: iconX, y: iconY, size: ICON_SIZE, fill: "#fff" })),
            item: ((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: itemY, width: itemWidth, height: itemHeight, positionV: "middle" })),
            btnRemove: ((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: indexes, x: backgroundX + backgroundWidth, y: backgroundY })),
        };
    });
    const btnAdd = ((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [items.length], x: width / 2, y: totalHeight + 10 }));
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { width: width, height: totalHeight + 40, children: [(0, jsx_runtime_1.jsx)(jsx_1.Group, { children: elements.map((element) => element.background) }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: elements.flatMap((element) => element.funnel) }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: elements.map((element) => element.icon) }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: elements.map((element) => element.item) }), (0, jsx_runtime_1.jsxs)(components_1.BtnsGroup, { children: [elements.map((element) => element.btnRemove), btnAdd] })] })] }));
};
exports.SequenceFunnel = SequenceFunnel;
// 计算梯形分段逻辑
function calculateTrapezoidSegment(maxWidth, minWidth, layerHeight, gap, totalHeight, index) {
    const centerX = maxWidth / 2;
    // 当前层顶部和底部的 Y 坐标（相对于总高度）
    const currentTopY = index * (layerHeight + gap);
    const currentBottomY = currentTopY + layerHeight;
    // 线性插值计算宽度
    // Width = MaxWidth - (MaxWidth - MinWidth) * (Y / TotalHeight)
    const widthDiff = maxWidth - minWidth;
    const topWidth = maxWidth - widthDiff * (currentTopY / totalHeight);
    const bottomWidth = maxWidth - widthDiff * (currentBottomY / totalHeight);
    // 生成四个顶点 (梯形)
    const p1 = { x: centerX - topWidth / 2, y: 0 }; // 左上
    const p2 = { x: centerX + topWidth / 2, y: 0 }; // 右上
    const p3 = { x: centerX + bottomWidth / 2, y: layerHeight }; // 右下
    const p4 = { x: centerX - bottomWidth / 2, y: layerHeight }; // 左下
    return { points: [p1, p2, p3, p4], topWidth, bottomWidth };
}
// 注册
(0, registry_1.registerStructure)('sequence-funnel', {
    component: exports.SequenceFunnel,
    composites: ['title', 'item'],
});
