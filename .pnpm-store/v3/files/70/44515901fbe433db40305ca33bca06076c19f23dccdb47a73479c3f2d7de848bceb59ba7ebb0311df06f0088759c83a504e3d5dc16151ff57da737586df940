/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */

var _baseFindIndex;
var hasRequired_baseFindIndex;

function require_baseFindIndex () {
	if (hasRequired_baseFindIndex) return _baseFindIndex;
	hasRequired_baseFindIndex = 1;
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 1 : -1);

	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}

	_baseFindIndex = baseFindIndex;
	return _baseFindIndex;
}

export { require_baseFindIndex as __require };
//# sourceMappingURL=_baseFindIndex.js.map
