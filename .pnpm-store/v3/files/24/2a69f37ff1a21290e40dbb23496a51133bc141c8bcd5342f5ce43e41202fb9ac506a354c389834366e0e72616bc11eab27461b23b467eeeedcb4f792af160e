import { compile as A, evaluate as N } from '../node_modules/@antv/expr/dist/index.esm.js';

/**
 * Evaluate an expression if (and only if) it's a valid string expression.
 * - Returns `undefined` when `expression` is not a string, empty, or invalid.
 *
 * @example
 * evaluateExpression('x + y', { x: 10, y: 20 }) // 30
 */
function evaluateExpression(expression, context) {
    if (typeof expression !== 'string')
        return undefined;
    const source = expression.trim();
    if (!source)
        return undefined;
    try {
        A(source);
        return N(source, context);
    }
    catch (_a) {
        return undefined;
    }
}

export { evaluateExpression };
//# sourceMappingURL=expr.js.map
