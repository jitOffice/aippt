import { __awaiter, __rest } from '../../node_modules/tslib/tslib.es6.js';
import { registry } from '../../registry.js';
import '../../node_modules/@antv/expr/dist/index.esm.js';
import { formatFn, formatNumberFn, formatNodeSizeFn } from '../../util/format.js';
import { normalizeViewport } from '../../util/viewport.js';
import { BaseLayout, isLayoutWithIterations } from '../base-layout.js';

const DEFAULT_OPTIONS = {
    layout: (comboId) => !comboId
        ? { type: 'force', preventOverlap: true }
        : { type: 'concentric', preventOverlap: true },
    nodeSize: 20,
    nodeSpacing: 0,
    comboPadding: 10,
    comboSpacing: 0,
};
const ROOT_ID = 'root';
/**
 * <zh/> 组合布局
 *
 * <en/> Combo Combined Layout
 */
class ComboCombinedLayout extends BaseLayout {
    constructor() {
        super(...arguments);
        this.id = 'combo-combined';
        this.relativePositions = new Map();
        this.getParentId = (node) => {
            return node.parentId || ROOT_ID;
        };
    }
    getDefaultOptions() {
        return DEFAULT_OPTIONS;
    }
    layout() {
        return __awaiter(this, void 0, void 0, function* () {
            const { center } = normalizeViewport(this.options);
            this.resetLayoutState();
            /** 1. 构建分组层级结构 */
            const rootHierarchy = this.buildHierarchyTree();
            /** 2. 从内到外递归布局 */
            yield this.layoutHierarchy(rootHierarchy);
            /** 3. 计算全局位置 */
            this.convertToGlobalPositions(rootHierarchy, center);
            /** 4. 应用位置到节点 */
            this.applyPositionsToModel(rootHierarchy);
        });
    }
    isCombo(node) {
        return Boolean(node.isCombo);
    }
    resetLayoutState() {
        this.relativePositions.clear();
    }
    layoutHierarchy(combo) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const child of combo.children || []) {
                if (this.isCombo(child))
                    yield this.layoutHierarchy(child);
            }
            const childElements = combo.children || [];
            if (childElements.length === 0) {
                combo.size = [0, 0, 0];
                combo.parentId = combo.id === ROOT_ID ? null : combo.parentId;
                return;
            }
            const _a = this.getLayoutConfig(combo), { type } = _a, options = __rest(_a, ["type"]);
            const LayoutClass = this.getLayoutClass(type);
            const layoutInstance = new LayoutClass(options);
            const tmpGraphData = this.createTemporaryGraphData(childElements);
            yield executeLayout(layoutInstance, tmpGraphData, {});
            const partialNodes = layoutInstance.model.nodes();
            this.recordRelativePositions(partialNodes, combo);
            const { center, width, height } = this.calculateComboBounds(combo);
            combo.size = [width, height, 0];
            (combo.children || []).forEach((child) => {
                const rel = this.relativePositions.get(child.id);
                if (!rel)
                    return;
                const pos = Object.assign(Object.assign({}, rel), { x: rel.x - center[0], y: rel.y - center[1] });
                this.relativePositions.set(child.id, pos);
            });
        });
    }
    recordRelativePositions(nodes, related) {
        const comboCenter = this.calculateComboCenter(nodes);
        nodes.forEach((node) => {
            this.relativePositions.set(node.id, {
                x: node.x - comboCenter[0],
                y: node.y - comboCenter[1],
                relativeTo: String(related.id),
            });
        });
    }
    buildHierarchyTree() {
        const rootNode = {
            id: ROOT_ID,
            isCombo: true,
            children: [],
            parentId: null,
        };
        const comboNodeMap = new Map();
        comboNodeMap.set(ROOT_ID, rootNode);
        this.model.forEachNode((node) => {
            if (this.isCombo(node)) {
                const combo = Object.assign(Object.assign({}, node), { children: [], parentId: this.getParentId(node) });
                comboNodeMap.set(String(node.id), combo);
            }
        });
        this.model.forEachNode((node) => {
            const parentNode = comboNodeMap.get(this.getParentId(node));
            if (this.isCombo(node)) {
                const combo = comboNodeMap.get(String(node.id));
                if (parentNode && combo) {
                    parentNode.children.push(combo);
                    combo.parentId = parentNode.id;
                }
            }
            else {
                if (parentNode) {
                    parentNode.children.push(Object.assign(Object.assign({}, node), { children: [], parentId: this.getParentId(node) }));
                }
            }
        });
        return rootNode;
    }
    convertToGlobalPositions(combo, parent) {
        var _a, _b;
        const relativePos = combo.id === ROOT_ID ? null : this.relativePositions.get(combo.id);
        const globalX = parent[0] + ((_a = relativePos === null || relativePos === void 0 ? void 0 : relativePos.x) !== null && _a !== void 0 ? _a : 0);
        const globalY = parent[1] + ((_b = relativePos === null || relativePos === void 0 ? void 0 : relativePos.y) !== null && _b !== void 0 ? _b : 0);
        combo.x = globalX;
        combo.y = globalY;
        (combo.children || []).forEach((child) => {
            var _a, _b;
            const childRelativePos = this.relativePositions.get(child.id);
            child.x = globalX + ((_a = childRelativePos === null || childRelativePos === void 0 ? void 0 : childRelativePos.x) !== null && _a !== void 0 ? _a : 0);
            child.y = globalY + ((_b = childRelativePos === null || childRelativePos === void 0 ? void 0 : childRelativePos.y) !== null && _b !== void 0 ? _b : 0);
            child.size = this.getNodeLikeSize(child, false);
            if (this.isCombo(child)) {
                this.convertToGlobalPositions(child, [globalX, globalY]);
            }
        });
    }
    getLayoutConfig(combo) {
        const layout = typeof this.options.layout === 'object'
            ? this.options.layout
            : formatFn(this.options.layout, ['comboId']);
        if (typeof layout === 'function') {
            const comboId = combo.id === ROOT_ID ? null : combo.id;
            return this.normalizeLayoutConfig(layout(comboId));
        }
        return this.normalizeLayoutConfig(layout);
    }
    normalizeLayoutConfig(config) {
        const base = Object.assign(Object.assign({ type: 'concentric' }, normalizeViewport(this.options)), { nodeSize: 'node.size', nodeSpacing: 0 });
        if (!config)
            return base;
        if (typeof config === 'string')
            return Object.assign(Object.assign({}, base), { type: config });
        return Object.assign(Object.assign({}, base), config);
    }
    getLayoutClass(layoutType) {
        return registry[layoutType] || registry.concentric;
    }
    createTemporaryGraphData(nodes) {
        const tmpNodes = nodes.map((node) => (Object.assign(Object.assign({}, node), { size: this.getNodeLikeSize(node) })));
        const nodeIds = new Set(nodes.map((e) => String(e.id)));
        const tmpEdges = [];
        const resolveToClosestAncestorInSet = (id) => {
            let current = String(id);
            const visited = new Set();
            while (current && !visited.has(current)) {
                if (nodeIds.has(current))
                    return current;
                visited.add(current);
                const node = this.model.node(current);
                const parentId = node === null || node === void 0 ? void 0 : node.parentId;
                current = parentId == null ? null : String(parentId);
            }
            return null;
        };
        this.model.forEachEdge((edge) => {
            const source = resolveToClosestAncestorInSet(String(edge.source));
            const target = resolveToClosestAncestorInSet(String(edge.target));
            if (!source || !target)
                return;
            if (source === target)
                return;
            tmpEdges.push({ source, target });
        });
        return {
            nodes: tmpNodes,
            edges: tmpEdges,
        };
    }
    calculateComboCenter(nodes) {
        if (nodes.length === 0)
            return [0, 0];
        const sizeMap = new Map();
        nodes.forEach((child) => {
            const size = this.getNodeLikeSize(child);
            sizeMap.set(child.id, size);
        });
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        nodes.forEach((node) => {
            const [w = 0, h = 0] = sizeMap.get(node.id);
            minX = Math.min(minX, node.x - w / 2);
            minY = Math.min(minY, node.y - h / 2);
            maxX = Math.max(maxX, node.x + w / 2);
            maxY = Math.max(maxY, node.y + h / 2);
        });
        if (!Number.isFinite(minX) || !Number.isFinite(minY))
            return [0, 0];
        return [(minX + maxX) / 2, (minY + maxY) / 2];
    }
    calculateComboBounds(combo) {
        const children = combo.children || [];
        if (children.length === 0) {
            return { center: [0, 0], width: 0, height: 0 };
        }
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        children.forEach((child) => {
            var _a, _b;
            const relativePos = this.relativePositions.get(child.id);
            const x = (_a = relativePos === null || relativePos === void 0 ? void 0 : relativePos.x) !== null && _a !== void 0 ? _a : 0;
            const y = (_b = relativePos === null || relativePos === void 0 ? void 0 : relativePos.y) !== null && _b !== void 0 ? _b : 0;
            const [width, height] = this.getNodeLikeSize(child);
            minX = Math.min(minX, x - width / 2);
            minY = Math.min(minY, y - height / 2);
            maxX = Math.max(maxX, x + width / 2);
            maxY = Math.max(maxY, y + height / 2);
        });
        if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
            return { center: [0, 0], width: 0, height: 0 };
        }
        const comboPaddingFn = formatNumberFn(this.options.comboPadding, 20, 'combo');
        const padding = comboPaddingFn(combo._original);
        return {
            center: [(minX + maxX) / 2, (minY + maxY) / 2],
            width: maxX - minX + padding * 2,
            height: maxY - minY + padding * 2,
        };
    }
    getNodeLikeSize(node, includeSpacing = true) {
        if (this.isCombo(node))
            return this.getComboSize(node, includeSpacing);
        return this.getNodeSize(node, includeSpacing);
    }
    getNodeSize(node, includeSpacing = true) {
        const { nodeSize, nodeSpacing } = this.options;
        const sizeFn = formatNodeSizeFn(nodeSize, includeSpacing ? nodeSpacing : 0);
        return sizeFn(node._original);
    }
    getComboSize(combo, includeSpacing = true) {
        const comboSpacingFn = formatNumberFn(this.options.comboSpacing, 0, 'combo');
        const spacing = includeSpacing ? comboSpacingFn(combo._original) : 0;
        const [width, height] = combo.size;
        return [width + spacing / 2, height + spacing / 2, 0];
    }
    applyPositionsToModel(rootHierarchy) {
        const apply = (datum) => {
            const node = this.model.node(datum.id);
            if (!node)
                return;
            node.x = datum.x;
            node.y = datum.y;
            if (datum.size)
                node.size = datum.size;
        };
        const traverseAndApply = (combo) => {
            if (combo.id !== ROOT_ID)
                apply(combo);
            (combo.children || []).forEach((child) => {
                if (this.isCombo(child)) {
                    traverseAndApply(child);
                }
                else {
                    apply(child);
                }
            });
        };
        traverseAndApply(rootHierarchy);
    }
}
function executeLayout(layout, graphData, options = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (isLayoutWithIterations(layout)) {
            layout.execute(graphData, options);
            layout.stop();
            return layout.tick((_a = options.iterations) !== null && _a !== void 0 ? _a : 300);
        }
        return yield layout.execute(graphData, options);
    });
}

export { ComboCombinedLayout };
//# sourceMappingURL=index.js.map
