/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */

var _baseSortBy;
var hasRequired_baseSortBy;

function require_baseSortBy () {
	if (hasRequired_baseSortBy) return _baseSortBy;
	hasRequired_baseSortBy = 1;
	function baseSortBy(array, comparer) {
	  var length = array.length;

	  array.sort(comparer);
	  while (length--) {
	    array[length] = array[length].value;
	  }
	  return array;
	}

	_baseSortBy = baseSortBy;
	return _baseSortBy;
}

export { require_baseSortBy as __require };
//# sourceMappingURL=_baseSortBy.js.map
