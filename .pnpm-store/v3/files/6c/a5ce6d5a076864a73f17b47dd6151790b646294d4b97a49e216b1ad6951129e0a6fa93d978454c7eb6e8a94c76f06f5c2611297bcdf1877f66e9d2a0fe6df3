import EventEmitter from '../node_modules/@antv/event-emitter/esm/index.js';

class BaseSimulation extends EventEmitter {
    constructor() {
        super(...arguments);
        this.iteration = 0;
        this.judgingDistance = Infinity;
        this.running = false;
        this.tickCallback = null;
        this.endCallback = null;
        this.timer = 0;
    }
    initialize(options) {
        this.options = options;
        this.iteration = 0;
        this.judgingDistance = Infinity;
    }
    on(event, cb) {
        if (event === 'tick')
            this.tickCallback = cb;
        if (event === 'end')
            this.endCallback = cb;
        return this;
    }
    tick(iterations = 1) {
        var _a;
        for (let i = 0; i < iterations; i++) {
            const distance = this.runOneStep();
            this.judgingDistance = distance;
            this.iteration++;
            (_a = this.tickCallback) === null || _a === void 0 ? void 0 : _a.call(this);
        }
        return this;
    }
    restart() {
        if (this.running)
            return this;
        const { maxIteration = 500, minMovement = 0, animate = true, } = this.options;
        /** 非动画 or 非浏览器环境 */
        if (!animate || typeof window === 'undefined') {
            while (this.iteration < maxIteration &&
                (this.judgingDistance > minMovement || this.iteration < 1)) {
                this.tick(1);
            }
            Promise.resolve().then(() => {
                var _a;
                (_a = this.endCallback) === null || _a === void 0 ? void 0 : _a.call(this);
            });
            return this;
        }
        /** 动画模式 */
        this.running = true;
        this.timer = window.setInterval(() => {
            var _a;
            this.tick(1);
            if (this.iteration >= maxIteration ||
                this.judgingDistance < minMovement) {
                this.stop();
                (_a = this.endCallback) === null || _a === void 0 ? void 0 : _a.call(this);
            }
        }, 0);
        return this;
    }
    stop() {
        this.running = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = 0;
        }
        return this;
    }
}

export { BaseSimulation };
//# sourceMappingURL=base-simulation.js.map
