import { __awaiter } from '../../node_modules/tslib/tslib.es6.js';
import { applySingleNodeLayout } from '../../util/common.js';
import '../../node_modules/@antv/expr/dist/index.esm.js';
import { formatNodeSizeFn } from '../../util/format.js';
import { orderByTopology, orderByDegree } from '../../util/order.js';
import { normalizeViewport } from '../../util/viewport.js';
import { BaseLayout } from '../base-layout.js';

const DEFAULT_LAYOUT_OPTIONS$1 = {
    radius: null,
    startRadius: null,
    endRadius: null,
    startAngle: 0,
    endAngle: 2 * Math.PI,
    clockwise: true,
    divisions: 1,
    ordering: null,
    angleRatio: 1,
    nodeSize: 10,
    nodeSpacing: 0,
};
/**
 * <zh/> 环形布局
 *
 * <en/> Circular layout
 */
class CircularLayout extends BaseLayout {
    constructor() {
        super(...arguments);
        this.id = 'circular';
    }
    getDefaultOptions() {
        return DEFAULT_LAYOUT_OPTIONS$1;
    }
    layout() {
        return __awaiter(this, void 0, void 0, function* () {
            const { width, height, center } = normalizeViewport(this.options);
            const n = this.model.nodeCount();
            if (!n || n === 1) {
                applySingleNodeLayout(this.model, center);
                return;
            }
            const { ordering, nodeSpacing, nodeSize, endAngle = 2 * Math.PI, startAngle = 0, divisions, angleRatio, clockwise, } = this.options;
            // Order nodes based on strategy
            if (ordering === 'topology') {
                // layout according to the graph topology ignoring edge directions
                orderByTopology(this.model, false);
            }
            else if (ordering === 'topology-directed') {
                // layout according to the graph topology considering edge directions
                orderByTopology(this.model, true);
            }
            else if (ordering === 'degree') {
                // layout according to the descent order of degrees
                orderByDegree(this.model, 'asc');
            }
            let { radius, startRadius, endRadius } = this.options;
            const nodes = this.model.nodes();
            const sizeFn = formatNodeSizeFn(nodeSize, nodeSpacing, DEFAULT_LAYOUT_OPTIONS$1.nodeSize, DEFAULT_LAYOUT_OPTIONS$1.nodeSpacing);
            if (nodeSpacing) {
                let perimeter = 0;
                for (const node of nodes) {
                    perimeter += Math.max(...sizeFn(node._original));
                }
                radius = perimeter / (2 * Math.PI);
            }
            else if (!radius && !startRadius && !endRadius) {
                radius = Math.min(height, width) / 2;
            }
            else if (!startRadius && endRadius) {
                startRadius = endRadius;
            }
            else if (startRadius && !endRadius) {
                endRadius = startRadius;
            }
            // Calculate node positions
            const angleStep = (endAngle - startAngle) / n;
            const adjustedStep = angleStep * angleRatio;
            const nodesPerDivision = Math.ceil(n / divisions);
            const divAngle = (2 * Math.PI) / divisions;
            for (let i = 0; i < n;) {
                const node = nodes[i];
                // Calculate radius for this node
                let r = radius;
                if (!r && startRadius !== null && endRadius !== null) {
                    r = startRadius + (i * (endRadius - startRadius)) / (n - 1);
                }
                if (!r) {
                    r = 10 + (i * 100) / (n - 1);
                }
                // Calculate angle for this node
                const divisionIndex = Math.floor(i / nodesPerDivision);
                const indexInDivision = i % nodesPerDivision;
                const theta = indexInDivision * adjustedStep + divAngle * divisionIndex;
                let angle = startAngle + theta;
                if (!clockwise) {
                    angle = endAngle - theta;
                }
                // Set position
                node.x = center[0] + Math.cos(angle) * r;
                node.y = center[1] + Math.sin(angle) * r;
                i++;
            }
        });
    }
}

export { CircularLayout };
//# sourceMappingURL=index.js.map
