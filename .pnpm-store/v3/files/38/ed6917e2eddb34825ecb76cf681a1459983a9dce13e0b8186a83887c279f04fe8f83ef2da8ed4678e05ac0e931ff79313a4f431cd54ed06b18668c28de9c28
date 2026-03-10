import { __require as require_baseGet } from './_baseGet.js';
import { __require as require_baseSet } from './_baseSet.js';
import { __require as require_castPath } from './_castPath.js';

var _basePickBy;
var hasRequired_basePickBy;

function require_basePickBy () {
	if (hasRequired_basePickBy) return _basePickBy;
	hasRequired_basePickBy = 1;
	var baseGet = require_baseGet(),
	    baseSet = require_baseSet(),
	    castPath = require_castPath();

	/**
	 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The source object.
	 * @param {string[]} paths The property paths to pick.
	 * @param {Function} predicate The function invoked per property.
	 * @returns {Object} Returns the new object.
	 */
	function basePickBy(object, paths, predicate) {
	  var index = -1,
	      length = paths.length,
	      result = {};

	  while (++index < length) {
	    var path = paths[index],
	        value = baseGet(object, path);

	    if (predicate(value, path)) {
	      baseSet(result, castPath(path, object), value);
	    }
	  }
	  return result;
	}

	_basePickBy = basePickBy;
	return _basePickBy;
}

export { require_basePickBy as __require };
//# sourceMappingURL=_basePickBy.js.map
