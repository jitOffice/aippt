import { __require as requireMemoize } from './memoize.js';

var _memoizeCapped;
var hasRequired_memoizeCapped;

function require_memoizeCapped () {
	if (hasRequired_memoizeCapped) return _memoizeCapped;
	hasRequired_memoizeCapped = 1;
	var memoize = requireMemoize();

	/** Used as the maximum memoize cache size. */
	var MAX_MEMOIZE_SIZE = 500;

	/**
	 * A specialized version of `_.memoize` which clears the memoized function's
	 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
	 *
	 * @private
	 * @param {Function} func The function to have its output memoized.
	 * @returns {Function} Returns the new memoized function.
	 */
	function memoizeCapped(func) {
	  var result = memoize(func, function(key) {
	    if (cache.size === MAX_MEMOIZE_SIZE) {
	      cache.clear();
	    }
	    return key;
	  });

	  var cache = result.cache;
	  return result;
	}

	_memoizeCapped = memoizeCapped;
	return _memoizeCapped;
}

export { require_memoizeCapped as __require };
//# sourceMappingURL=_memoizeCapped.js.map
