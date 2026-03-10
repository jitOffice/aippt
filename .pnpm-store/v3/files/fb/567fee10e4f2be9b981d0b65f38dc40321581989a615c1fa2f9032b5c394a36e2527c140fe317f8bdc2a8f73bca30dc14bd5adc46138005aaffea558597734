import { evaluateExpression } from './expr.js';
import { parseSize, isSize } from './size.js';
import isNil from '../node_modules/@antv/util/esm/lodash/is-nil.js';
import isString from '../node_modules/@antv/util/esm/lodash/is-string.js';
import isNumber from '../node_modules/@antv/util/esm/lodash/is-number.js';
import isFunction from '../node_modules/@antv/util/esm/lodash/is-function.js';

/**
 * Format a value into a callable function when it is a string expression.
 * - `string` => `(context) => evaluateExpression(string, context)`
 * - `function` => returned as-is
 * - other => returned as-is
 */
function formatFn(value, argNames) {
    if (typeof value === 'function')
        return value;
    if (typeof value === 'string') {
        const expr = value;
        return (...argv) => {
            const ctx = {};
            for (let i = 0; i < argNames.length; i++) {
                ctx[argNames[i]] = argv[i];
            }
            return evaluateExpression(expr, ctx);
        };
    }
    return () => value;
}
/**
 * Format value with multiple types into a function that returns a number
 * @param value The value to be formatted
 * @param defaultValue The default value when value is invalid
 * @returns A function that returns a number
 */
function formatNumberFn(value, defaultValue, type = 'node') {
    // If value is undefined, return default value function
    if (isNil(value)) {
        return () => defaultValue;
    }
    // If value is an expression, return a function that evaluates the expression
    if (isString(value)) {
        const numberFn = formatFn(value, [type]);
        return (d) => {
            const evaluated = numberFn(d);
            if (isNumber(evaluated))
                return evaluated;
            return defaultValue;
        };
    }
    // If value is a function, return it directly
    if (isFunction(value)) {
        return value;
    }
    // If value is a number, return a function that returns this number
    if (isNumber(value)) {
        return () => value;
    }
    // For other cases (undefined or invalid values), return default value function
    return () => defaultValue;
}
/**
 * Format size config with multiple types into a function that returns a size
 * @param value The value to be formatted
 * @param defaultValue The default value when value is invalid
 * @param resultIsNumber Whether to return a number (max of width/height) or size array
 * @returns A function that returns a size
 */
function formatSizeFn(value, defaultValue = 10, type = 'node') {
    // If value is undefined, return default value function
    if (isNil(value)) {
        return () => defaultValue;
    }
    // If value is an expression, return a function that evaluates the expression
    if (isString(value)) {
        const sizeFn = formatFn(value, [type]);
        return (d) => {
            const evaluated = sizeFn(d);
            if (isSize(evaluated))
                return evaluated;
            return defaultValue;
        };
    }
    // If value is a function, return it directly
    if (isFunction(value)) {
        return value;
    }
    // If value is a number, return a function that returns this number
    if (isNumber(value)) {
        return () => value;
    }
    // If value is an array, return max or the array itself
    if (Array.isArray(value)) {
        return () => value;
    }
    return () => defaultValue;
}
/**
 * Format nodeSize and nodeSpacing into a function that returns the total size
 * @param nodeSize The size of the node
 * @param nodeSpacing The spacing around the node
 * @param defaultNodeSize The default node size when value is invalid
 * @param defaultNodeSpacing The default node spacing when value is invalid
 * @returns A function that returns the total size (node size + spacing)
 */
const formatNodeSizeFn = (nodeSize, nodeSpacing, defaultNodeSize = 10, defaultNodeSpacing = 0) => {
    const nodeSpacingFunc = formatSizeFn(nodeSpacing, defaultNodeSpacing);
    const nodeSizeFunc = formatSizeFn(nodeSize, defaultNodeSize);
    return (d) => {
        const [sizeW, sizeH, sizeD] = parseSize(nodeSizeFunc(d));
        const [spacingW, spacingH, spacingD] = parseSize(nodeSpacingFunc(d));
        return [sizeW + spacingW, sizeH + spacingH, sizeD + spacingD];
    };
};

export { formatFn, formatNodeSizeFn, formatNumberFn, formatSizeFn };
//# sourceMappingURL=format.js.map
