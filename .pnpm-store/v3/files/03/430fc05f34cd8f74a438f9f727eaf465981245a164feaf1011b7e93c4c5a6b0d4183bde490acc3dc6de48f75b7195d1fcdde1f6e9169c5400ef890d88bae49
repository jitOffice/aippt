import { __require as require_castPath } from './_castPath.js';
import { __require as requireIsArguments } from './isArguments.js';
import { __require as requireIsArray } from './isArray.js';
import { __require as require_isIndex } from './_isIndex.js';
import { __require as requireIsLength } from './isLength.js';
import { __require as require_toKey } from './_toKey.js';

var _hasPath;
var hasRequired_hasPath;

function require_hasPath () {
	if (hasRequired_hasPath) return _hasPath;
	hasRequired_hasPath = 1;
	var castPath = require_castPath(),
	    isArguments = requireIsArguments(),
	    isArray = requireIsArray(),
	    isIndex = require_isIndex(),
	    isLength = requireIsLength(),
	    toKey = require_toKey();

	/**
	 * Checks if `path` exists on `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @param {Function} hasFunc The function to check properties.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 */
	function hasPath(object, path, hasFunc) {
	  path = castPath(path, object);

	  var index = -1,
	      length = path.length,
	      result = false;

	  while (++index < length) {
	    var key = toKey(path[index]);
	    if (!(result = object != null && hasFunc(object, key))) {
	      break;
	    }
	    object = object[key];
	  }
	  if (result || ++index != length) {
	    return result;
	  }
	  length = object == null ? 0 : object.length;
	  return !!length && isLength(length) && isIndex(key, length) &&
	    (isArray(object) || isArguments(object));
	}

	_hasPath = hasPath;
	return _hasPath;
}

export { require_hasPath as __require };
//# sourceMappingURL=_hasPath.js.map
