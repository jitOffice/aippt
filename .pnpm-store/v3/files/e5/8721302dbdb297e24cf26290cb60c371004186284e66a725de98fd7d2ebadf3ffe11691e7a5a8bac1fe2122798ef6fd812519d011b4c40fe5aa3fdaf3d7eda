import { __require as require_baseKeys } from './_baseKeys.js';
import { __require as require_getTag } from './_getTag.js';
import { __require as requireIsArguments } from './isArguments.js';
import { __require as requireIsArray } from './isArray.js';
import { __require as requireIsArrayLike } from './isArrayLike.js';
import { __require as requireIsBuffer } from './isBuffer.js';
import { __require as require_isPrototype } from './_isPrototype.js';
import { __require as requireIsTypedArray } from './isTypedArray.js';

var isEmpty_1;
var hasRequiredIsEmpty;

function requireIsEmpty () {
	if (hasRequiredIsEmpty) return isEmpty_1;
	hasRequiredIsEmpty = 1;
	var baseKeys = require_baseKeys(),
	    getTag = require_getTag(),
	    isArguments = requireIsArguments(),
	    isArray = requireIsArray(),
	    isArrayLike = requireIsArrayLike(),
	    isBuffer = requireIsBuffer(),
	    isPrototype = require_isPrototype(),
	    isTypedArray = requireIsTypedArray();

	/** `Object#toString` result references. */
	var mapTag = '[object Map]',
	    setTag = '[object Set]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Checks if `value` is an empty object, collection, map, or set.
	 *
	 * Objects are considered empty if they have no own enumerable string keyed
	 * properties.
	 *
	 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
	 * jQuery-like collections are considered empty if they have a `length` of `0`.
	 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
	 * @example
	 *
	 * _.isEmpty(null);
	 * // => true
	 *
	 * _.isEmpty(true);
	 * // => true
	 *
	 * _.isEmpty(1);
	 * // => true
	 *
	 * _.isEmpty([1, 2, 3]);
	 * // => false
	 *
	 * _.isEmpty({ 'a': 1 });
	 * // => false
	 */
	function isEmpty(value) {
	  if (value == null) {
	    return true;
	  }
	  if (isArrayLike(value) &&
	      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
	        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
	    return !value.length;
	  }
	  var tag = getTag(value);
	  if (tag == mapTag || tag == setTag) {
	    return !value.size;
	  }
	  if (isPrototype(value)) {
	    return !baseKeys(value).length;
	  }
	  for (var key in value) {
	    if (hasOwnProperty.call(value, key)) {
	      return false;
	    }
	  }
	  return true;
	}

	isEmpty_1 = isEmpty;
	return isEmpty_1;
}

export { requireIsEmpty as __require };
//# sourceMappingURL=isEmpty.js.map
