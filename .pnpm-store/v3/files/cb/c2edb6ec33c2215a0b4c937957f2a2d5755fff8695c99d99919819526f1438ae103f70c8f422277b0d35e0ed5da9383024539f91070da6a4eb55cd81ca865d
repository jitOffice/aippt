import isNil from '../node_modules/@antv/util/esm/lodash/is-nil.js';

class GraphLib {
    constructor(data, options = {}) {
        this.edgeIdCounter = new Map();
        this.nodeMap = extractNodeData(data.nodes, options.node);
        this.edgeMap = extractEdgeData(data.edges || [], options.edge, this.getEdgeId.bind(this));
    }
    data() {
        return { nodes: this.nodeMap, edges: this.edgeMap };
    }
    replace(result) {
        this.nodeMap = result.nodes;
        this.edgeMap = result.edges;
        this.clearCache();
    }
    nodes() {
        return Array.from(this.nodeMap.values());
    }
    node(id) {
        return this.nodeMap.get(id);
    }
    nodeAt(index) {
        if (!this.indexNodeCache) {
            this.buildNodeIndexCache();
        }
        const nodeId = this.indexNodeCache.get(index);
        return nodeId ? this.nodeMap.get(nodeId) : undefined;
    }
    nodeIndexOf(id) {
        var _a;
        if (!this.nodeIndexCache) {
            this.buildNodeIndexCache();
        }
        return (_a = this.nodeIndexCache.get(id)) !== null && _a !== void 0 ? _a : -1;
    }
    firstNode() {
        return this.nodeMap.values().next().value;
    }
    forEachNode(callback) {
        let i = 0;
        this.nodeMap.forEach((node) => callback(node, i++));
    }
    originalNode(id) {
        const node = this.nodeMap.get(id);
        return node === null || node === void 0 ? void 0 : node._original;
    }
    nodeCount() {
        return this.nodeMap.size;
    }
    edges() {
        return Array.from(this.edgeMap.values());
    }
    edge(id) {
        return this.edgeMap.get(id);
    }
    firstEdge() {
        return this.edgeMap.values().next().value;
    }
    forEachEdge(callback) {
        let i = 0;
        this.edgeMap.forEach((edge) => callback(edge, i++));
    }
    originalEdge(id) {
        const edge = this.edgeMap.get(id);
        return edge === null || edge === void 0 ? void 0 : edge._original;
    }
    edgeCount() {
        return this.edgeMap.size;
    }
    getEdgeId(edge) {
        if (edge.id)
            return edge.id;
        const baseId = `${edge.source}-${edge.target}`;
        const count = this.edgeIdCounter.get(baseId) || 0;
        const id = count === 0 ? baseId : `${baseId}-${count}`;
        this.edgeIdCounter.set(baseId, count + 1);
        return id;
    }
    degree(nodeId, direction = 'both') {
        if (!this.degreeCache) {
            this.buildDegreeCache();
        }
        const degree = this.degreeCache.get(nodeId);
        if (!degree)
            return 0;
        return degree[direction];
    }
    neighbors(nodeId, direction = 'both') {
        if (!this.outAdjacencyCache || !this.inAdjacencyCache) {
            this.buildAdjacencyCache();
        }
        if (direction === 'out') {
            return Array.from(this.outAdjacencyCache.get(nodeId) || []);
        }
        if (direction === 'in') {
            return Array.from(this.inAdjacencyCache.get(nodeId) || []);
        }
        if (this.bothAdjacencyCache) {
            return Array.from(this.bothAdjacencyCache.get(nodeId) || []);
        }
        const inSet = this.inAdjacencyCache.get(nodeId);
        const outSet = this.outAdjacencyCache.get(nodeId);
        if (!inSet && !outSet)
            return [];
        if (!inSet)
            return Array.from(outSet);
        if (!outSet)
            return Array.from(inSet);
        const merged = new Set();
        inSet.forEach((id) => merged.add(id));
        outSet.forEach((id) => merged.add(id));
        return Array.from(merged);
    }
    successors(nodeId) {
        return this.neighbors(nodeId, 'out');
    }
    predecessors(nodeId) {
        return this.neighbors(nodeId, 'in');
    }
    setNodeOrder(nodes) {
        const next = new Map();
        for (const node of nodes)
            next.set(node.id, node);
        this.nodeMap = next;
        this.nodeIndexCache = undefined;
        this.indexNodeCache = undefined;
    }
    clearCache() {
        this.degreeCache = undefined;
        this.inAdjacencyCache = undefined;
        this.outAdjacencyCache = undefined;
        this.bothAdjacencyCache = undefined;
        this.nodeIndexCache = undefined;
        this.indexNodeCache = undefined;
    }
    buildDegreeCache() {
        this.degreeCache = new Map();
        for (const edge of this.edges()) {
            const { source, target } = edge;
            if (edge.source === edge.target)
                continue;
            if (!this.degreeCache.has(source)) {
                this.degreeCache.set(source, { in: 0, out: 0, both: 0 });
            }
            const sourceDeg = this.degreeCache.get(edge.source);
            if (sourceDeg) {
                sourceDeg.out++;
                sourceDeg.both++;
            }
            if (!this.degreeCache.has(target)) {
                this.degreeCache.set(target, { in: 0, out: 0, both: 0 });
            }
            const targetDeg = this.degreeCache.get(edge.target);
            if (targetDeg) {
                targetDeg.in++;
                targetDeg.both++;
            }
        }
    }
    buildAdjacencyCache() {
        this.inAdjacencyCache = new Map();
        this.outAdjacencyCache = new Map();
        for (const edge of this.edges()) {
            if (!this.nodeMap.has(edge.source) || !this.nodeMap.has(edge.target))
                continue;
            if (!this.outAdjacencyCache.has(edge.source)) {
                this.outAdjacencyCache.set(edge.source, new Set());
            }
            this.outAdjacencyCache.get(edge.source).add(edge.target);
            if (!this.inAdjacencyCache.has(edge.target)) {
                this.inAdjacencyCache.set(edge.target, new Set());
            }
            this.inAdjacencyCache.get(edge.target).add(edge.source);
        }
    }
    buildNodeIndexCache() {
        this.nodeIndexCache = new Map();
        this.indexNodeCache = new Map();
        let index = 0;
        this.nodeMap.forEach((_node, nodeId) => {
            this.nodeIndexCache.set(nodeId, index);
            this.indexNodeCache.set(index, nodeId);
            index++;
        });
    }
    destroy() {
        this.clearCache();
        this.nodeMap.clear();
        this.edgeMap.clear();
        this.edgeIdCounter.clear();
    }
}
const nodeFields = [
    'id',
    'x',
    'y',
    'z',
    'vx',
    'vy',
    'vz',
    'fx',
    'fy',
    'fz',
    'parentId',
];
const edgeFields = ['id', 'source', 'target', 'points'];
function extractNodeData(nodes, node) {
    if (!nodes) {
        throw new Error('Data.nodes is required');
    }
    const result = new Map();
    for (const datum of nodes) {
        const nodeData = { _original: datum };
        for (const field of nodeFields) {
            const value = datum[field];
            if (isNil(value))
                continue;
            nodeData[field] = value;
        }
        if (node) {
            const customFields = node(datum);
            for (const key in customFields) {
                const value = customFields[key];
                if (isNil(value))
                    continue;
                nodeData[key] = value;
            }
        }
        if (isNil(nodeData.id)) {
            throw new Error(`Node is missing id field`);
        }
        result.set(nodeData.id, nodeData);
    }
    return result;
}
function extractEdgeData(edges, edge, getEdgeId) {
    const result = new Map();
    for (const datum of edges) {
        const edgeData = { _original: datum };
        for (const field of edgeFields) {
            const value = datum[field];
            if (isNil(value))
                continue;
            edgeData[field] = value;
        }
        if (edge) {
            const customFields = edge(datum);
            for (const key in customFields) {
                const value = customFields[key];
                if (isNil(value))
                    continue;
                edgeData[key] = value;
            }
        }
        if (isNil(edgeData.source) || isNil(edgeData.target)) {
            throw new Error(`Edge is missing source or target field`);
        }
        if (isNil(edgeData.id)) {
            edgeData.id = getEdgeId === null || getEdgeId === void 0 ? void 0 : getEdgeId(datum);
        }
        result.set(edgeData.id, edgeData);
    }
    return result;
}
function initNodePosition(model, width, height, dimensions = 2) {
    model.forEachNode((node) => {
        if (isNil(node.x)) {
            node.x = Math.random() * width;
        }
        if (isNil(node.y)) {
            node.y = Math.random() * height;
        }
        if (dimensions === 3 && isNil(node.z)) {
            node.z = Math.random() * Math.min(width, height);
        }
    });
}

export { GraphLib, initNodePosition };
//# sourceMappingURL=data.js.map
