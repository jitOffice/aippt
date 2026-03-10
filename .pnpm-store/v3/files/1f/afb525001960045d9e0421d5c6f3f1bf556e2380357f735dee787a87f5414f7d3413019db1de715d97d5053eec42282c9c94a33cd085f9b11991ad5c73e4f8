import { __require as require_baseExtremum } from './_baseExtremum.js';
import { __require as require_baseGt } from './_baseGt.js';
import { __require as requireIdentity } from './identity.js';

var max_1;
var hasRequiredMax;

function requireMax () {
	if (hasRequiredMax) return max_1;
	hasRequiredMax = 1;
	var baseExtremum = require_baseExtremum(),
	    baseGt = require_baseGt(),
	    identity = requireIdentity();

	/**
	 * Computes the maximum value of `array`. If `array` is empty or falsey,
	 * `undefined` is returned.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Math
	 * @param {Array} array The array to iterate over.
	 * @returns {*} Returns the maximum value.
	 * @example
	 *
	 * _.max([4, 2, 8, 6]);
	 * // => 8
	 *
	 * _.max([]);
	 * // => undefined
	 */
	function max(array) {
	  return (array && array.length)
	    ? baseExtremum(array, identity, baseGt)
	    : undefined;
	}

	max_1 = max;
	return max_1;
}

export { requireMax as __require };
//# sourceMappingURL=max.js.map
