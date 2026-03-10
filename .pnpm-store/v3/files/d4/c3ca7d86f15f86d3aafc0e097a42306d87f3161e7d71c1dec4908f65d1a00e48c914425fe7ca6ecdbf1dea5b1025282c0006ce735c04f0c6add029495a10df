import { __require as require_baseIsEqual } from './_baseIsEqual.js';
import { __require as requireGet } from './get.js';
import { __require as requireHasIn } from './hasIn.js';
import { __require as require_isKey } from './_isKey.js';
import { __require as require_isStrictComparable } from './_isStrictComparable.js';
import { __require as require_matchesStrictComparable } from './_matchesStrictComparable.js';
import { __require as require_toKey } from './_toKey.js';

var _baseMatchesProperty;
var hasRequired_baseMatchesProperty;

function require_baseMatchesProperty () {
	if (hasRequired_baseMatchesProperty) return _baseMatchesProperty;
	hasRequired_baseMatchesProperty = 1;
	var baseIsEqual = require_baseIsEqual(),
	    get = requireGet(),
	    hasIn = requireHasIn(),
	    isKey = require_isKey(),
	    isStrictComparable = require_isStrictComparable(),
	    matchesStrictComparable = require_matchesStrictComparable(),
	    toKey = require_toKey();

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1,
	    COMPARE_UNORDERED_FLAG = 2;

	/**
	 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatchesProperty(path, srcValue) {
	  if (isKey(path) && isStrictComparable(srcValue)) {
	    return matchesStrictComparable(toKey(path), srcValue);
	  }
	  return function(object) {
	    var objValue = get(object, path);
	    return (objValue === undefined && objValue === srcValue)
	      ? hasIn(object, path)
	      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
	  };
	}

	_baseMatchesProperty = baseMatchesProperty;
	return _baseMatchesProperty;
}

export { require_baseMatchesProperty as __require };
//# sourceMappingURL=_baseMatchesProperty.js.map
