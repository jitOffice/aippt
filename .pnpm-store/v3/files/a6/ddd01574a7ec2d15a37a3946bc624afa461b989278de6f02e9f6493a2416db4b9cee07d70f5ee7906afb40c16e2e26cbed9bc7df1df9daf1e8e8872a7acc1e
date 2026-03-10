import { __require as require_baseHasIn } from './_baseHasIn.js';
import { __require as require_hasPath } from './_hasPath.js';

var hasIn_1;
var hasRequiredHasIn;

function requireHasIn () {
	if (hasRequiredHasIn) return hasIn_1;
	hasRequiredHasIn = 1;
	var baseHasIn = require_baseHasIn(),
	    hasPath = require_hasPath();

	/**
	 * Checks if `path` is a direct or inherited property of `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 * @example
	 *
	 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
	 *
	 * _.hasIn(object, 'a');
	 * // => true
	 *
	 * _.hasIn(object, 'a.b');
	 * // => true
	 *
	 * _.hasIn(object, ['a', 'b']);
	 * // => true
	 *
	 * _.hasIn(object, 'b');
	 * // => false
	 */
	function hasIn(object, path) {
	  return object != null && hasPath(object, path, baseHasIn);
	}

	hasIn_1 = hasIn;
	return hasIn_1;
}

export { requireHasIn as __require };
//# sourceMappingURL=hasIn.js.map
