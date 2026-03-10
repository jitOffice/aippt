import { __awaiter } from '../../node_modules/tslib/tslib.es6.js';
import { initNodePosition } from '../../model/data.js';
import { applySingleNodeLayout } from '../../util/common.js';
import '../../node_modules/@antv/expr/dist/index.esm.js';
import { formatFn } from '../../util/format.js';
import { normalizeViewport } from '../../util/viewport.js';
import { BaseLayoutWithIterations } from '../base-layout.js';
import { Simulation } from './simulation.js';

const DEFAULTS_LAYOUT_OPTIONS$3 = {
    maxIteration: 1000,
    gravity: 10,
    speed: 5,
    clustering: false,
    clusterGravity: 10,
    width: 300,
    height: 300,
    nodeClusterBy: 'node.cluster',
    dimensions: 2,
};
class FruchtermanLayout extends BaseLayoutWithIterations {
    constructor() {
        super(...arguments);
        this.id = 'fruchterman';
        this.simulation = null;
    }
    getDefaultOptions() {
        return DEFAULTS_LAYOUT_OPTIONS$3;
    }
    parseOptions(options = {}) {
        const { clustering, nodeClusterBy } = this.options;
        const clusteringEnabled = clustering && !!nodeClusterBy;
        Object.assign(options, normalizeViewport(options), {
            clustering: clusteringEnabled,
            nodeClusterBy: formatFn(nodeClusterBy, ['node']),
        });
        return options;
    }
    layout() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.parseOptions(this.options);
            const { dimensions, center, width, height } = options;
            const n = this.model.nodeCount();
            if (!n || n === 1) {
                applySingleNodeLayout(this.model, center, dimensions);
                return;
            }
            initNodePosition(this.model, width, height, dimensions);
            const simulation = this.setSimulation();
            simulation.data(this.model);
            simulation.initialize(options);
            simulation.restart();
            return new Promise((resolve) => {
                simulation.on('end', () => resolve());
            });
        });
    }
    setSimulation() {
        const simulation = this.simulation || new Simulation();
        if (!this.simulation) {
            this.simulation = simulation.on('tick', () => { var _a, _b; return (_b = (_a = this.options).onTick) === null || _b === void 0 ? void 0 : _b.call(_a, this); });
        }
        return this.simulation;
    }
    restart() {
        var _a;
        (_a = this.simulation) === null || _a === void 0 ? void 0 : _a.restart();
    }
    stop() {
        var _a;
        (_a = this.simulation) === null || _a === void 0 ? void 0 : _a.stop();
    }
    tick(iterations = 1) {
        var _a;
        (_a = this.simulation) === null || _a === void 0 ? void 0 : _a.tick(iterations);
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

export { FruchtermanLayout };
//# sourceMappingURL=index.js.map
