import { __require as require_baseFlatten } from './_baseFlatten.js';
import { __require as require_baseRest } from './_baseRest.js';
import { __require as require_baseUniq } from './_baseUniq.js';
import { __require as requireIsArrayLikeObject } from './isArrayLikeObject.js';

var union_1;
var hasRequiredUnion;

function requireUnion () {
	if (hasRequiredUnion) return union_1;
	hasRequiredUnion = 1;
	var baseFlatten = require_baseFlatten(),
	    baseRest = require_baseRest(),
	    baseUniq = require_baseUniq(),
	    isArrayLikeObject = requireIsArrayLikeObject();

	/**
	 * Creates an array of unique values, in order, from all given arrays using
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {...Array} [arrays] The arrays to inspect.
	 * @returns {Array} Returns the new array of combined values.
	 * @example
	 *
	 * _.union([2], [1, 2]);
	 * // => [2, 1]
	 */
	var union = baseRest(function(arrays) {
	  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
	});

	union_1 = union;
	return union_1;
}

export { requireUnion as __require };
//# sourceMappingURL=union.js.map
