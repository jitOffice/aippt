import { Expr } from '../types/common.js';
import { NodeData } from '../types/data.js';
import { Size, STDSize } from '../types/size.js';

/**
 * Format a value into a callable function when it is a string expression.
 * - `string` => `(context) => evaluateExpression(string, context)`
 * - `function` => returned as-is
 * - other => returned as-is
 */
declare function formatFn<TContext extends Record<string, any> = Record<string, any>>(value: unknown, argNames: (keyof TContext & string)[]): Function;
/**
 * Format value with multiple types into a function that returns a number
 * @param value The value to be formatted
 * @param defaultValue The default value when value is invalid
 * @returns A function that returns a number
 */
declare function formatNumberFn<T extends NodeData = NodeData>(value: number | Expr | ((d: T) => number) | undefined, defaultValue: number, type?: 'node' | 'edge' | 'combo'): (d: T) => number;
/**
 * Format size config with multiple types into a function that returns a size
 * @param value The value to be formatted
 * @param defaultValue The default value when value is invalid
 * @param resultIsNumber Whether to return a number (max of width/height) or size array
 * @returns A function that returns a size
 */
declare function formatSizeFn<T extends NodeData = NodeData>(value?: Size | Expr | ((d: T) => Size), defaultValue?: number, type?: 'node' | 'edge' | 'combo'): (d: T) => Size;
/**
 * Format nodeSize and nodeSpacing into a function that returns the total size
 * @param nodeSize The size of the node
 * @param nodeSpacing The spacing around the node
 * @param defaultNodeSize The default node size when value is invalid
 * @param defaultNodeSpacing The default node spacing when value is invalid
 * @returns A function that returns the total size (node size + spacing)
 */
declare const formatNodeSizeFn: (nodeSize?: string | Size | ((node: NodeData) => Size) | undefined, nodeSpacing?: string | Size | ((node: NodeData) => Size) | undefined, defaultNodeSize?: number, defaultNodeSpacing?: number) => (d: NodeData) => STDSize;

export { formatFn, formatNodeSizeFn, formatNumberFn, formatSizeFn };
