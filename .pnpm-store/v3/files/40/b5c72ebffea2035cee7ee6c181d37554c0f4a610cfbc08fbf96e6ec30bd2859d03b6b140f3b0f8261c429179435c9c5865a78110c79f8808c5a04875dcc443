import { __require as requireEq } from './eq.js';
import { __require as requireIsArrayLike } from './isArrayLike.js';
import { __require as require_isIndex } from './_isIndex.js';
import { __require as requireIsObject } from './isObject.js';

var _isIterateeCall;
var hasRequired_isIterateeCall;

function require_isIterateeCall () {
	if (hasRequired_isIterateeCall) return _isIterateeCall;
	hasRequired_isIterateeCall = 1;
	var eq = requireEq(),
	    isArrayLike = requireIsArrayLike(),
	    isIndex = require_isIndex(),
	    isObject = requireIsObject();

	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike(object) && isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq(object[index], value);
	  }
	  return false;
	}

	_isIterateeCall = isIterateeCall;
	return _isIterateeCall;
}

export { require_isIterateeCall as __require };
//# sourceMappingURL=_isIterateeCall.js.map
