import { __require as requireIsArray } from './isArray.js';
import { __require as requireIsSymbol } from './isSymbol.js';

var _isKey;
var hasRequired_isKey;

function require_isKey () {
	if (hasRequired_isKey) return _isKey;
	hasRequired_isKey = 1;
	var isArray = requireIsArray(),
	    isSymbol = requireIsSymbol();

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  if (isArray(value)) {
	    return false;
	  }
	  var type = typeof value;
	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	      value == null || isSymbol(value)) {
	    return true;
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object));
	}

	_isKey = isKey;
	return _isKey;
}

export { require_isKey as __require };
//# sourceMappingURL=_isKey.js.map
