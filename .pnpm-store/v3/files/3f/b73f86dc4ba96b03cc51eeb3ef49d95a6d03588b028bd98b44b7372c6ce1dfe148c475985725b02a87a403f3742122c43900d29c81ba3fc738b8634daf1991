import { __require as require_baseHas } from './_baseHas.js';
import { __require as require_hasPath } from './_hasPath.js';

var has_1;
var hasRequiredHas;

function requireHas () {
	if (hasRequiredHas) return has_1;
	hasRequiredHas = 1;
	var baseHas = require_baseHas(),
	    hasPath = require_hasPath();

	/**
	 * Checks if `path` is a direct property of `object`.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 * @example
	 *
	 * var object = { 'a': { 'b': 2 } };
	 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
	 *
	 * _.has(object, 'a');
	 * // => true
	 *
	 * _.has(object, 'a.b');
	 * // => true
	 *
	 * _.has(object, ['a', 'b']);
	 * // => true
	 *
	 * _.has(other, 'a');
	 * // => false
	 */
	function has(object, path) {
	  return object != null && hasPath(object, path, baseHas);
	}

	has_1 = has;
	return has_1;
}

export { requireHas as __require };
//# sourceMappingURL=has.js.map
