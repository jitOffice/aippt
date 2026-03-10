import { __awaiter } from '../../node_modules/tslib/tslib.es6.js';
import { initNodePosition } from '../../model/data.js';
import { applySingleNodeLayout } from '../../util/common.js';
import '../../node_modules/@antv/expr/dist/index.esm.js';
import { formatNodeSizeFn } from '../../util/format.js';
import { normalizeViewport } from '../../util/viewport.js';
import { BaseLayoutWithIterations } from '../base-layout.js';
import { Simulation } from './simulation.js';

const DEFAULTS_LAYOUT_OPTIONS$4 = {
    nodeSize: 10,
    nodeSpacing: 0,
    width: 300,
    height: 300,
    kr: 5,
    kg: 1,
    mode: 'normal',
    preventOverlap: false,
    dissuadeHubs: false,
    maxIteration: 0,
    ks: 0.1,
    ksmax: 10,
    tao: 0.1,
};
class ForceAtlas2Layout extends BaseLayoutWithIterations {
    constructor() {
        super(...arguments);
        this.id = 'force-atlas2';
        this.simulation = null;
    }
    getDefaultOptions() {
        return DEFAULTS_LAYOUT_OPTIONS$4;
    }
    layout(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const merged = this.parseOptions(options);
            const { width, height, prune, center } = merged;
            const n = this.model.nodeCount();
            if (!n || n === 1) {
                return applySingleNodeLayout(this.model, center);
            }
            initNodePosition(this.model, width, height);
            const sizes = this.getSizes(merged.nodeSize, merged.nodeSpacing);
            const simulation = this.setSimulation();
            simulation.data(this.model, sizes);
            simulation.initialize(merged);
            simulation.restart();
            const run = () => new Promise((resolve) => {
                simulation.on('end', resolve);
            });
            if (!prune)
                return run();
            yield run();
            // prune: 把叶子节点贴到父节点并再运行若干次以收敛
            if (prune) {
                const edges = this.model.edges();
                for (let j = 0; j < edges.length; j += 1) {
                    const { source, target } = edges[j];
                    const sourceDegree = this.model.degree(source);
                    const targetDegree = this.model.degree(target);
                    const sourceNode = this.model.node(source);
                    const targetNode = this.model.node(target);
                    if (sourceDegree <= 1) {
                        sourceNode.x = targetNode.x;
                        sourceNode.y = targetNode.y;
                    }
                    else if (targetDegree <= 1) {
                        targetNode.x = sourceNode.x;
                        targetNode.y = sourceNode.y;
                    }
                }
                simulation.initialize(Object.assign(Object.assign({}, merged), { prune: false, barnesHut: false }));
                simulation.tick(100);
            }
        });
    }
    getSizes(nodeSize, nodeSpacing) {
        const result = {};
        const nodeSizeFn = formatNodeSizeFn(nodeSize, nodeSpacing, DEFAULTS_LAYOUT_OPTIONS$4.nodeSize, DEFAULTS_LAYOUT_OPTIONS$4.nodeSpacing);
        this.model.forEachNode((node) => {
            result[node.id] = Math.max(...nodeSizeFn(node._original));
        });
        return result;
    }
    setSimulation() {
        const simulation = this.simulation || new Simulation();
        if (!this.simulation) {
            this.simulation = simulation.on('tick', () => { var _a, _b; return (_b = (_a = this.options).onTick) === null || _b === void 0 ? void 0 : _b.call(_a, this); });
        }
        return this.simulation;
    }
    parseOptions(options = {}) {
        const { barnesHut, prune, maxIteration, kr, kg } = options;
        const auto = {};
        const n = this.model.nodeCount();
        if (barnesHut === undefined && n > 250)
            auto.barnesHut = true;
        if (prune === undefined && n > 100)
            auto.prune = true;
        if (maxIteration === 0 && !prune) {
            auto.maxIteration = 250;
            if (n <= 200 && n > 100)
                auto.maxIteration = 1000;
            else if (n > 200)
                auto.maxIteration = 1200;
        }
        else if (maxIteration === 0 && prune) {
            auto.maxIteration = 100;
            if (n <= 200 && n > 100)
                auto.maxIteration = 500;
            else if (n > 200)
                auto.maxIteration = 950;
        }
        if (!kr) {
            auto.kr = 50;
            if (n > 100 && n <= 500)
                auto.kr = 20;
            else if (n > 500)
                auto.kr = 1;
        }
        if (!kg) {
            auto.kg = 20;
            if (n > 100 && n <= 500)
                auto.kg = 10;
            else if (n > 500)
                auto.kg = 1;
        }
        return Object.assign(Object.assign(Object.assign({}, options), auto), normalizeViewport(options));
    }
    stop() {
        var _a;
        (_a = this.simulation) === null || _a === void 0 ? void 0 : _a.stop();
    }
    tick(iterations = 1) {
        var _a;
        (_a = this.simulation) === null || _a === void 0 ? void 0 : _a.tick(iterations);
    }
    restart() {
        var _a;
        (_a = this.simulation) === null || _a === void 0 ? void 0 : _a.restart();
    }
    setFixedPosition(id, position) {
        var _a;
        (_a = this.simulation) === null || _a === void 0 ? void 0 : _a.setFixedPosition(id, position);
    }
    destroy() {
        var _a;
        super.destroy();
        this.stop();
        (_a = this.simulation) === null || _a === void 0 ? void 0 : _a.destroy();
        this.simulation = null;
    }
}

export { ForceAtlas2Layout };
//# sourceMappingURL=index.js.map
