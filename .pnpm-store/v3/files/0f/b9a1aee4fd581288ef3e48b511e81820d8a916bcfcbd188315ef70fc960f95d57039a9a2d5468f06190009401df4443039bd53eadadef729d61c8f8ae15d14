import { __awaiter } from '../../node_modules/tslib/tslib.es6.js';
import { initNodePosition } from '../../model/data.js';
import '../../node_modules/@antv/expr/dist/index.esm.js';
import { formatFn, formatNumberFn, formatNodeSizeFn } from '../../util/format.js';
import { normalizeViewport } from '../../util/viewport.js';
import { BaseLayoutWithIterations } from '../base-layout.js';
import { forceAttractive } from './attractive.js';
import { forceCentripetal } from './centripetal.js';
import { forceCollide } from './collide.js';
import { forceGravity } from './gravity.js';
import { forceRepulsive } from './repulsive.js';
import { ForceSimulation } from './simulation.js';
import isEmpty from '../../node_modules/@antv/util/esm/lodash/is-empty.js';

const DEFAULTS_LAYOUT_OPTIONS$5 = {
    nodeSize: 30,
    dimensions: 2,
    maxIteration: 500,
    gravity: 10,
    factor: 1,
    edgeStrength: 50,
    nodeStrength: 1000,
    coulombDisScale: 0.005,
    damping: 0.9,
    maxSpeed: 200,
    minMovement: 0.4,
    interval: 0.02,
    linkDistance: 200,
    clusterNodeStrength: 20,
    collideStrength: 1,
    preventOverlap: true,
    distanceThresholdMode: 'mean',
};
/**
 * <zh/> 力导向布局 (Force)
 *
 * <en/> Force-directed layout (Force)
 *
 * @remarks
 * <zh/> 基于自定义物理模拟的力导向布局，使用库伦定律计算斥力，胡克定律计算引力
 *
 * <en/> Force-directed layout based on custom physics simulation, using Coulomb's law for repulsion and Hooke's law for attraction
 */
class ForceLayout extends BaseLayoutWithIterations {
    constructor() {
        super(...arguments);
        this.id = 'force';
        this.simulation = null;
    }
    getDefaultOptions() {
        return DEFAULTS_LAYOUT_OPTIONS$5;
    }
    layout() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.parseOptions(this.options);
            const { width, height, dimensions } = options;
            this.initializePhysicsData(this.model, options);
            initNodePosition(this.model, width, height, dimensions);
            if (!((_a = this.model.nodes()) === null || _a === void 0 ? void 0 : _a.length))
                return;
            const simulation = this.setSimulation(options);
            simulation.data(this.model);
            simulation.initialize(options);
            simulation.restart();
            return new Promise((resolve) => {
                simulation.on('end', () => resolve());
            });
        });
    }
    /**
     * Initialize physics properties on model nodes and edges
     */
    initializePhysicsData(model, options) {
        const { nodeSize, getMass, nodeStrength, edgeStrength, linkDistance } = options;
        model.forEachNode((node) => {
            const raw = node._original;
            node.size = nodeSize(raw);
            node.mass = getMass(raw);
            node.nodeStrength = nodeStrength(raw);
        });
        model.forEachEdge((edge) => {
            const raw = edge._original;
            edge.edgeStrength = edgeStrength(raw);
            edge.linkDistance = linkDistance(raw, model.originalNode(edge.source), model.originalNode(edge.target));
        });
    }
    /**
     * Setup simulation and forces
     */
    setSimulation(options) {
        const simulation = this.simulation || new ForceSimulation();
        if (!this.simulation) {
            this.simulation = simulation.on('tick', () => {
                var _a;
                (_a = options.onTick) === null || _a === void 0 ? void 0 : _a.call(options, this);
            });
        }
        // Setup all forces
        this.setupRepulsiveForce(simulation, options);
        this.setupAttractiveForce(simulation, options);
        this.setupCollideForce(simulation, options);
        this.setupGravityForce(simulation, options);
        this.setupCentripetalForce(simulation, options);
        return simulation;
    }
    /**
     * Setup repulsive force (Coulomb's law)
     */
    setupRepulsiveForce(simulation, options) {
        const { factor, coulombDisScale, dimensions } = options;
        let force = simulation.force('repulsive');
        if (!force) {
            force = forceRepulsive(factor, coulombDisScale, dimensions);
            simulation.force('repulsive', force);
        }
        if (force.factor)
            force.factor(factor);
        if (force.coulombDisScale)
            force.coulombDisScale(coulombDisScale);
        if (force.dimensions)
            force.dimensions(dimensions);
    }
    /**
     * Setup attractive force (Hooke's law)
     */
    setupAttractiveForce(simulation, options) {
        const { dimensions, preventOverlap } = options;
        const edges = this.model.edges() || [];
        if (edges.length > 0) {
            let force = simulation.force('attractive');
            if (!force) {
                force = forceAttractive(dimensions);
                simulation.force('attractive', force);
            }
            if (force.dimensions)
                force.dimensions(dimensions);
            if (force.preventOverlap)
                force.preventOverlap(preventOverlap);
        }
        else {
            simulation.force('attractive', null);
        }
    }
    /**
     * Setup gravity force toward center
     */
    setupGravityForce(simulation, options) {
        const { center, gravity, getCenter } = options;
        if (gravity) {
            let force = simulation.force('gravity');
            if (!force) {
                force = forceGravity(center, gravity);
                simulation.force('gravity', force);
            }
            if (force.center)
                force.center(center);
            if (force.gravity)
                force.gravity(gravity);
            if (force.getCenter)
                force.getCenter(getCenter);
        }
        else {
            simulation.force('gravity', null);
        }
    }
    /**
     * Setup collision force to prevent overlap
     */
    setupCollideForce(simulation, options) {
        const { preventOverlap, collideStrength = 1, dimensions } = options;
        if (preventOverlap && collideStrength) {
            let force = simulation.force('collide');
            if (!force) {
                force = forceCollide(dimensions);
                simulation.force('collide', force);
            }
            if (force.strength)
                force.strength(collideStrength);
            if (force.dimensions)
                force.dimensions(dimensions);
        }
        else {
            simulation.force('collide', null);
        }
    }
    /**
     * Setup centripetal force (unique to Force)
     */
    setupCentripetalForce(simulation, options) {
        const { centripetalOptions, width, height } = options;
        if (centripetalOptions) {
            let force = simulation.force('centripetal');
            if (!force) {
                force = forceCentripetal();
                simulation.force('centripetal', force);
            }
            if (force.options)
                force.options(centripetalOptions);
            if (force.width)
                force.width(width);
            if (force.height)
                force.height(height);
        }
        else {
            simulation.force('centripetal', null);
        }
    }
    /**
     * Parse and format options
     */
    parseOptions(options) {
        const _ = Object.assign(Object.assign({}, options), normalizeViewport(options));
        // Format nodeClusterBy (for clustering / leafCluster)
        if (_.nodeClusterBy) {
            _.nodeClusterBy = formatFn(_.nodeClusterBy, ['node']);
        }
        // Format node mass
        if (!options.getMass) {
            _.getMass = (node) => {
                if (!node)
                    return 1;
                const massWeight = 1;
                const degree = this.model.degree(node.id, 'both');
                return !degree || degree < 5 ? massWeight : degree * 5 * massWeight;
            };
        }
        else {
            _.getMass = formatNumberFn(options.getMass, 1);
        }
        // Format per-node center force callback
        if (options.getCenter) {
            const params = ['node', 'degree'];
            _.getCenter = formatFn(options.getCenter, params);
        }
        // Format node size
        const nodeSizeVec = formatNodeSizeFn(options.nodeSize, options.nodeSpacing);
        _.nodeSize = (node) => {
            if (!node)
                return 0;
            const [w, h, z] = nodeSizeVec(node);
            return Math.max(w, h, z);
        };
        // Format node / edge strengths
        _.linkDistance = options.linkDistance
            ? formatFn(options.linkDistance, ['edge', 'source', 'target'])
            : (_, source, target) => 1 + _.nodeSize(source) + _.nodeSize(target);
        _.nodeStrength = formatNumberFn(options.nodeStrength, 1);
        _.edgeStrength = formatNumberFn(options.edgeStrength, 1, 'edge');
        _.clusterNodeStrength = formatNumberFn(options.clusterNodeStrength, 1);
        // Format centripetal options
        this.formatCentripetal(_);
        return _;
    }
    /**
     * Format centripetal options
     */
    formatCentripetal(options) {
        var _a, _b;
        const { dimensions, centripetalOptions, center, leafCluster, clustering, nodeClusterBy, } = options;
        const leafParams = ['node', 'nodes', 'edges'];
        const leafFn = formatFn(centripetalOptions === null || centripetalOptions === void 0 ? void 0 : centripetalOptions.leaf, leafParams);
        const singleFn = formatNumberFn(centripetalOptions === null || centripetalOptions === void 0 ? void 0 : centripetalOptions.single, 2);
        const othersFn = formatNumberFn(centripetalOptions === null || centripetalOptions === void 0 ? void 0 : centripetalOptions.others, 1);
        const centerRaw = (_a = centripetalOptions === null || centripetalOptions === void 0 ? void 0 : centripetalOptions.center) !== null && _a !== void 0 ? _a : ((_) => {
            return {
                x: center[0],
                y: center[1],
                z: dimensions === 3 ? center[2] : undefined,
            };
        });
        const centerFn = formatFn(centerRaw, [
            'node',
            'nodes',
            'edges',
            'width',
            'height',
        ]);
        const basicCentripetal = Object.assign(Object.assign({}, centripetalOptions), { leaf: leafFn, single: singleFn, others: othersFn, center: centerFn });
        // If user provided centripetalOptions, normalize them even without clustering modes.
        if (centripetalOptions) {
            options.centripetalOptions = basicCentripetal;
        }
        let sameTypeLeafMap;
        let clusters;
        // Leaf cluster mode
        if (leafCluster && nodeClusterBy) {
            sameTypeLeafMap = this.getSameTypeLeafMap(nodeClusterBy);
            clusters =
                Array.from(new Set((_b = this.model
                    .nodes()) === null || _b === void 0 ? void 0 : _b.map((node) => nodeClusterBy(node._original)))) || [];
            options.centripetalOptions = Object.assign({}, basicCentripetal, {
                single: () => 100,
                leaf: (node) => {
                    const { siblingLeaves, sameTypeLeaves } = sameTypeLeafMap[node.id] || {};
                    if ((sameTypeLeaves === null || sameTypeLeaves === void 0 ? void 0 : sameTypeLeaves.length) === (siblingLeaves === null || siblingLeaves === void 0 ? void 0 : siblingLeaves.length) ||
                        (clusters === null || clusters === void 0 ? void 0 : clusters.length) === 1) {
                        return 1;
                    }
                    return options.clusterNodeStrength(node);
                },
                others: () => 1,
                center: (node) => {
                    const degree = this.model.degree(node.id, 'both');
                    if (!degree) {
                        return { x: 100, y: 100, z: 0 };
                    }
                    let centerPos;
                    if (degree === 1) {
                        const { sameTypeLeaves = [] } = sameTypeLeafMap[node.id] || {};
                        if (sameTypeLeaves.length === 1) {
                            centerPos = undefined;
                        }
                        else if (sameTypeLeaves.length > 1) {
                            centerPos = this.getAvgNodePosition(sameTypeLeaves);
                        }
                    }
                    else {
                        centerPos = undefined;
                    }
                    return {
                        x: centerPos === null || centerPos === void 0 ? void 0 : centerPos.x,
                        y: centerPos === null || centerPos === void 0 ? void 0 : centerPos.y,
                        z: centerPos === null || centerPos === void 0 ? void 0 : centerPos.z,
                    };
                },
            });
        }
        // Full clustering mode
        if (clustering && nodeClusterBy) {
            if (!sameTypeLeafMap) {
                sameTypeLeafMap = this.getSameTypeLeafMap(nodeClusterBy);
            }
            let clusters = [];
            if (isEmpty(clusters)) {
                this.model.forEachNode((node) => {
                    const cluster = nodeClusterBy(node._original);
                    if (cluster && !clusters.includes(cluster)) {
                        clusters.push(cluster);
                    }
                });
            }
            const centerInfo = {};
            clusters.forEach((cluster) => {
                const sameTypeNodes = this.model
                    .nodes()
                    .filter((node) => nodeClusterBy(node._original) === cluster);
                centerInfo[cluster] = this.getAvgNodePosition(sameTypeNodes);
            });
            options.centripetalOptions = Object.assign(basicCentripetal, {
                single: (node) => options.clusterNodeStrength(node),
                leaf: (node) => options.clusterNodeStrength(node),
                others: (node) => options.clusterNodeStrength(node),
                center: (node) => {
                    const centerPos = centerInfo[nodeClusterBy(node._original)];
                    return {
                        x: centerPos === null || centerPos === void 0 ? void 0 : centerPos.x,
                        y: centerPos === null || centerPos === void 0 ? void 0 : centerPos.y,
                        z: centerPos === null || centerPos === void 0 ? void 0 : centerPos.z,
                    };
                },
            });
        }
    }
    /**
     * Get same type leaf map for clustering
     */
    getSameTypeLeafMap(nodeClusterBy) {
        const sameTypeLeafMap = {};
        this.model.forEachNode((node) => {
            const degree = this.model.degree(node.id, 'both');
            if (degree === 1) {
                sameTypeLeafMap[node.id] = this.getCoreNodeAndSiblingLeaves(node, nodeClusterBy);
            }
        });
        return sameTypeLeafMap;
    }
    /**
     * Get core node and sibling leaves
     */
    getCoreNodeAndSiblingLeaves(node, nodeClusterBy) {
        const inDegree = this.model.degree(node.id, 'in');
        const outDegree = this.model.degree(node.id, 'out');
        let coreNode = node;
        let siblingLeaves = [];
        if (inDegree === 0) {
            const successors = this.model.successors(node.id);
            coreNode = this.model.node(successors[0]);
            siblingLeaves = this.model
                .neighbors(coreNode.id)
                .map((id) => this.model.node(id));
        }
        else if (outDegree === 0) {
            const predecessors = this.model.predecessors(node.id);
            coreNode = this.model.node(predecessors[0]);
            siblingLeaves = this.model
                .neighbors(coreNode.id)
                .map((id) => this.model.node(id));
        }
        siblingLeaves = siblingLeaves.filter((n) => this.model.degree(n.id, 'in') === 0 ||
            this.model.degree(n.id, 'out') === 0);
        const typeName = nodeClusterBy(node._original) || '';
        const sameTypeLeaves = siblingLeaves.filter((item) => nodeClusterBy(item._original) === typeName &&
            (this.model.degree(item.id, 'in') === 0 ||
                this.model.degree(item.id, 'out') === 0));
        return { coreNode, siblingLeaves, sameTypeLeaves };
    }
    /**
     * Get average position of nodes
     */
    getAvgNodePosition(nodes) {
        const totalNodes = { x: 0, y: 0 };
        nodes.forEach((node) => {
            totalNodes.x += node.x || 0;
            totalNodes.y += node.y || 0;
        });
        const n = nodes.length || 1;
        return {
            x: totalNodes.x / n,
            y: totalNodes.y / n,
        };
    }
    /**
     * Manually step the simulation
     */
    tick(iterations = 1) {
        if (this.simulation) {
            this.simulation.tick(iterations);
        }
        return this;
    }
    /**
     * Stop the simulation
     */
    stop() {
        if (this.simulation) {
            this.simulation.stop();
        }
        return this;
    }
    /**
     * Restart the simulation
     */
    restart() {
        if (this.simulation) {
            this.simulation.restart();
        }
        return this;
    }
    /**
     * Set fixed position for a node
     */
    setFixedPosition(nodeId, position) {
        if (this.simulation) {
            this.simulation.setFixedPosition(nodeId, position);
        }
        return this;
    }
}

export { ForceLayout };
//# sourceMappingURL=index.js.map
