import { __require as require_baseExtremum } from './_baseExtremum.js';
import { __require as require_baseLt } from './_baseLt.js';
import { __require as requireIdentity } from './identity.js';

var min_1;
var hasRequiredMin;

function requireMin () {
	if (hasRequiredMin) return min_1;
	hasRequiredMin = 1;
	var baseExtremum = require_baseExtremum(),
	    baseLt = require_baseLt(),
	    identity = requireIdentity();

	/**
	 * Computes the minimum value of `array`. If `array` is empty or falsey,
	 * `undefined` is returned.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Math
	 * @param {Array} array The array to iterate over.
	 * @returns {*} Returns the minimum value.
	 * @example
	 *
	 * _.min([4, 2, 8, 6]);
	 * // => 2
	 *
	 * _.min([]);
	 * // => undefined
	 */
	function min(array) {
	  return (array && array.length)
	    ? baseExtremum(array, identity, baseLt)
	    : undefined;
	}

	min_1 = min;
	return min_1;
}

export { requireMin as __require };
//# sourceMappingURL=min.js.map
