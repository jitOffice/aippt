import { addDummyNode } from './util.js';

const addBorderSegments = (g) => {
    const dfs = (v) => {
        const children = g.getChildren(v);
        const node = g.getNode(v);
        if (children === null || children === void 0 ? void 0 : children.length) {
            children.forEach((child) => dfs(child.id));
        }
        if (node.data.hasOwnProperty('minRank')) {
            node.data.borderLeft = [];
            node.data.borderRight = [];
            for (let rank = node.data.minRank, maxRank = node.data.maxRank + 1; rank < maxRank; rank += 1) {
                addBorderNode(g, 'borderLeft', '_bl', v, node, rank);
                addBorderNode(g, 'borderRight', '_br', v, node, rank);
            }
        }
    };
    g.getRoots().forEach((child) => dfs(child.id));
};
const addBorderNode = (g, prop, prefix, sg, sgNode, rank) => {
    const label = { rank, borderType: prop, width: 0, height: 0 };
    // 使用相对于 minRank 的索引
    const index = rank - sgNode.data.minRank;
    // @ts-ignore
    const prev = sgNode.data[prop][index - 1];
    const curr = addDummyNode(g, 'border', label, prefix);
    // @ts-ignore
    sgNode.data[prop][index] = curr;
    g.setParent(curr, sg);
    if (prev) {
        g.addEdge({
            id: `e${Math.random()}`,
            source: prev,
            target: curr,
            data: { weight: 1 },
        });
    }
};

export { addBorderSegments };
//# sourceMappingURL=add-border-segments.js.map
