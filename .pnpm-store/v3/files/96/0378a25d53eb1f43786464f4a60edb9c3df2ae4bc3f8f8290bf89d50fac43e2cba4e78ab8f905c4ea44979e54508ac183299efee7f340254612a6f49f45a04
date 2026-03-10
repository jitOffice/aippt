import { __require as require_arrayReduce } from './_arrayReduce.js';
import { __require as require_baseEach } from './_baseEach.js';
import { __require as require_baseIteratee } from './_baseIteratee.js';
import { __require as require_baseReduce } from './_baseReduce.js';
import { __require as requireIsArray } from './isArray.js';

var reduce_1;
var hasRequiredReduce;

function requireReduce () {
	if (hasRequiredReduce) return reduce_1;
	hasRequiredReduce = 1;
	var arrayReduce = require_arrayReduce(),
	    baseEach = require_baseEach(),
	    baseIteratee = require_baseIteratee(),
	    baseReduce = require_baseReduce(),
	    isArray = requireIsArray();

	/**
	 * Reduces `collection` to a value which is the accumulated result of running
	 * each element in `collection` thru `iteratee`, where each successive
	 * invocation is supplied the return value of the previous. If `accumulator`
	 * is not given, the first element of `collection` is used as the initial
	 * value. The iteratee is invoked with four arguments:
	 * (accumulator, value, index|key, collection).
	 *
	 * Many lodash methods are guarded to work as iteratees for methods like
	 * `_.reduce`, `_.reduceRight`, and `_.transform`.
	 *
	 * The guarded methods are:
	 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
	 * and `sortBy`
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @returns {*} Returns the accumulated value.
	 * @see _.reduceRight
	 * @example
	 *
	 * _.reduce([1, 2], function(sum, n) {
	 *   return sum + n;
	 * }, 0);
	 * // => 3
	 *
	 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
	 *   (result[value] || (result[value] = [])).push(key);
	 *   return result;
	 * }, {});
	 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
	 */
	function reduce(collection, iteratee, accumulator) {
	  var func = isArray(collection) ? arrayReduce : baseReduce,
	      initAccum = arguments.length < 3;

	  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
	}

	reduce_1 = reduce;
	return reduce_1;
}

export { requireReduce as __require };
//# sourceMappingURL=reduce.js.map
