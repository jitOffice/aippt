import { __require as requireIsArray } from './isArray.js';
import { __require as require_isKey } from './_isKey.js';
import { __require as require_stringToPath } from './_stringToPath.js';
import { __require as requireToString } from './toString.js';

var _castPath;
var hasRequired_castPath;

function require_castPath () {
	if (hasRequired_castPath) return _castPath;
	hasRequired_castPath = 1;
	var isArray = requireIsArray(),
	    isKey = require_isKey(),
	    stringToPath = require_stringToPath(),
	    toString = requireToString();

	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath(value, object) {
	  if (isArray(value)) {
	    return value;
	  }
	  return isKey(value, object) ? [value] : stringToPath(toString(value));
	}

	_castPath = castPath;
	return _castPath;
}

export { require_castPath as __require };
//# sourceMappingURL=_castPath.js.map
