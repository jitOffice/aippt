import { __require as require_baseAssignValue } from './_baseAssignValue.js';
import { __require as require_baseForOwn } from './_baseForOwn.js';
import { __require as require_baseIteratee } from './_baseIteratee.js';

var mapValues_1;
var hasRequiredMapValues;

function requireMapValues () {
	if (hasRequiredMapValues) return mapValues_1;
	hasRequiredMapValues = 1;
	var baseAssignValue = require_baseAssignValue(),
	    baseForOwn = require_baseForOwn(),
	    baseIteratee = require_baseIteratee();

	/**
	 * Creates an object with the same keys as `object` and values generated
	 * by running each own enumerable string keyed property of `object` thru
	 * `iteratee`. The iteratee is invoked with three arguments:
	 * (value, key, object).
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Object
	 * @param {Object} object The object to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @returns {Object} Returns the new mapped object.
	 * @see _.mapKeys
	 * @example
	 *
	 * var users = {
	 *   'fred':    { 'user': 'fred',    'age': 40 },
	 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
	 * };
	 *
	 * _.mapValues(users, function(o) { return o.age; });
	 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.mapValues(users, 'age');
	 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	 */
	function mapValues(object, iteratee) {
	  var result = {};
	  iteratee = baseIteratee(iteratee, 3);

	  baseForOwn(object, function(value, key, object) {
	    baseAssignValue(result, key, iteratee(value, key, object));
	  });
	  return result;
	}

	mapValues_1 = mapValues;
	return mapValues_1;
}

export { requireMapValues as __require };
//# sourceMappingURL=mapValues.js.map
