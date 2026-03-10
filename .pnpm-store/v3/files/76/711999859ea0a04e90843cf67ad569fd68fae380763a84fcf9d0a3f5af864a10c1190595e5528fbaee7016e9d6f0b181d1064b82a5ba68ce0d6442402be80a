import { __require as require_baseEach } from './_baseEach.js';
import { __require as requireIsArrayLike } from './isArrayLike.js';

var _baseMap;
var hasRequired_baseMap;

function require_baseMap () {
	if (hasRequired_baseMap) return _baseMap;
	hasRequired_baseMap = 1;
	var baseEach = require_baseEach(),
	    isArrayLike = requireIsArrayLike();

	/**
	 * The base implementation of `_.map` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function baseMap(collection, iteratee) {
	  var index = -1,
	      result = isArrayLike(collection) ? Array(collection.length) : [];

	  baseEach(collection, function(value, key, collection) {
	    result[++index] = iteratee(value, key, collection);
	  });
	  return result;
	}

	_baseMap = baseMap;
	return _baseMap;
}

export { require_baseMap as __require };
//# sourceMappingURL=_baseMap.js.map
