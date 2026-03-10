import { __require as require_basePick } from './_basePick.js';
import { __require as require_flatRest } from './_flatRest.js';

var pick_1;
var hasRequiredPick;

function requirePick () {
	if (hasRequiredPick) return pick_1;
	hasRequiredPick = 1;
	var basePick = require_basePick(),
	    flatRest = require_flatRest();

	/**
	 * Creates an object composed of the picked `object` properties.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The source object.
	 * @param {...(string|string[])} [paths] The property paths to pick.
	 * @returns {Object} Returns the new object.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': '2', 'c': 3 };
	 *
	 * _.pick(object, ['a', 'c']);
	 * // => { 'a': 1, 'c': 3 }
	 */
	var pick = flatRest(function(object, paths) {
	  return object == null ? {} : basePick(object, paths);
	});

	pick_1 = pick;
	return pick_1;
}

export { requirePick as __require };
//# sourceMappingURL=pick.js.map
