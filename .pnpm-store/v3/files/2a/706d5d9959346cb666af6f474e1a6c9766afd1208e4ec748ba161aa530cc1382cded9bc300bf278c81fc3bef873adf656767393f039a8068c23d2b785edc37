import { GraphLib } from '../model/data.js';
import { RuntimeContext } from '../runtime/context.js';
import { Supervisor } from '../runtime/supervisor.js';
import { GraphData, GraphNode, GraphEdge } from '../types/data.js';
import { BaseLayoutOptions, Layout, LayoutWithIterations } from './types.js';
import { Point } from '../types/point.js';

/**
 * <zh/> 布局基类
 *
 * <en/> Base class for layouts
 */
declare abstract class BaseLayout<O extends BaseLayoutOptions = BaseLayoutOptions> implements Layout<O> {
    abstract readonly id: string;
    protected abstract getDefaultOptions(): O;
    protected initialOptions: O;
    protected runtimeOptions: O;
    protected context: RuntimeContext;
    protected model: GraphLib;
    protected supervisor: Supervisor | null;
    constructor(options?: Partial<O>);
    get options(): O;
    protected mergeOptions<O>(base: O, patch?: Partial<O>): O;
    execute(data: GraphData, userOptions?: Partial<O>): Promise<void>;
    protected abstract layout(options: O): Promise<void>;
    protected layoutInWorker(data: GraphData, options: O): Promise<void>;
    forEachNode(callback: (node: GraphNode, index: number) => void): void;
    forEachEdge(callback: (edge: GraphEdge, index: number) => void): void;
    destroy(): void;
}
/**
 * <zh/> 迭代布局基类
 *
 * <en/> Base class for iterative layouts
 */
declare abstract class BaseLayoutWithIterations<O extends BaseLayoutOptions = BaseLayoutOptions> extends BaseLayout<O> {
    abstract stop(): void;
    abstract tick(iterations: number): void;
    abstract restart(): void;
    abstract setFixedPosition(nodeId: string, position: Point | null): void;
}
/**
 * <zh/> 判断布局是否为迭代布局
 *
 * <en/> Determine whether the layout is an iterative layout
 */
declare function isLayoutWithIterations(layout: any): layout is LayoutWithIterations;

export { BaseLayout, BaseLayoutOptions, BaseLayoutWithIterations, isLayoutWithIterations };
