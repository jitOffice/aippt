import { DataOptions } from '../algorithm/types.js';
import { GraphLib } from '../model/data.js';
import { NodeData, EdgeData, GraphData, Graph, GraphNode, GraphEdge } from '../types/data.js';

declare class RuntimeContext<N extends NodeData = NodeData, E extends EdgeData = EdgeData> {
    readonly graph: GraphLib<N, E>;
    constructor(data: GraphData<N, E>, options?: DataOptions<N, E>);
    export(): Graph<N, E>;
    replace(result: Graph<N, E>): void;
    forEachNode(callback: (node: GraphNode<N>, index: number) => void): void;
    forEachEdge(callback: (edge: GraphEdge<E>, index: number) => void): void;
    destroy(): void;
}

export { RuntimeContext };
