import { __require as requireIsSymbol } from './isSymbol.js';

var _baseExtremum;
var hasRequired_baseExtremum;

function require_baseExtremum () {
	if (hasRequired_baseExtremum) return _baseExtremum;
	hasRequired_baseExtremum = 1;
	var isSymbol = requireIsSymbol();

	/**
	 * The base implementation of methods like `_.max` and `_.min` which accepts a
	 * `comparator` to determine the extremum value.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The iteratee invoked per iteration.
	 * @param {Function} comparator The comparator used to compare values.
	 * @returns {*} Returns the extremum value.
	 */
	function baseExtremum(array, iteratee, comparator) {
	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    var value = array[index],
	        current = iteratee(value);

	    if (current != null && (computed === undefined
	          ? (current === current && !isSymbol(current))
	          : comparator(current, computed)
	        )) {
	      var computed = current,
	          result = value;
	    }
	  }
	  return result;
	}

	_baseExtremum = baseExtremum;
	return _baseExtremum;
}

export { require_baseExtremum as __require };
//# sourceMappingURL=_baseExtremum.js.map
