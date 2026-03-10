import { Graph } from '@antv/graphlib';
import { Matrix } from '../types/common.js';
import { NodeData } from '../types/data.js';
import { PointObject } from '../types/point.js';
import { GraphLib } from '../model/data.js';

/**
 * Floyd-Warshall algorithm to find shortest paths (but with no negative cycles).
 */
declare const floydWarshall: (adjMatrix: Matrix) => Matrix;
/**
 * Get the adjacency matrix of the graph model.
 */
declare const getAdjMatrix: (model: GraphLib, directed: boolean) => Matrix;
/**
 * Get the adjacency list of the graph model.
 */
declare const getAdjList: (model: GraphLib, directed: boolean) => Matrix;
/**
 * scale matrix
 * @param matrix [ [], [], [] ]
 * @param ratio
 */
declare const scaleMatrix: (matrix: Matrix, ratio: number) => any[];
/**
 * calculate the bounding box for the nodes according to their x, y, and size
 * @param nodes nodes in the layout
 * @returns
 */
declare const getLayoutBBox: (nodes: NodeData[]) => {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};
/**
 * calculate the euclidean distance form p1 to p2
 * @param p1
 * @param p2
 * @returns
 */
declare const getEuclideanDistance: (p1: PointObject, p2: PointObject) => number;
/**
 * Depth first search begin from nodes in graphCore data.
 * @param graphCore graphlib data structure
 * @param nodes begin nodes
 * @param fn will be called while visiting each node
 * @param mode 'TB' - visit from top to bottom; 'BT' - visit from bottom to top;
 * @returns
 */
declare const graphTreeDfs: (graph: Graph<any, any>, nodes: NodeData[], fn: (n: NodeData) => void, mode: "TB" | "BT" | undefined, treeKey: string, stopFns?: {
    stopBranchFn?: ((node: NodeData) => boolean) | undefined;
    stopAllFn?: ((node: NodeData) => boolean) | undefined;
}) => void;
/**
 * Use Johnson + Dijkstra to compute APSP for sparse graph.
 * Fully compatible with floydWarshall(adjMatrix).
 */
declare function johnson(adjList: Matrix): Matrix;

export { floydWarshall, getAdjList, getAdjMatrix, getEuclideanDistance, getLayoutBBox, graphTreeDfs, johnson, scaleMatrix };
