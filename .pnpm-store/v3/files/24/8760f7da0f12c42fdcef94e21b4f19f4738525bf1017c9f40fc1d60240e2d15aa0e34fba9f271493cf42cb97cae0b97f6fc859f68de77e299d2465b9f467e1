import { __awaiter } from '../../node_modules/tslib/tslib.es6.js';
import '../../node_modules/@antv/expr/dist/index.esm.js';
import { formatFn, formatNodeSizeFn } from '../../util/format.js';
import { assignDefined } from '../../util/object.js';
import { normalizeViewport } from '../../util/viewport.js';
import { BaseLayoutWithIterations } from '../base-layout.js';
import forceInABox from './force-in-a-box.js';
import deepMix from '../../node_modules/@antv/util/esm/lodash/deep-mix.js';
import forceSimulation from '../../node_modules/d3-force/src/simulation.js';
import forceCenter from '../../node_modules/d3-force/src/center.js';
import forceManyBody from '../../node_modules/d3-force/src/manyBody.js';
import forceLink from '../../node_modules/d3-force/src/link.js';
import forceCollide from '../../node_modules/d3-force/src/collide.js';
import forceX from '../../node_modules/d3-force/src/x.js';
import forceY from '../../node_modules/d3-force/src/y.js';
import forceRadial from '../../node_modules/d3-force/src/radial.js';

const DEFAULTS_LAYOUT_OPTIONS$6 = {
    edgeId: 'edge.id',
    manyBody: {
        strength: -30,
    },
    preventOverlap: false,
    nodeSize: 10,
    nodeSpacing: 0,
    x: false,
    y: false,
    clustering: false,
    clusterNodeStrength: -1,
    clusterEdgeStrength: 0.1,
    clusterEdgeDistance: 100,
    clusterFociStrength: 0.8,
    clusterNodeSize: 10,
};
class D3ForceLayout extends BaseLayoutWithIterations {
    getDefaultOptions() {
        return DEFAULTS_LAYOUT_OPTIONS$6;
    }
    mergeOptions(base, patch) {
        return deepMix({}, base, patch);
    }
    constructor(options) {
        super(options);
        this.id = 'd3-force';
        this.d3Nodes = [];
        this.d3Edges = [];
        this.config = {
            simulationAttrs: [
                'alpha',
                'alphaMin',
                'alphaDecay',
                'alphaTarget',
                'velocityDecay',
                'randomSource',
            ],
        };
        if (this.options.forceSimulation) {
            this.simulation = this.options.forceSimulation;
        }
    }
    stop() {
        if (this.simulation) {
            this.simulation.stop();
        }
        return this;
    }
    tick(iterations = 1) {
        var _a, _b;
        if (this.simulation) {
            for (let i = 0; i < iterations; i++) {
                this.simulation.tick();
            }
            this.syncPositionsFromD3();
            (_b = (_a = this.options).onTick) === null || _b === void 0 ? void 0 : _b.call(_a, this);
        }
        return this;
    }
    restart(alpha) {
        if (this.simulation) {
            if (alpha !== undefined) {
                this.simulation.alpha(alpha);
            }
            this.simulation.restart();
        }
        return this;
    }
    reheat() {
        return this.restart(1);
    }
    getAlpha() {
        var _a, _b;
        return (_b = (_a = this.simulation) === null || _a === void 0 ? void 0 : _a.alpha()) !== null && _b !== void 0 ? _b : 0;
    }
    setAlpha(alpha) {
        if (this.simulation) {
            this.simulation.alpha(alpha);
        }
        return this;
    }
    getForce(name) {
        var _a;
        return (_a = this.simulation) === null || _a === void 0 ? void 0 : _a.force(name);
    }
    force(name, force) {
        if (this.simulation) {
            this.simulation.force(name, force);
        }
        return this;
    }
    nodes() {
        var _a, _b;
        return (_b = (_a = this.simulation) === null || _a === void 0 ? void 0 : _a.nodes()) !== null && _b !== void 0 ? _b : [];
    }
    find(x, y, radius) {
        if (!this.simulation)
            return undefined;
        return this.simulation.find(x, y, radius);
    }
    setFixedPosition(id, position) {
        const d3Node = this.d3Nodes.find((n) => n.id === id);
        const node = this.model.node(id);
        if (!node || !d3Node)
            return;
        const keys = ['fx', 'fy', 'fz'];
        if (position === null) {
            // Unset fixed position
            keys.forEach((key) => {
                delete node[key];
                delete d3Node[key];
            });
            return;
        }
        position.forEach((value, index) => {
            if (index < keys.length &&
                (typeof value === 'number' || value === null)) {
                node[keys[index]] = value;
                d3Node[keys[index]] = value;
            }
        });
    }
    parseOptions(options) {
        const _ = options;
        // process iterations
        if (_.iterations === undefined) {
            if (_.link && _.link.iterations === undefined) {
                _.iterations = _.link.iterations;
            }
            if (_.collide && _.collide.iterations === undefined) {
                _.iterations = _.collide.iterations;
            }
        }
        return _;
    }
    layout() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.parseOptions(this.options || {});
            this.createD3Copies();
            const simulation = this.setSimulation(options);
            simulation.nodes(this.d3Nodes);
            (_a = simulation.force('link')) === null || _a === void 0 ? void 0 : _a.links(this.d3Edges);
            return new Promise((resolve) => {
                simulation.on('end', () => {
                    this.syncPositionsFromD3();
                    resolve();
                });
            });
        });
    }
    createD3Copies() {
        this.d3Nodes = [];
        this.d3Edges = [];
        this.model.forEachNode((node) => {
            this.d3Nodes.push(Object.assign({}, node));
        });
        this.model.forEachEdge((edge) => {
            this.d3Edges.push(Object.assign({}, edge));
        });
    }
    syncPositionsFromD3() {
        this.d3Nodes.forEach((d3Node) => {
            const node = this.model.node(d3Node.id);
            if (node) {
                node.x = d3Node.x;
                node.y = d3Node.y;
                if (d3Node.z !== undefined)
                    node.z = d3Node.z;
                // 同步固定位置属性
                if (d3Node.fx !== undefined)
                    node.fx = d3Node.fx;
                if (d3Node.fy !== undefined)
                    node.fy = d3Node.fy;
                if (d3Node.fz !== undefined)
                    node.fz = d3Node.fz;
                // 同步速度属性
                if (d3Node.vx !== undefined)
                    node.vx = d3Node.vx;
                if (d3Node.vy !== undefined)
                    node.vy = d3Node.vy;
                if (d3Node.vz !== undefined)
                    node.vz = d3Node.vz;
            }
        });
    }
    initSimulation() {
        return forceSimulation();
    }
    setSimulation(options) {
        const simulation = this.simulation ||
            this.options.forceSimulation ||
            this.initSimulation();
        if (!this.simulation) {
            this.simulation = simulation.on('tick', () => {
                var _a;
                this.syncPositionsFromD3();
                (_a = options.onTick) === null || _a === void 0 ? void 0 : _a.call(options, this);
            });
        }
        apply$1(simulation, this.config.simulationAttrs.map((name) => [
            name,
            options[name],
        ]));
        this.setupForces(simulation, options);
        return simulation;
    }
    setupForces(simulation, options) {
        this.setupLinkForce(simulation, options);
        this.setupManyBodyForce(simulation, options);
        this.setupCenterForce(simulation, options);
        this.setupCollisionForce(simulation, options);
        this.setupXForce(simulation, options);
        this.setupYForce(simulation, options);
        this.setupRadialForce(simulation, options);
        this.setupClusterForce(simulation, options);
    }
    getCenterOptions(options) {
        if (options.center === false)
            return undefined;
        const viewport = normalizeViewport({
            width: options.width,
            height: options.height,
        });
        return assignDefined({}, options.center || {}, {
            x: viewport.width / 2,
            y: viewport.height / 2,
            strength: options.centerStrength,
        });
    }
    setupCenterForce(simulation, options) {
        const center = this.getCenterOptions(options);
        if (center) {
            let force = simulation.force('center');
            if (!force) {
                force = forceCenter(center.x, center.y);
                simulation.force('center', force);
            }
            const params = [];
            if (center.x !== undefined)
                params.push(['x', center.x]);
            if (center.y !== undefined)
                params.push(['y', center.y]);
            if (center.strength !== undefined)
                params.push(['strength', center.strength]);
            apply$1(force, params);
        }
        else {
            simulation.force('center', null);
        }
    }
    getManyBodyOptions(options) {
        if (options.manyBody === false)
            return undefined;
        return assignDefined({}, options.manyBody || {}, {
            strength: options.nodeStrength
                ? formatFn(options.nodeStrength, ['node'])
                : undefined,
            distanceMin: options.distanceMin,
            distanceMax: options.distanceMax,
            theta: options.theta,
        });
    }
    setupManyBodyForce(simulation, options) {
        const manyBody = this.getManyBodyOptions(options);
        if (manyBody) {
            let force = simulation.force('charge');
            if (!force) {
                force = forceManyBody();
                simulation.force('charge', force);
            }
            const params = [];
            if (manyBody.strength !== undefined)
                params.push(['strength', manyBody.strength]);
            if (manyBody.distanceMin !== undefined)
                params.push(['distanceMin', manyBody.distanceMin]);
            if (manyBody.distanceMax !== undefined)
                params.push(['distanceMax', manyBody.distanceMax]);
            if (manyBody.theta !== undefined)
                params.push(['theta', manyBody.theta]);
            apply$1(force, params);
        }
        else {
            simulation.force('charge', null);
        }
    }
    getLinkOptions(options) {
        if (options.link === false)
            return undefined;
        return assignDefined({}, options.link || {}, {
            id: options.edgeId ? formatFn(options.edgeId, ['edge']) : undefined,
            distance: options.linkDistance
                ? formatFn(options.linkDistance, ['edge'])
                : undefined,
            strength: options.edgeStrength
                ? formatFn(options.edgeStrength, ['edge'])
                : undefined,
            iterations: options.edgeIterations,
        });
    }
    setupLinkForce(simulation, options) {
        const edges = this.model.edges();
        const link = this.getLinkOptions(options);
        if (edges.length > 0 && link) {
            let force = simulation.force('link');
            if (!force) {
                force = forceLink();
                simulation.force('link', force);
            }
            const params = [];
            if (link.id !== undefined)
                params.push(['id', link.id]);
            if (link.distance !== undefined)
                params.push(['distance', link.distance]);
            if (link.strength !== undefined)
                params.push(['strength', link.strength]);
            if (link.iterations !== undefined)
                params.push(['iterations', link.iterations]);
            apply$1(force, params);
        }
        else {
            simulation.force('link', null);
        }
    }
    getCollisionOptions(options) {
        if (options.preventOverlap === false &&
            (options.collide === false || options.collide === undefined))
            return undefined;
        const sizeFn = formatNodeSizeFn(options.nodeSize, options.nodeSpacing, DEFAULTS_LAYOUT_OPTIONS$6.nodeSize, DEFAULTS_LAYOUT_OPTIONS$6.nodeSpacing);
        const radius = (d) => Math.max(...sizeFn(d._original)) / 2;
        return assignDefined({}, options.collide || {}, {
            radius: (options.collide && options.collide.radius) || radius,
            strength: options.collideStrength,
            iterations: options.collideIterations,
        });
    }
    setupCollisionForce(simulation, options) {
        const collide = this.getCollisionOptions(options);
        if (collide) {
            let force = simulation.force('collide');
            if (!force) {
                force = forceCollide();
                simulation.force('collide', force);
            }
            const params = [];
            if (collide.radius !== undefined)
                params.push(['radius', collide.radius]);
            if (collide.strength !== undefined)
                params.push(['strength', collide.strength]);
            if (collide.iterations !== undefined)
                params.push(['iterations', collide.iterations]);
            apply$1(force, params);
        }
        else {
            simulation.force('collide', null);
        }
    }
    getXForceOptions(options) {
        var _a;
        if (options.x === false)
            return undefined;
        const center = this.getCenterOptions(options);
        return assignDefined({}, options.x || {}, {
            x: (_a = options.forceXPosition) !== null && _a !== void 0 ? _a : (center && center.x),
            strength: options.forceXStrength,
        });
    }
    setupXForce(simulation, options) {
        const x = this.getXForceOptions(options);
        if (x) {
            let force = simulation.force('x');
            if (!force) {
                force = forceX();
                simulation.force('x', force);
            }
            const params = [];
            if (x.x !== undefined)
                params.push(['x', x.x]);
            if (x.strength !== undefined)
                params.push(['strength', x.strength]);
            apply$1(force, params);
        }
        else {
            simulation.force('x', null);
        }
    }
    getYForceOptions(options) {
        var _a;
        if (options.y === false)
            return undefined;
        const center = this.getCenterOptions(options);
        return assignDefined({}, options.y || {}, {
            y: (_a = options.forceYPosition) !== null && _a !== void 0 ? _a : (center && center.y),
            strength: options.forceYStrength,
        });
    }
    setupYForce(simulation, options) {
        const y = this.getYForceOptions(options);
        if (y) {
            let force = simulation.force('y');
            if (!force) {
                force = forceY();
                simulation.force('y', force);
            }
            const params = [];
            if (y.y !== undefined)
                params.push(['y', y.y]);
            if (y.strength !== undefined)
                params.push(['strength', y.strength]);
            apply$1(force, params);
        }
        else {
            simulation.force('y', null);
        }
    }
    getRadialOptions(options) {
        var _a, _b, _c;
        if (options.radial !== undefined ||
            options.radialStrength !== undefined ||
            options.radialRadius !== undefined ||
            options.radialX !== undefined ||
            options.radialY !== undefined) {
            const center = this.getCenterOptions(options);
            return assignDefined({}, options.radial || {}, {
                strength: options.radialStrength,
                radius: (_a = options.radialRadius) !== null && _a !== void 0 ? _a : 100,
                x: (_b = options.radialX) !== null && _b !== void 0 ? _b : (center && center.x),
                y: (_c = options.radialY) !== null && _c !== void 0 ? _c : (center && center.y),
            });
        }
        return undefined;
    }
    setupRadialForce(simulation, options) {
        const radial = this.getRadialOptions(options);
        if (radial) {
            let force = simulation.force('radial');
            if (!force) {
                force = forceRadial(radial.radius || 100, radial.x, radial.y);
                simulation.force('radial', force);
            }
            const params = [];
            if (radial.radius !== undefined)
                params.push(['radius', radial.radius]);
            if (radial.strength !== undefined)
                params.push(['strength', radial.strength]);
            if (radial.x !== undefined)
                params.push(['x', radial.x]);
            if (radial.y !== undefined)
                params.push(['y', radial.y]);
            apply$1(force, params);
        }
        else {
            simulation.force('radial', null);
        }
    }
    setupClusterForce(simulation, options) {
        const { clustering } = options;
        if (clustering) {
            const { clusterFociStrength, clusterEdgeDistance, clusterEdgeStrength, clusterNodeStrength, clusterNodeSize, clusterBy, } = options;
            const center = this.getCenterOptions(options);
            let force = simulation.force('group');
            if (!force) {
                force = forceInABox();
                simulation.force('group', force);
            }
            apply$1(force, [
                ['centerX', center && center.x],
                ['centerY', center && center.y],
                ['template', 'force'],
                ['strength', clusterFociStrength],
                ['groupBy', clusterBy ? formatFn(clusterBy, ['node']) : undefined],
                ['nodes', this.model.nodes()],
                ['links', this.model.edges()],
                ['forceLinkDistance', clusterEdgeDistance],
                ['forceLinkStrength', clusterEdgeStrength],
                ['forceCharge', clusterNodeStrength],
                ['forceNodeSize', clusterNodeSize],
            ]);
        }
        else {
            simulation.force('group', null);
        }
    }
}
const apply$1 = (target, params) => {
    return params.reduce((acc, [method, param]) => {
        if (!acc[method] || param === undefined)
            return acc;
        return acc[method].call(target, param);
    }, target);
};

export { D3ForceLayout, apply$1 as apply };
//# sourceMappingURL=index.js.map
