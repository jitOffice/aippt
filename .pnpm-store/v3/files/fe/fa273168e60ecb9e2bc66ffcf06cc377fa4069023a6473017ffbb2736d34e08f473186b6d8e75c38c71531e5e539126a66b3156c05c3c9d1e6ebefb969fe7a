import { __awaiter } from '../../node_modules/tslib/tslib.es6.js';
import { Matrix, SingularValueDecomposition } from '../../node_modules/ml-matrix/matrix.js';
import { BaseLayout } from '../base-layout.js';
import { applySingleNodeLayout } from '../../util/common.js';
import '../../node_modules/@antv/expr/dist/index.esm.js';
import { getAdjList, johnson, scaleMatrix } from '../../util/math.js';
import { normalizeViewport } from '../../util/viewport.js';

const DEFAULTS_LAYOUT_OPTIONS$2 = {
    center: [0, 0],
    linkDistance: 50,
};
/**
 * <zh/> 多维缩放算法布局
 *
 * <en/> Multidimensional scaling layout
 */
class MDSLayout extends BaseLayout {
    constructor() {
        super(...arguments);
        this.id = 'mds';
    }
    getDefaultOptions() {
        return DEFAULTS_LAYOUT_OPTIONS$2;
    }
    layout() {
        return __awaiter(this, void 0, void 0, function* () {
            const { linkDistance = DEFAULTS_LAYOUT_OPTIONS$2.linkDistance } = this.options;
            const { center } = normalizeViewport(this.options);
            const n = this.model.nodeCount();
            if (n === 0 || n === 1) {
                applySingleNodeLayout(this.model, center);
                return;
            }
            // the graph-theoretic distance (shortest path distance) matrix
            const adjList = getAdjList(this.model, false);
            const distances = johnson(adjList);
            handleInfinity$1(distances);
            // scale the ideal edge length acoording to linkDistance
            const scaledD = scaleMatrix(distances, linkDistance);
            // get positions by MDS
            const positions = runMDS(scaledD);
            let i = 0;
            this.model.forEachNode((node) => {
                const p = positions[i++];
                node.x = p[0] + center[0];
                node.y = p[1] + center[1];
            });
        });
    }
}
/**
 * Handle Infinity values in the distance matrix by replacing them with the maximum finite distance.
 */
const handleInfinity$1 = (distances) => {
    let maxDistance = Number.NEGATIVE_INFINITY;
    const infList = [];
    const n = distances.length;
    for (let i = 0; i < n; i++) {
        const row = distances[i];
        const m = row.length;
        for (let j = 0; j < m; j++) {
            const value = row[j];
            if (value === Infinity) {
                infList.push([i, j]);
            }
            else if (maxDistance < value) {
                maxDistance = value;
            }
        }
    }
    for (let k = 0; k < infList.length; k++) {
        const [i, j] = infList[k];
        distances[i][j] = maxDistance;
    }
};
/**
 * Mds Algorithm
 * @param {array} distances Adjacency matrix of distances
 * @param {number} dimension Dimension of layout, default 2
 * @param {number} linkDistance Ideal length of edges
 * @returns {array} positions Positions of nodes
 */
const runMDS = (distances, dimension = 2, linkDistance = DEFAULTS_LAYOUT_OPTIONS$2.linkDistance) => {
    try {
        // square distances
        const N = distances.length;
        const M = new Matrix(N, N);
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                const d = distances[i][j];
                M.set(i, j, -0.5 * d * d);
            }
        }
        // double centre the rows/columns
        const rowMeans = M.mean('row');
        const colMeans = M.mean('column');
        const totalMean = M.mean();
        M.add(totalMean).subRowVector(rowMeans).subColumnVector(colMeans);
        // take the SVD of the double centred matrix, and return the
        // points from it
        const ret = new SingularValueDecomposition(M);
        const eigenValues = Matrix.sqrt(ret.diagonalMatrix).diagonal();
        const U = ret.leftSingularVectors;
        const λ = eigenValues;
        const results = [];
        for (let i = 0; i < U.rows; i++) {
            const pt = [];
            for (let k = 0; k < dimension; k++) {
                pt.push(U.get(i, k) * λ[k]);
            }
            results.push(pt);
        }
        return results;
    }
    catch (_a) {
        const results = [];
        for (let i = 0; i < distances.length; i++) {
            const x = Math.random() * linkDistance;
            const y = Math.random() * linkDistance;
            results.push([x, y]);
        }
        return results;
    }
};

export { MDSLayout, runMDS };
//# sourceMappingURL=index.js.map
