import { __require as require_baseExtremum } from './_baseExtremum.js';
import { __require as require_baseIteratee } from './_baseIteratee.js';
import { __require as require_baseLt } from './_baseLt.js';

var minBy_1;
var hasRequiredMinBy;

function requireMinBy () {
	if (hasRequiredMinBy) return minBy_1;
	hasRequiredMinBy = 1;
	var baseExtremum = require_baseExtremum(),
	    baseIteratee = require_baseIteratee(),
	    baseLt = require_baseLt();

	/**
	 * This method is like `_.min` except that it accepts `iteratee` which is
	 * invoked for each element in `array` to generate the criterion by which
	 * the value is ranked. The iteratee is invoked with one argument: (value).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Math
	 * @param {Array} array The array to iterate over.
	 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
	 * @returns {*} Returns the minimum value.
	 * @example
	 *
	 * var objects = [{ 'n': 1 }, { 'n': 2 }];
	 *
	 * _.minBy(objects, function(o) { return o.n; });
	 * // => { 'n': 1 }
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.minBy(objects, 'n');
	 * // => { 'n': 1 }
	 */
	function minBy(array, iteratee) {
	  return (array && array.length)
	    ? baseExtremum(array, baseIteratee(iteratee, 2), baseLt)
	    : undefined;
	}

	minBy_1 = minBy;
	return minBy_1;
}

export { requireMinBy as __require };
//# sourceMappingURL=minBy.js.map
