import { __require as require_baseGetTag } from './_baseGetTag.js';
import { __require as requireIsArray } from './isArray.js';
import { __require as requireIsObjectLike } from './isObjectLike.js';

var isString_1;
var hasRequiredIsString;

function requireIsString () {
	if (hasRequiredIsString) return isString_1;
	hasRequiredIsString = 1;
	var baseGetTag = require_baseGetTag(),
	    isArray = requireIsArray(),
	    isObjectLike = requireIsObjectLike();

	/** `Object#toString` result references. */
	var stringTag = '[object String]';

	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' ||
	    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
	}

	isString_1 = isString;
	return isString_1;
}

export { requireIsString as __require };
//# sourceMappingURL=isString.js.map
