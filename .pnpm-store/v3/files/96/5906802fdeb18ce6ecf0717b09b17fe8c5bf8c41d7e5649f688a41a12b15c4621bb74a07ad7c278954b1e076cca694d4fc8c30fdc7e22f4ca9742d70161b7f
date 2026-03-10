import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import * as d3 from 'd3';
import { getElementBounds, Group, Path } from '../../jsx/index.js';
import { ItemsGroup } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { getColorPrimary } from '../utils/index.js';
import { registerStructure } from './registry.js';
export const RelationNetwork = (props) => {
    const { Title, Item, data, spacing = 120, showConnections = true, options, } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    if (items.length === 0) {
        return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsx(Group, { children: _jsx(ItemsGroup, {}) })] }));
    }
    const itemBounds = getElementBounds(_jsx(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
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
        return (_jsx(Item, { indexes: node._originalIndex, datum: node.data, data: data, x: x, y: y, positionH: positionH, positionV: positionV }, node.id));
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
            return (_jsx(Path, { d: linePath, stroke: getColorPrimary(options), strokeWidth: 2, strokeOpacity: 0.6 }));
        })
            .filter(Boolean)
        : [];
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { children: [_jsx(Group, { children: linksEls }), _jsx(ItemsGroup, { children: nodesEls })] })] }));
};
registerStructure('relation-network', {
    component: RelationNetwork,
    composites: ['title', 'item'],
});
