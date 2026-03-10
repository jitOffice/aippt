type PlainObject = Record<string, any>;
type Matrix = number[][];
/**
 * String expression evaluated by `@antv/expr`.
 *
 * Notes:
 * - `Expr` is structured-cloneable and can be passed into WebWorkers.
 * - Function callbacks cannot be structured-cloned; prefer `Expr` when `enableWorker: true`.
 */
type Expr = string;
/**
 * CallableExpr<(node: NodeData) => number>
 *
 * => 'node.degree' | (node: NodeData) => number
 */
type CallableExpr<TData = any, TResult = any> = Expr | ((data: TData) => TResult);
type ExprContext = Record<string, any>;
type Sorter<T = any> = (a: T, b: T) => -1 | 0 | 1;

export type { CallableExpr, Expr, ExprContext, Matrix, PlainObject, Sorter };
