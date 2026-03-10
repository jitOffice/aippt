/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */

var _arraySome;
var hasRequired_arraySome;

function require_arraySome () {
	if (hasRequired_arraySome) return _arraySome;
	hasRequired_arraySome = 1;
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	_arraySome = arraySome;
	return _arraySome;
}

export { require_arraySome as __require };
//# sourceMappingURL=_arraySome.js.map
