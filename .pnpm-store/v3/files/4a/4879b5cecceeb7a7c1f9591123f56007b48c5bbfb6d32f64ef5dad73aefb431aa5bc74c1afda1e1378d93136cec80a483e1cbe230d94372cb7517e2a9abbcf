import { DataOptions } from '../algorithm/types.js';
import { NodeData, EdgeData, GraphNode, GraphEdge, GraphData, Graph } from '../types/data.js';
import { ID } from '../types/id.js';

declare class GraphLib<N extends NodeData = NodeData, E extends EdgeData = EdgeData> {
    nodeMap: Map<ID, GraphNode<N>>;
    edgeMap: Map<ID, GraphEdge<E>>;
    private degreeCache?;
    private inAdjacencyCache?;
    private outAdjacencyCache?;
    private bothAdjacencyCache?;
    private nodeIndexCache?;
    private indexNodeCache?;
    private edgeIdCounter;
    constructor(data: GraphData<N, E>, options?: DataOptions<N, E>);
    data(): Graph<N, E>;
    replace(result: Graph<N, E>): void;
    nodes(): GraphNode<N>[];
    node(id: ID): GraphNode<N> | undefined;
    nodeAt(index: number): GraphNode<N> | undefined;
    nodeIndexOf(id: ID): number;
    firstNode(): GraphNode<N> | undefined;
    forEachNode(callback: (node: GraphNode<N>, index: number) => void): void;
    originalNode(id: ID): N | undefined;
    nodeCount(): number;
    edges(): GraphEdge<E>[];
    edge(id: ID): GraphEdge<E> | undefined;
    firstEdge(): GraphEdge<E> | undefined;
    forEachEdge(callback: (edge: GraphEdge<E>, index: number) => void): void;
    originalEdge(id: ID): E | undefined;
    edgeCount(): number;
    getEdgeId(edge: E): string;
    degree(nodeId: ID, direction?: 'in' | 'out' | 'both'): number;
    neighbors(nodeId: ID, direction?: 'in' | 'out' | 'both'): ID[];
    successors(nodeId: ID): ID[];
    predecessors(nodeId: ID): ID[];
    setNodeOrder(nodes: GraphNode<N>[]): void;
    clearCache(): void;
    private buildDegreeCache;
    private buildAdjacencyCache;
    private buildNodeIndexCache;
    destroy(): void;
}
declare function initNodePosition<N extends NodeData = NodeData>(model: GraphLib<N>, width: number, height: number, dimensions?: 2 | 3): void;

export { GraphLib, initNodePosition };
