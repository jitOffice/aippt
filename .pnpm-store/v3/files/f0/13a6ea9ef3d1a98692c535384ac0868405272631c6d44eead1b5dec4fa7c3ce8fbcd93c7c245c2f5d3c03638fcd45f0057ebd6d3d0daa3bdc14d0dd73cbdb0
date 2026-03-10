import { __require as requireIsObject } from './isObject.js';

var _isStrictComparable;
var hasRequired_isStrictComparable;

function require_isStrictComparable () {
	if (hasRequired_isStrictComparable) return _isStrictComparable;
	hasRequired_isStrictComparable = 1;
	var isObject = requireIsObject();

	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject(value);
	}

	_isStrictComparable = isStrictComparable;
	return _isStrictComparable;
}

export { require_isStrictComparable as __require };
//# sourceMappingURL=_isStrictComparable.js.map
