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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationNetwork = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const d3 = __importStar(require("d3"));
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const RelationNetwork = (props) => {
    const { Title, Item, data, spacing = 120, showConnections = true, options, } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    if (items.length === 0) {
        return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, {}) })] }));
    }
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
    /** --- Force Layout --- */
    function runForceLayout() {
        const nodes = items.map((item, index) => ({
            id: index,
            data: item,
            isCenter: index === 0,
            _originalIndex: [index],
        }));
        const links = items.slice(1).map((_, index) => ({
            source: 0,
            target: index + 1,
        }));
        const simulation = d3
            .forceSimulation(nodes)
            .force('link', d3
            .forceLink(links)
            .id((d) => d.id)
            .distance(spacing))
            .force('charge', d3.forceManyBody().strength(-50))
            .force('center', d3.forceCenter(0, 0))
            .force('collision', d3
            .forceCollide()
            .radius(Math.max(itemBounds.width, itemBounds.height) / 2 + 10));
        for (let i = 0; i < 300; ++i)
            simulation.tick();
        return { nodes, links };
    }
    const { nodes, links } = runForceLayout();
    /** --- 偏移 --- */
    const minX = Math.min(...nodes.map((d) => { var _a; return (_a = d.x) !== null && _a !== void 0 ? _a : 0; }));
    const minY = Math.min(...nodes.map((d) => { var _a; return (_a = d.y) !== null && _a !== void 0 ? _a : 0; }));
    const offsetX = Math.max(0, -minX + itemBounds.width / 2);
    const offsetY = Math.max(0, -minY + itemBounds.height / 2);
    const positionBy = (x, y) => ({
        positionH: x < -50 ? 'flipped' : x > 50 ? 'normal' : 'center',
        positionV: y < -50 ? 'flipped' : y > 50 ? 'normal' : 'middle',
    });
    /** --- 节点 --- */
    const nodesEls = nodes
        .map((node) => {
        if (node.x == null || node.y == null)
            return null;
        const x = node.x + offsetX - itemBounds.width / 2;
        const y = node.y + offsetY - itemBounds.height / 2;
        const { positionH, positionV } = positionBy(node.x, node.y);
        return ((0, jsx_runtime_1.jsx)(Item, { indexes: node._originalIndex, datum: node.data, data: data, x: x, y: y, positionH: positionH, positionV: positionV }, node.id));
    })
        .filter(Boolean);
    /** --- 连线 --- */
    const linksMap = new Map(nodes.map((n) => [n.id, n]));
    const linksEls = showConnections
        ? links
            .map((link) => {
            const src = typeof link.source === 'object'
                ? link.source
                : linksMap.get(link.source);
            const tgt = typeof link.target === 'object'
                ? link.target
                : linksMap.get(link.target);
            if (!src ||
                !tgt ||
                src.x == null ||
                src.y == null ||
                tgt.x == null ||
                tgt.y == null)
                return null;
            const linePath = `M ${src.x + offsetX} ${src.y + offsetY} L ${tgt.x + offsetX} ${tgt.y + offsetY}`;
            return ((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: linePath, stroke: (0, utils_1.getColorPrimary)(options), strokeWidth: 2, strokeOpacity: 0.6 }));
        })
            .filter(Boolean)
        : [];
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Group, { children: linksEls }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: nodesEls })] })] }));
};
exports.RelationNetwork = RelationNetwork;
(0, registry_1.registerStructure)('relation-network', {
    component: exports.RelationNetwork,
    composites: ['title', 'item'],
});
