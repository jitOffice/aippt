import { __require as requireIsArrayLike } from './isArrayLike.js';

var _createBaseEach;
var hasRequired_createBaseEach;

function require_createBaseEach () {
	if (hasRequired_createBaseEach) return _createBaseEach;
	hasRequired_createBaseEach = 1;
	var isArrayLike = requireIsArrayLike();

	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    if (collection == null) {
	      return collection;
	    }
	    if (!isArrayLike(collection)) {
	      return eachFunc(collection, iteratee);
	    }
	    var length = collection.length,
	        index = fromRight ? length : -1,
	        iterable = Object(collection);

	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}

	_createBaseEach = createBaseEach;
	return _createBaseEach;
}

export { require_createBaseEach as __require };
//# sourceMappingURL=_createBaseEach.js.map
