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
exports.SequencePyramid = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const round_polygon_1 = __importStar(require("round-polygon"));
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const SequencePyramid = (props) => {
    const { Title, Item, data, gap = 10, width = 700, pyramidWidth, itemHeight = 60, options, } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    if (items.length === 0) {
        return ((0, jsx_runtime_1.jsx)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: titleContent }));
    }
    const radius = 5;
    const themeColors = (0, utils_1.getThemeColors)(options.themeConfig);
    const iconSize = 30;
    const itemElements = [];
    const pyramidElements = [];
    const backgroundElements = [];
    const iconElements = [];
    // Calculate dimensions
    const actualPyramidWidth = pyramidWidth !== null && pyramidWidth !== void 0 ? pyramidWidth : width * 0.6;
    const itemAreaWidth = width - actualPyramidWidth;
    // Pyramid layer height should be greater than itemHeight
    const pyramidLayerHeight = itemHeight * 1.2; // Magic number: 20% larger than itemHeight
    const totalHeight = items.length * pyramidLayerHeight + (items.length - 1) * gap;
    items.forEach((item, index) => {
        const indexes = [index];
        const isFirst = index === 0;
        // Get color from palette for this item
        const color = (0, utils_1.getPaletteColor)(options, [index]) || themeColors.colorPrimary;
        const { points, topWidth, bottomWidth } = calculateTriangleSegment(actualPyramidWidth, pyramidLayerHeight, gap, items.length, index);
        const rounded = (0, round_polygon_1.default)(points, radius);
        const segments = (0, round_polygon_1.getSegments)(rounded, 'AMOUNT', 10);
        const pyramidCenterX = actualPyramidWidth / 2;
        const pyramidY = index * (pyramidLayerHeight + gap);
        // Background positioning - centered vertically with pyramid layer
        const backgroundYOffset = (pyramidLayerHeight - itemHeight) / 2;
        const backgroundY = pyramidY + backgroundYOffset;
        const rightTopX = pyramidCenterX + topWidth / 2;
        const rightBottomX = pyramidCenterX + bottomWidth / 2;
        const overlapWidth = radius;
        // Background - fixed width from top edge
        const backgroundX = rightTopX - overlapWidth;
        const backgroundWidth = itemAreaWidth + radius;
        const backgroundHeight = itemHeight;
        const backgroundRightEdge = backgroundX + backgroundWidth;
        const iconX = pyramidCenterX - iconSize / 2;
        const iconY = pyramidY + pyramidLayerHeight / 2 - iconSize / 2 + (isFirst ? 8 : 0);
        // Item positioning - from current layer's right edge to background's right edge
        const itemX = rightBottomX;
        const itemWidth = backgroundRightEdge - rightBottomX;
        const itemY = backgroundY;
        // Background
        backgroundElements.push((0, jsx_runtime_1.jsx)(jsx_1.Rect, { x: backgroundX, y: backgroundY, width: backgroundWidth, height: backgroundHeight, ry: "10", fill: themeColors.colorPrimaryBg, "data-element-type": "shape" }));
        // Pyramid segment
        const pyramidColorId = `${color}-pyramid-${index}`;
        pyramidElements.push((0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: (0, jsx_runtime_1.jsxs)("linearGradient", { id: pyramidColorId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0", "stop-color": color }), (0, jsx_runtime_1.jsx)("stop", { offset: "100%", "stop-color": tinycolor2_1.default.mix(color, '#fff', 40).toHexString() })] }) }), (0, jsx_runtime_1.jsx)(jsx_1.Polygon, { points: segments, fill: `url(#${pyramidColorId})`, y: pyramidY, "data-element-type": "shape" }));
        // Icon
        iconElements.push((0, jsx_runtime_1.jsx)(components_1.ItemIcon, { indexes: indexes, x: iconX, y: iconY, size: iconSize, fill: "#fff" }));
        // Item
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: itemY, width: itemWidth, height: itemHeight, positionV: "middle" }));
    });
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { width: width, height: totalHeight, children: [(0, jsx_runtime_1.jsx)(jsx_1.Group, { children: backgroundElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: pyramidElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: iconElements }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, {})] })] }));
};
exports.SequencePyramid = SequencePyramid;
function calculateTriangleSegment(width, height, gap, counts, index) {
    const centerX = width / 2;
    const triangleHeight = counts * height + (counts - 1) * gap;
    const rectTop = index * (height + gap);
    const rectBottom = rectTop + height;
    const topWidth = (rectTop / triangleHeight) * width;
    const bottomWidth = (rectBottom / triangleHeight) * width;
    let points;
    if (index === 0) {
        const p1 = { x: centerX, y: 0 };
        const p2 = { x: centerX + bottomWidth / 2, y: height };
        const p3 = { x: centerX - bottomWidth / 2, y: height };
        points = [p1, p2, p3];
    }
    else {
        const p1 = { x: centerX + topWidth / 2, y: 0 };
        const p2 = { x: centerX + bottomWidth / 2, y: height };
        const p3 = { x: centerX - bottomWidth / 2, y: height };
        const p4 = { x: centerX - topWidth / 2, y: 0 };
        points = [p1, p2, p3, p4];
    }
    return { points, topWidth, bottomWidth };
}
(0, registry_1.registerStructure)('sequence-pyramid', {
    component: exports.SequencePyramid,
    composites: ['title', 'item'],
});
