import { __require as require_baseEach } from './_baseEach.js';

var _baseFilter;
var hasRequired_baseFilter;

function require_baseFilter () {
	if (hasRequired_baseFilter) return _baseFilter;
	hasRequired_baseFilter = 1;
	var baseEach = require_baseEach();

	/**
	 * The base implementation of `_.filter` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function baseFilter(collection, predicate) {
	  var result = [];
	  baseEach(collection, function(value, index, collection) {
	    if (predicate(value, index, collection)) {
	      result.push(value);
	    }
	  });
	  return result;
	}

	_baseFilter = baseFilter;
	return _baseFilter;
}

export { require_baseFilter as __require };
//# sourceMappingURL=_baseFilter.js.map
