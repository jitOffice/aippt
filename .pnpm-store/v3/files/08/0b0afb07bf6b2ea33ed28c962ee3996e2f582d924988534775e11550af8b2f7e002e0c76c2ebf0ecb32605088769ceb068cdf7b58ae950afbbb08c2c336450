import { __require as require_basePickBy } from './_basePickBy.js';
import { __require as requireHasIn } from './hasIn.js';

var _basePick;
var hasRequired_basePick;

function require_basePick () {
	if (hasRequired_basePick) return _basePick;
	hasRequired_basePick = 1;
	var basePickBy = require_basePickBy(),
	    hasIn = requireHasIn();

	/**
	 * The base implementation of `_.pick` without support for individual
	 * property identifiers.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {string[]} paths The property paths to pick.
	 * @returns {Object} Returns the new object.
	 */
	function basePick(object, paths) {
	  return basePickBy(object, paths, function(value, path) {
	    return hasIn(object, path);
	  });
	}

	_basePick = basePick;
	return _basePick;
}

export { require_basePick as __require };
//# sourceMappingURL=_basePick.js.map
