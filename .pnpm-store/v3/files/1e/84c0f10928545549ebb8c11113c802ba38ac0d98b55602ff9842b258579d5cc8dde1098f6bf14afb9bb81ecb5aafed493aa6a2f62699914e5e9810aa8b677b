import { __awaiter } from '../../node_modules/tslib/tslib.es6.js';
import { applySingleNodeLayout } from '../../util/common.js';
import '../../node_modules/@antv/expr/dist/index.esm.js';
import { formatNodeSizeFn, formatFn } from '../../util/format.js';
import { orderByDegree, orderBySorter } from '../../util/order.js';
import { normalizeViewport } from '../../util/viewport.js';
import { BaseLayout } from '../base-layout.js';

const DEFAULTS_LAYOUT_OPTIONS$7 = {
    nodeSize: 30,
    nodeSpacing: 10,
    preventOverlap: false,
    sweep: undefined,
    equidistant: false,
    startAngle: (3 / 2) * Math.PI,
    clockwise: true,
    maxLevelDiff: undefined,
    sortBy: 'degree',
};
/**
 * <zh/> 同心圆布局
 *
 * <en/> Concentric layout
 */
class ConcentricLayout extends BaseLayout {
    constructor() {
        super(...arguments);
        this.id = 'concentric';
    }
    getDefaultOptions() {
        return DEFAULTS_LAYOUT_OPTIONS$7;
    }
    layout() {
        return __awaiter(this, void 0, void 0, function* () {
            const { width, height, center } = normalizeViewport(this.options);
            const n = this.model.nodeCount();
            if (!n || n === 1) {
                applySingleNodeLayout(this.model, center);
                return;
            }
            const { sortBy: propsSortBy, maxLevelDiff: propsMaxLevelDiff, sweep: propsSweep, clockwise, equidistant, preventOverlap, startAngle = DEFAULTS_LAYOUT_OPTIONS$7.startAngle, nodeSize, nodeSpacing, } = this.options;
            const sortBy = !propsSortBy || propsSortBy === 'degree'
                ? 'degree'
                : formatFn(propsSortBy, ['node']);
            if (sortBy === 'degree') {
                orderByDegree(this.model);
            }
            else {
                const sorter = (nodeA, nodeB) => {
                    const a = sortBy(nodeA);
                    const b = sortBy(nodeB);
                    return a === b ? 0 : a > b ? -1 : 1;
                };
                orderBySorter(this.model, sorter);
            }
            const nodes = this.model.nodes();
            const sortKeys = new Map();
            for (const node of nodes) {
                const v = sortBy === 'degree'
                    ? this.model.degree(node.id)
                    : sortBy(node._original);
                sortKeys.set(node.id, v);
            }
            const maxValueNode = this.model.firstNode();
            const maxLevelDiff = propsMaxLevelDiff || sortKeys.get(maxValueNode.id) / 4;
            const sizeFn = formatNodeSizeFn(nodeSize, nodeSpacing, DEFAULTS_LAYOUT_OPTIONS$7.nodeSize, DEFAULTS_LAYOUT_OPTIONS$7.nodeSpacing);
            const nodeDistances = new Map();
            for (const node of nodes) {
                nodeDistances.set(node.id, Math.max(...sizeFn(node._original)));
            }
            // put the values into levels
            const levels = [{ nodes: [] }];
            let currentLevel = levels[0];
            for (let i = 0; i < n; i++) {
                const node = nodes[i];
                if (currentLevel.nodes.length > 0) {
                    const firstNode = currentLevel.nodes[0];
                    const diff = Math.abs(sortKeys.get(firstNode.id) - sortKeys.get(node.id));
                    if (maxLevelDiff && diff >= maxLevelDiff) {
                        currentLevel = { nodes: [] };
                        levels.push(currentLevel);
                    }
                }
                currentLevel.nodes.push(node);
            }
            for (const level of levels) {
                const nodeSizes = level.nodes.map((node) => nodeDistances.get(node.id));
                level.nodeSizes = nodeSizes;
                level.maxNodeSize = Math.max(...nodeSizes);
            }
            // find the metrics for each level
            levels.forEach((level) => {
                const sweep = propsSweep === undefined
                    ? 2 * Math.PI - (2 * Math.PI) / level.nodes.length
                    : propsSweep;
                level.dTheta = sweep / Math.max(1, level.nodes.length - 1);
            });
            // calculate the radius
            if (preventOverlap) {
                let r = 0;
                for (let i = 0; i < levels.length; i++) {
                    const level = levels[i];
                    if (level.nodes.length > 1) {
                        const nodeSizes = level.nodeSizes || [];
                        let requiredDist = 0;
                        for (let j = 0; j < nodeSizes.length - 1; j++) {
                            requiredDist = Math.max(requiredDist, (nodeSizes[j] + nodeSizes[j + 1]) / 2);
                        }
                        const dcos = Math.cos(level.dTheta) - Math.cos(0);
                        const dsin = Math.sin(level.dTheta) - Math.sin(0);
                        const denom = Math.sqrt(dcos * dcos + dsin * dsin);
                        const rMin = denom > 0 ? requiredDist / denom : 0;
                        r = Math.max(rMin, r);
                    }
                    level.r = r;
                    if (i < levels.length - 1) {
                        const nextLevel = levels[i + 1];
                        const step = ((level.maxNodeSize || 0) + (nextLevel.maxNodeSize || 0)) / 2;
                        r += Math.max(0, step);
                    }
                }
            }
            else {
                // create radii by node sizes, then constrain to bb (without overlap guarantees)
                let r = 0;
                levels[0].r = 0;
                for (let i = 0; i < levels.length - 1; i++) {
                    const level = levels[i];
                    const nextLevel = levels[i + 1];
                    const step = ((level.maxNodeSize || 0) + (nextLevel.maxNodeSize || 0)) / 2;
                    r += Math.max(0, step);
                    nextLevel.r = r;
                }
                const maxHalf = Math.min(width, height) / 2;
                let scale = 1;
                for (const level of levels) {
                    const rr = level.r || 0;
                    if (rr <= 0)
                        continue;
                    const allowed = maxHalf - (level.maxNodeSize || 0);
                    if (allowed <= 0) {
                        scale = 0;
                        break;
                    }
                    scale = Math.min(scale, allowed / rr);
                }
                scale = Math.max(0, Math.min(1, scale));
                if (scale !== 1) {
                    for (const level of levels) {
                        level.r = (level.r || 0) * scale;
                    }
                }
            }
            if (equidistant) {
                let rDeltaMax = 0;
                let rr = 0;
                for (let i = 0; i < levels.length; i++) {
                    const level = levels[i];
                    const rDelta = (level.r || 0) - rr;
                    rDeltaMax = Math.max(rDeltaMax, rDelta);
                }
                rr = 0;
                levels.forEach((level, i) => {
                    if (i === 0) {
                        rr = level.r || 0;
                    }
                    level.r = rr;
                    rr += rDeltaMax;
                });
            }
            // calculate the node positions
            levels.forEach((level) => {
                const dTheta = level.dTheta || 0;
                const rr = level.r || 0;
                level.nodes.forEach((node, j) => {
                    const theta = startAngle + (clockwise ? 1 : -1) * dTheta * j;
                    node.x = center[0] + rr * Math.cos(theta);
                    node.y = center[1] + rr * Math.sin(theta);
                });
            });
        });
    }
}

export { ConcentricLayout };
//# sourceMappingURL=index.js.map
