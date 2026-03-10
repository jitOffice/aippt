import { __awaiter } from '../../node_modules/tslib/tslib.es6.js';
import '../../node_modules/@antv/expr/dist/index.esm.js';
import { normalizeViewport } from '../../util/viewport.js';
import { BaseLayout } from '../base-layout.js';

/**
 * <zh/> 随机布局
 *
 * <en/> Random layout
 */
class RandomLayout extends BaseLayout {
    constructor() {
        super(...arguments);
        this.id = 'random';
    }
    getDefaultOptions() {
        return {
            center: [0, 0],
            width: 300,
            height: 300,
        };
    }
    layout() {
        return __awaiter(this, void 0, void 0, function* () {
            const { width, height, center } = normalizeViewport(this.options);
            this.model.forEachNode((node) => {
                node.x = randomCoord(width) + center[0];
                node.y = randomCoord(height) + center[1];
            });
        });
    }
}
const layoutScale = 0.9;
/**
 * <zh/> 生成随机坐标
 *
 * <en/> Generate random coordinates
 */
const randomCoord = (size) => (Math.random() - 0.5) * layoutScale * size;

export { RandomLayout };
//# sourceMappingURL=index.js.map
