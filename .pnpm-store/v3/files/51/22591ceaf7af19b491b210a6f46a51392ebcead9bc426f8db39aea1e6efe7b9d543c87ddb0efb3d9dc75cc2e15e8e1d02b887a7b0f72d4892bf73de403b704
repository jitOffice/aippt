import { __awaiter } from '../../node_modules/tslib/tslib.es6.js';
import { applySingleNodeLayout } from '../../util/common.js';
import '../../node_modules/@antv/expr/dist/index.esm.js';
import { formatNodeSizeFn, formatFn } from '../../util/format.js';
import { getAdjList, johnson } from '../../util/math.js';
import { normalizeViewport } from '../../util/viewport.js';
import { BaseLayout } from '../base-layout.js';
import { runMDS } from '../mds/index.js';
import { radialNonoverlapForce } from './radial-nonoverlap-force.js';

const DEFAULTS_LAYOUT_OPTIONS = {
    focusNode: null,
    linkDistance: 50,
    maxIteration: 1000,
    maxPreventOverlapIteration: 200,
    preventOverlap: false,
    sortStrength: 10,
    strictRadial: true,
    unitRadius: null,
    nodeSize: 10,
    nodeSpacing: 0,
};
/**
 * <zh/> 径向布局
 *
 * <en/> Radial layout
 */
class RadialLayout extends BaseLayout {
    constructor() {
        super(...arguments);
        this.id = 'radial';
    }
    getDefaultOptions() {
        return DEFAULTS_LAYOUT_OPTIONS;
    }
    layout() {
        return __awaiter(this, void 0, void 0, function* () {
            const { width, height, center } = normalizeViewport(this.options);
            const n = this.model.nodeCount();
            if (!n || n === 1) {
                return applySingleNodeLayout(this.model, center);
            }
            const { focusNode: propsFocusNode, linkDistance = DEFAULTS_LAYOUT_OPTIONS.linkDistance, maxIteration = DEFAULTS_LAYOUT_OPTIONS.maxIteration, maxPreventOverlapIteration = DEFAULTS_LAYOUT_OPTIONS.maxPreventOverlapIteration, nodeSize, nodeSpacing, preventOverlap, sortBy, sortStrength = DEFAULTS_LAYOUT_OPTIONS.sortStrength, strictRadial, unitRadius: propsUnitRadius, } = this.options;
            const focusNode = (propsFocusNode && this.model.node(propsFocusNode)) ||
                this.model.firstNode();
            // the index of the focusNode in data
            const focusIndex = this.model.nodeIndexOf(focusNode.id);
            // the graph-theoretic distance (shortest path distance) matrix
            const adjList = getAdjList(this.model, false);
            const distances = johnson(adjList);
            const maxDistance = maxToFocus(distances, focusIndex);
            // replace first node in unconnected component to the circle at (maxDistance + 1)
            handleInfinity(distances, focusIndex, maxDistance + 1);
            // the shortest path distance from each node to focusNode
            const focusNodeD = distances[focusIndex];
            const semiWidth = (width - center[0] > center[0] ? center[0] : width - center[0]) ||
                width / 2;
            const semiHeight = (height - center[1] > center[1] ? center[1] : height - center[1]) ||
                height / 2;
            // the maxRadius of the graph
            const maxRadius = Math.min(semiWidth, semiHeight);
            const maxD = Math.max(...focusNodeD);
            // the radius for each nodes away from focusNode
            const radii = [];
            const radiiMap = new Map();
            const unitRadius = propsUnitRadius !== null && propsUnitRadius !== void 0 ? propsUnitRadius : maxRadius / maxD;
            focusNodeD.forEach((value, i) => {
                const v = value * unitRadius;
                radii.push(v);
                radiiMap.set(this.model.nodeAt(i).id, v);
            });
            const idealDistances = eIdealDisMatrix(this.model, distances, linkDistance, radii, unitRadius, sortBy, sortStrength);
            // the initial positions from mds, move the graph to origin, centered at focusNode
            const mdsResult = runMDS(idealDistances, 2, linkDistance);
            const mdsFocus = mdsResult[focusIndex];
            let i = 0;
            this.model.forEachNode((node) => {
                const p = mdsResult[i];
                node.x = p[0] - mdsFocus[0];
                node.y = p[1] - mdsFocus[1];
                i++;
            });
            this.run(maxIteration, idealDistances, radii, focusIndex);
            this.model.forEachNode((node) => {
                node.x += center[0];
                node.y += center[1];
            });
            // stagger the overlapped nodes
            if (preventOverlap) {
                const nodeSizeFunc = formatNodeSizeFn(nodeSize, nodeSpacing, DEFAULTS_LAYOUT_OPTIONS.nodeSize, DEFAULTS_LAYOUT_OPTIONS.nodeSpacing);
                const nonoverlapForceParams = {
                    nodeSizeFunc,
                    radiiMap,
                    width,
                    strictRadial: Boolean(strictRadial),
                    focusNode,
                    maxIteration: maxPreventOverlapIteration,
                    k: n / 4.5,
                };
                radialNonoverlapForce(this.model, nonoverlapForceParams);
            }
        });
    }
    run(maxIteration, idealDistances, radii, focusIndex) {
        const weights = getWeightMatrix(idealDistances);
        const n = this.model.nodeCount();
        const nodes = this.model.nodes();
        const xs = new Float64Array(n);
        const ys = new Float64Array(n);
        for (let i = 0; i < n; i++) {
            xs[i] = nodes[i].x;
            ys[i] = nodes[i].y;
        }
        for (let i = 0; i <= maxIteration; i++) {
            const param = i / maxIteration;
            const vparam = 1 - param;
            for (let i = 0; i < n; i++) {
                if (i === focusIndex)
                    continue;
                const vx = xs[i];
                const vy = ys[i];
                const originDis = Math.sqrt(vx * vx + vy * vy);
                const reciODis = originDis === 0 ? 0 : 1 / originDis;
                let xMolecule = 0;
                let yMolecule = 0;
                let denominator = 0;
                for (let j = 0; j < n; j++) {
                    // u
                    if (i === j)
                        continue;
                    const ux = xs[j];
                    const uy = ys[j];
                    // the euclidean distance between v and u
                    const edis = Math.sqrt((vx - ux) * (vx - ux) + (vy - uy) * (vy - uy));
                    const reciEdis = edis === 0 ? 0 : 1 / edis;
                    const idealDis = idealDistances[j][i];
                    // same for x and y
                    denominator += weights[i][j];
                    // x
                    xMolecule += weights[i][j] * (ux + idealDis * (vx - ux) * reciEdis);
                    // y
                    yMolecule += weights[i][j] * (uy + idealDis * (vy - uy) * reciEdis);
                }
                const reciR = radii[i] === 0 ? 0 : 1 / radii[i];
                denominator *= vparam;
                denominator += param * reciR * reciR;
                // x
                xMolecule *= vparam;
                xMolecule += param * reciR * vx * reciODis;
                // y
                yMolecule *= vparam;
                yMolecule += param * reciR * vy * reciODis;
                xs[i] = xMolecule / denominator;
                ys[i] = yMolecule / denominator;
                nodes[i].x = xs[i];
                nodes[i].y = ys[i];
            }
        }
    }
}
const eIdealDisMatrix = (model, distances, linkDistance, radii, unitRadius, sortBy, sortStrength) => {
    const n = distances.length;
    const result = new Array(n);
    const radiusScale = new Array(n);
    for (let i = 0; i < n; i++)
        radiusScale[i] = radii[i] / unitRadius;
    const baseLink = (linkDistance + unitRadius) / 2;
    const sortCache = new Map();
    const sortFn = !sortBy || sortBy === 'data' ? null : formatFn(sortBy, ['node']);
    const isDataSort = sortBy === 'data';
    for (let i = 0; i < n; i++) {
        const row = distances[i];
        const newRow = new Array(n);
        result[i] = newRow;
        const riScale = radiusScale[i] || 1;
        for (let j = 0; j < n; j++) {
            if (i === j) {
                newRow[j] = 0;
                continue;
            }
            const v = row[j];
            if (radii[i] === radii[j]) {
                if (isDataSort) {
                    newRow[j] = (v * Math.abs(i - j) * sortStrength) / riScale;
                }
                else if (sortFn) {
                    // cache node attribute values
                    const nodeI = model.nodeAt(i);
                    const nodeJ = model.nodeAt(j);
                    let iv = sortCache.get(nodeI.id);
                    if (iv === undefined) {
                        const raw = sortFn(nodeI._original) || 0;
                        iv = typeof raw === 'string' ? raw.charCodeAt(0) : Number(raw || 0);
                        sortCache.set(nodeI.id, iv);
                    }
                    let jv = sortCache.get(nodeJ.id);
                    if (jv === undefined) {
                        const raw = sortFn(nodeJ._original) || 0;
                        jv = typeof raw === 'string' ? raw.charCodeAt(0) : Number(raw || 0);
                        sortCache.set(nodeJ.id, jv);
                    }
                    newRow[j] = (v * Math.abs(iv - jv) * sortStrength) / riScale;
                }
                else {
                    newRow[j] = (v * linkDistance) / riScale;
                }
            }
            else {
                newRow[j] = v * baseLink;
            }
        }
    }
    return result;
};
const getWeightMatrix = (idealDistances) => {
    const rows = idealDistances.length;
    const cols = idealDistances[0].length;
    const result = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            if (idealDistances[i][j] !== 0) {
                row.push(1 / (idealDistances[i][j] * idealDistances[i][j]));
            }
            else {
                row.push(0);
            }
        }
        result.push(row);
    }
    return result;
};
const handleInfinity = (matrix, focusIndex, step) => {
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        // matrix 关注点对应行的 Inf 项
        if (matrix[focusIndex][i] === Infinity) {
            matrix[focusIndex][i] = step;
            matrix[i][focusIndex] = step;
            // 遍历 matrix 中的 i 行，i 行中非 Inf 项若在 focus 行为 Inf，则替换 focus 行的那个 Inf
            for (let j = 0; j < n; j++) {
                if (matrix[i][j] !== Infinity && matrix[focusIndex][j] === Infinity) {
                    matrix[focusIndex][j] = step + matrix[i][j];
                    matrix[j][focusIndex] = step + matrix[i][j];
                }
            }
        }
    }
    // 处理其他行的 Inf。根据该行对应点与 focus 距离以及 Inf 项点 与 focus 距离，决定替换值
    for (let i = 0; i < n; i++) {
        if (i === focusIndex) {
            continue;
        }
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === Infinity) {
                let minus = Math.abs(matrix[focusIndex][i] - matrix[focusIndex][j]);
                minus = minus === 0 ? 1 : minus;
                matrix[i][j] = minus;
            }
        }
    }
};
/**
 * Get the maximum finite distance from the focus node to other nodes
 */
const maxToFocus = (matrix, focusIndex) => {
    const row = matrix[focusIndex];
    let max = 0;
    for (let i = 0; i < row.length; i++) {
        if (row[i] === Infinity)
            continue;
        max = Math.max(max, row[i]);
    }
    return max;
};

export { RadialLayout };
//# sourceMappingURL=index.js.map
