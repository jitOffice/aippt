import { __require as require_baseIndexOf } from './_baseIndexOf.js';

var _arrayIncludes;
var hasRequired_arrayIncludes;

function require_arrayIncludes () {
	if (hasRequired_arrayIncludes) return _arrayIncludes;
	hasRequired_arrayIncludes = 1;
	var baseIndexOf = require_baseIndexOf();

	/**
	 * A specialized version of `_.includes` for arrays without support for
	 * specifying an index to search from.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludes(array, value) {
	  var length = array == null ? 0 : array.length;
	  return !!length && baseIndexOf(array, value, 0) > -1;
	}

	_arrayIncludes = arrayIncludes;
	return _arrayIncludes;
}

export { require_arrayIncludes as __require };
//# sourceMappingURL=_arrayIncludes.js.map
