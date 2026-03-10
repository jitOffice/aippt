import { GraphLib } from '../model/data.js';
import { Sorter } from '../types/common.js';
import { NodeData } from '../types/data.js';

declare function orderByDegree<N extends NodeData = NodeData>(model: GraphLib<N>, order?: 'asc' | 'desc'): GraphLib<N>;
/**
 * 按 ID 排序
 */
declare function orderById<N extends NodeData = NodeData>(model: GraphLib<N>): GraphLib<N>;
/**
 * 按自定义比较函数排序
 */
declare function orderBySorter<N extends NodeData = NodeData>(model: GraphLib<N>, sorter: Sorter<N>): GraphLib<N>;
/**
 * Order nodes according to graph topology
 */
declare function orderByTopology<N extends NodeData = NodeData>(model: GraphLib<N>, directed?: boolean): GraphLib<N>;

export { orderByDegree, orderById, orderBySorter, orderByTopology };
