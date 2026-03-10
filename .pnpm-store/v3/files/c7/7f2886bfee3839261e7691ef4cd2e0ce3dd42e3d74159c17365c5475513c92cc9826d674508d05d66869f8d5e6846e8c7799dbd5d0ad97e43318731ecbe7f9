/**
 * <zh/> 内部图数据结构，用于 antv-dagre 布局算法
 *
 * <en/> Internal graph data structure for antv-dagre layout algorithm
 */
class DagreGraph {
    constructor(options = {}) {
        this.options = options;
        this.nodes = new Map();
        this.edges = new Map();
        this.inEdges = new Map();
        this.outEdges = new Map();
        this.parentMap = new Map(); // tree structure name -> node -> parent
        this.childrenMap = new Map(); // tree structure name -> node -> children
        // Initialize tree structures
        if (options.tree) {
            if (Array.isArray(options.tree) && options.tree.length > 0) {
                // Check if it's a tree name array or tree data array
                if (typeof options.tree[0] === 'string') {
                    // It's a tree name array
                    options.tree.forEach((treeName) => {
                        this.parentMap.set(treeName, new Map());
                        this.childrenMap.set(treeName, new Map());
                    });
                }
                else {
                    // It's tree data, add it
                    this.attachTreeStructure('default');
                    this.addTree(options.tree);
                }
            }
        }
        // Add initial nodes and edges if provided
        if (options.nodes) {
            options.nodes.forEach((node) => this.addNode(node));
        }
        if (options.edges) {
            options.edges.forEach((edge) => this.addEdge(edge));
        }
    }
    /**
     * <zh/> 添加节点
     *
     * <en/> Add a node
     */
    addNode(node) {
        if (!this.nodes.has(node.id)) {
            this.nodes.set(node.id, node);
            this.inEdges.set(node.id, new Set());
            this.outEdges.set(node.id, new Set());
        }
    }
    /**
     * <zh/> 批量添加节点
     *
     * <en/> Add multiple nodes
     */
    addNodes(nodes) {
        nodes.forEach((node) => this.addNode(node));
    }
    /**
     * <zh/> 获取节点
     *
     * <en/> Get a node
     */
    getNode(id) {
        return this.nodes.get(id);
    }
    /**
     * <zh/> 检查节点是否存在
     *
     * <en/> Check if a node exists
     */
    hasNode(id) {
        return this.nodes.has(id);
    }
    /**
     * <zh/> 删除节点
     *
     * <en/> Remove a node
     */
    removeNode(id) {
        if (!this.nodes.has(id))
            return;
        // Remove all edges connected to this node
        const inEdgeIds = Array.from(this.inEdges.get(id) || []);
        const outEdgeIds = Array.from(this.outEdges.get(id) || []);
        inEdgeIds.forEach((edgeId) => this.removeEdge(edgeId));
        outEdgeIds.forEach((edgeId) => this.removeEdge(edgeId));
        this.nodes.delete(id);
        this.inEdges.delete(id);
        this.outEdges.delete(id);
        // Remove from tree structures
        this.parentMap.forEach((treeParentMap) => {
            treeParentMap.delete(id);
        });
        this.childrenMap.forEach((treeChildrenMap) => {
            treeChildrenMap.delete(id);
        });
    }
    /**
     * <zh/> 获取所有节点
     *
     * <en/> Get all nodes
     */
    getAllNodes() {
        return Array.from(this.nodes.values());
    }
    /**
     * <zh/> 添加边
     *
     * <en/> Add an edge
     */
    addEdge(edge) {
        if (!this.nodes.has(edge.source) || !this.nodes.has(edge.target)) {
            throw new Error(`Cannot add edge ${edge.id}: source ${edge.source} or target ${edge.target} does not exist`);
        }
        this.edges.set(edge.id, edge);
        this.outEdges.get(edge.source).add(edge.id);
        this.inEdges.get(edge.target).add(edge.id);
    }
    /**
     * <zh/> 批量添加边
     *
     * <en/> Add multiple edges
     */
    addEdges(edges) {
        edges.forEach((edge) => this.addEdge(edge));
    }
    /**
     * <zh/> 获取边
     *
     * <en/> Get an edge
     */
    getEdge(id) {
        return this.edges.get(id);
    }
    /**
     * <zh/> 检查边是否存在
     *
     * <en/> Check if an edge exists
     */
    hasEdge(id) {
        return this.edges.has(id);
    }
    /**
     * <zh/> 删除边
     *
     * <en/> Remove an edge
     */
    removeEdge(id) {
        var _a, _b;
        const edge = this.edges.get(id);
        if (!edge)
            return;
        this.edges.delete(id);
        (_a = this.outEdges.get(edge.source)) === null || _a === void 0 ? void 0 : _a.delete(id);
        (_b = this.inEdges.get(edge.target)) === null || _b === void 0 ? void 0 : _b.delete(id);
    }
    /**
     * <zh/> 获取所有边
     *
     * <en/> Get all edges
     */
    getAllEdges() {
        return Array.from(this.edges.values());
    }
    /**
     * <zh/> 更新边数据
     *
     * <en/> Update edge data
     */
    updateEdgeData(id, data) {
        const edge = this.edges.get(id);
        if (edge) {
            Object.assign(edge.data, data);
        }
    }
    /**
     * <zh/> 更新节点数据
     *
     * <en/> Update node data
     */
    updateNodeData(id, data) {
        const node = this.nodes.get(id);
        if (node) {
            Object.assign(node.data, data);
        }
    }
    /**
     * <zh/> 获取相关边
     *
     * <en/> Get related edges
     */
    getRelatedEdges(nodeId, direction = 'both') {
        const result = [];
        if (direction === 'in' || direction === 'both') {
            const inEdgeIds = this.inEdges.get(nodeId);
            if (inEdgeIds) {
                inEdgeIds.forEach((edgeId) => {
                    const edge = this.edges.get(edgeId);
                    if (edge)
                        result.push(edge);
                });
            }
        }
        if (direction === 'out' || direction === 'both') {
            const outEdgeIds = this.outEdges.get(nodeId);
            if (outEdgeIds) {
                outEdgeIds.forEach((edgeId) => {
                    const edge = this.edges.get(edgeId);
                    if (edge)
                        result.push(edge);
                });
            }
        }
        return result;
    }
    /**
     * <zh/> 获取后继节点
     *
     * <en/> Get successor nodes
     */
    getSuccessors(nodeId) {
        const outEdgeIds = this.outEdges.get(nodeId);
        if (!outEdgeIds || outEdgeIds.size === 0)
            return [];
        const successors = [];
        outEdgeIds.forEach((edgeId) => {
            const edge = this.edges.get(edgeId);
            if (edge) {
                const targetNode = this.nodes.get(edge.target);
                if (targetNode)
                    successors.push(targetNode);
            }
        });
        return successors.length > 0 ? successors : [];
    }
    /**
     * <zh/> 获取前驱节点
     *
     * <en/> Get predecessor nodes
     */
    getPredecessors(nodeId) {
        const inEdgeIds = this.inEdges.get(nodeId);
        if (!inEdgeIds || inEdgeIds.size === 0)
            return [];
        const predecessors = [];
        inEdgeIds.forEach((edgeId) => {
            const edge = this.edges.get(edgeId);
            if (edge) {
                const sourceNode = this.nodes.get(edge.source);
                if (sourceNode)
                    predecessors.push(sourceNode);
            }
        });
        return predecessors.length > 0 ? predecessors : [];
    }
    /**
     * <zh/> 获取邻居节点
     *
     * <en/> Get neighbor nodes
     */
    getNeighbors(nodeId) {
        const successors = this.getSuccessors(nodeId) || [];
        const predecessors = this.getPredecessors(nodeId) || [];
        const neighbors = [...successors, ...predecessors];
        // Remove duplicates
        const uniqueNeighbors = Array.from(new Map(neighbors.map((n) => [n.id, n])).values());
        return uniqueNeighbors.length > 0 ? uniqueNeighbors : [];
    }
    /**
     * <zh/> 附加树结构
     *
     * <en/> Attach tree structure
     */
    attachTreeStructure(treeName) {
        if (!this.parentMap.has(treeName)) {
            this.parentMap.set(treeName, new Map());
            this.childrenMap.set(treeName, new Map());
        }
    }
    /**
     * <zh/> 添加树结构（递归添加节点及其子节点）
     *
     * <en/> Add tree structure (recursively add nodes and their children)
     */
    addTree(tree, treeName) {
        var _a, _b;
        const actualTreeName = treeName || ((_b = (_a = this.options.tree) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 'default');
        if (!this.hasTreeStructure(actualTreeName)) {
            this.attachTreeStructure(actualTreeName);
        }
        const trees = Array.isArray(tree) ? tree : [tree];
        const addTreeNode = (node, parentId) => {
            // Add the node itself
            this.addNode({ id: node.id, data: node.data });
            // Set parent relationship if parent exists
            if (parentId !== undefined) {
                this.setParent(node.id, parentId, actualTreeName);
            }
            // Recursively add children
            if (node.children && node.children.length > 0) {
                node.children.forEach((child) => {
                    addTreeNode(child, node.id);
                });
            }
        };
        trees.forEach((t) => addTreeNode(t));
    }
    /**
     * <zh/> 检查是否有树结构
     *
     * <en/> Check if has tree structure
     */
    hasTreeStructure(treeName) {
        return this.parentMap.has(treeName);
    }
    /**
     * <zh/> 设置父节点
     *
     * <en/> Set parent node
     */
    setParent(childId, parentId, treeName) {
        var _a, _b, _c;
        const actualTreeName = treeName || ((_b = (_a = this.options.tree) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 'default');
        if (!this.parentMap.has(actualTreeName)) {
            this.attachTreeStructure(actualTreeName);
        }
        const treeParentMap = this.parentMap.get(actualTreeName);
        const treeChildrenMap = this.childrenMap.get(actualTreeName);
        // Remove from old parent
        const oldParent = treeParentMap.get(childId);
        if (oldParent !== undefined) {
            (_c = treeChildrenMap.get(oldParent)) === null || _c === void 0 ? void 0 : _c.delete(childId);
        }
        // Set new parent
        treeParentMap.set(childId, parentId);
        // Add to new parent's children
        if (!treeChildrenMap.has(parentId)) {
            treeChildrenMap.set(parentId, new Set());
        }
        treeChildrenMap.get(parentId).add(childId);
    }
    /**
     * <zh/> 获取父节点
     *
     * <en/> Get parent node
     */
    getParent(nodeId, treeName) {
        var _a, _b;
        const actualTreeName = treeName || ((_b = (_a = this.options.tree) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 'default');
        // Ensure tree structure exists
        if (!this.parentMap.has(actualTreeName)) {
            this.attachTreeStructure(actualTreeName);
        }
        const treeParentMap = this.parentMap.get(actualTreeName);
        if (!treeParentMap)
            return undefined;
        const parentId = treeParentMap.get(nodeId);
        if (parentId === undefined) {
            // Node has no parent set
            return null;
        }
        return this.nodes.get(parentId);
    }
    /**
     * <zh/> 获取子节点
     *
     * <en/> Get children nodes
     */
    getChildren(nodeId, treeName) {
        var _a, _b;
        const actualTreeName = treeName || ((_b = (_a = this.options.tree) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 'default');
        const treeChildrenMap = this.childrenMap.get(actualTreeName);
        if (!treeChildrenMap)
            return [];
        const childIds = treeChildrenMap.get(nodeId);
        if (!childIds)
            return [];
        return Array.from(childIds)
            .map((id) => this.nodes.get(id))
            .filter((node) => node !== undefined);
    }
    /**
     * <zh/> 获取根节点（没有父节点的节点）
     *
     * <en/> Get root nodes (nodes without parents)
     */
    getRoots(treeName) {
        var _a, _b;
        const actualTreeName = treeName || ((_b = (_a = this.options.tree) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 'default');
        const treeParentMap = this.parentMap.get(actualTreeName);
        const roots = [];
        this.nodes.forEach((node) => {
            const hasParent = treeParentMap && treeParentMap.get(node.id) !== undefined;
            if (!hasParent) {
                roots.push(node);
            }
        });
        return roots;
    }
    dfsTree(startId, visit) {
        const stack = [startId];
        const visited = new Set();
        while (stack.length > 0) {
            const nodeId = stack.pop();
            if (visited.has(nodeId))
                continue;
            const node = this.getNode(nodeId);
            if (node) {
                visited.add(nodeId);
                const shouldSkipChildren = visit(node);
                if (shouldSkipChildren === true)
                    continue;
                const children = this.getChildren(nodeId);
                // Push children in reverse order so they are processed in the correct order
                for (let i = children.length - 1; i >= 0; i--) {
                    if (!visited.has(children[i].id)) {
                        stack.push(children[i].id);
                    }
                }
            }
        }
    }
}

export { DagreGraph };
//# sourceMappingURL=graph.js.map
