import { __awaiter } from '../node_modules/tslib/tslib.es6.js';
import { RuntimeContext } from '../runtime/context.js';
import { Supervisor } from '../runtime/supervisor.js';

/**
 * <zh/> 布局基类
 *
 * <en/> Base class for layouts
 */
class BaseLayout {
    constructor(options) {
        this.supervisor = null;
        this.initialOptions = this.mergeOptions(this.getDefaultOptions(), options);
    }
    get options() {
        return this.runtimeOptions || this.initialOptions;
    }
    mergeOptions(base, patch) {
        return Object.assign({}, base, patch || {});
    }
    execute(data, userOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            this.runtimeOptions = this.mergeOptions(this.initialOptions, userOptions);
            const { node, edge, enableWorker } = this.runtimeOptions;
            this.context = new RuntimeContext(data, { node, edge });
            this.model = this.context.graph;
            const shouldUseWorker = enableWorker && typeof Worker !== 'undefined';
            if (shouldUseWorker) {
                yield this.layoutInWorker(data, this.runtimeOptions);
            }
            else {
                yield this.layout(this.runtimeOptions);
            }
        });
    }
    layoutInWorker(data, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.supervisor) {
                    this.supervisor = new Supervisor();
                }
                const result = yield this.supervisor.execute(this.id, data, options);
                (_a = this.context) === null || _a === void 0 ? void 0 : _a.replace(result);
            }
            catch (error) {
                console.error('Layout in worker failed, fallback to main thread layout.', error);
                // Fallback to main thread layout
                yield this.layout(options);
            }
        });
    }
    forEachNode(callback) {
        this.context.forEachNode(callback);
    }
    forEachEdge(callback) {
        this.context.forEachEdge(callback);
    }
    destroy() {
        var _a;
        (_a = this.context) === null || _a === void 0 ? void 0 : _a.destroy();
        // @ts-ignore
        this.model = null;
        // @ts-ignore
        this.context = null;
        if (this.supervisor) {
            this.supervisor.destroy();
            this.supervisor = null;
        }
    }
}
/**
 * <zh/> 迭代布局基类
 *
 * <en/> Base class for iterative layouts
 */
class BaseLayoutWithIterations extends BaseLayout {
}
/**
 * <zh/> 判断布局是否为迭代布局
 *
 * <en/> Determine whether the layout is an iterative layout
 */
function isLayoutWithIterations(layout) {
    return !!layout.tick && !!layout.stop;
}

export { BaseLayout, BaseLayoutWithIterations, isLayoutWithIterations };
//# sourceMappingURL=base-layout.js.map
