/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */

var _arrayMap;
var hasRequired_arrayMap;

function require_arrayMap () {
	if (hasRequired_arrayMap) return _arrayMap;
	hasRequired_arrayMap = 1;
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	_arrayMap = arrayMap;
	return _arrayMap;
}

export { require_arrayMap as __require };
//# sourceMappingURL=_arrayMap.js.map
