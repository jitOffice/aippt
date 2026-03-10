import { PlainObject } from './common.js';
import { EdgeLabelPos } from './edge-label.js';
import { ID } from './id.js';
import { Point } from './point.js';
import { Size } from './size.js';

interface GraphData<N extends NodeData = NodeData, E extends EdgeData = EdgeData> {
    nodes: N[];
    edges?: E[];
}
interface NodeData extends PlainObject {
}
interface EdgeData extends PlainObject {
}
interface GraphNode<N extends NodeData = NodeData> {
    id: ID;
    x: number;
    y: number;
    z?: number;
    /** Applied for compound layout（dagre、antv-dagre、combo-combined） */
    parentId?: ID | null;
    isCombo?: boolean;
    /** Applied for force-directed layout */
    fx?: number | null;
    fy?: number | null;
    fz?: number | null;
    vx?: number;
    vy?: number;
    vz?: number;
    /** Output additional info */
    size?: Size;
    _original: N;
    [key: string]: any;
}
interface GraphEdge<E extends EdgeData = EdgeData> {
    id: ID;
    source: ID;
    target: ID;
    sourceNode?: GraphNode;
    targetNode?: GraphNode;
    _original: E;
    /** Only for dagre layout */
    points?: Point[];
    labelSize?: Size;
    labelPos?: EdgeLabelPos;
    labelOffset?: number;
    weight?: number;
    minLen?: number;
    [key: string]: any;
}
interface Graph<N extends NodeData = NodeData, E extends EdgeData = EdgeData> {
    nodes: Map<ID, GraphNode<N>>;
    edges: Map<ID, GraphEdge<E>>;
}
type LayoutNode<N extends NodeData = NodeData> = GraphNode<N>;
type LayoutEdge<E extends EdgeData = EdgeData> = GraphEdge<E>;
type LayoutData<N extends NodeData = NodeData, E extends EdgeData = EdgeData> = Graph<N, E>;

export type { EdgeData, Graph, GraphData, GraphEdge, GraphNode, LayoutData, LayoutEdge, LayoutNode, NodeData };
