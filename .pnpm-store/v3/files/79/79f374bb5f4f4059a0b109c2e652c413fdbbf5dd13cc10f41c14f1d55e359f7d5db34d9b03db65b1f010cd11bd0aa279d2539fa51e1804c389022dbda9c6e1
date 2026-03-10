import EventEmitter from '@antv/event-emitter';
import { SimulationOptions } from './types.js';

declare abstract class BaseSimulation<T extends SimulationOptions = SimulationOptions> extends EventEmitter {
    protected iteration: number;
    protected judgingDistance: number;
    protected running: boolean;
    protected options: T;
    private tickCallback;
    private endCallback;
    private timer;
    initialize(options: T): void;
    on(event: 'tick' | 'end', cb: () => void): this;
    tick(iterations?: number): this;
    restart(): this;
    stop(): this;
    protected abstract runOneStep(): number;
}

export { BaseSimulation, SimulationOptions };
