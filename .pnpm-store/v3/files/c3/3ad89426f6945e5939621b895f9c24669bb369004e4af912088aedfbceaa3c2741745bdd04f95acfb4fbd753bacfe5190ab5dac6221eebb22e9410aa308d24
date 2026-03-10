import { __require as require_baseIteratee } from './_baseIteratee.js';
import { __require as requireIsArrayLike } from './isArrayLike.js';
import { __require as requireKeys } from './keys.js';

var _createFind;
var hasRequired_createFind;

function require_createFind () {
	if (hasRequired_createFind) return _createFind;
	hasRequired_createFind = 1;
	var baseIteratee = require_baseIteratee(),
	    isArrayLike = requireIsArrayLike(),
	    keys = requireKeys();

	/**
	 * Creates a `_.find` or `_.findLast` function.
	 *
	 * @private
	 * @param {Function} findIndexFunc The function to find the collection index.
	 * @returns {Function} Returns the new find function.
	 */
	function createFind(findIndexFunc) {
	  return function(collection, predicate, fromIndex) {
	    var iterable = Object(collection);
	    if (!isArrayLike(collection)) {
	      var iteratee = baseIteratee(predicate, 3);
	      collection = keys(collection);
	      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
	    }
	    var index = findIndexFunc(collection, predicate, fromIndex);
	    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
	  };
	}

	_createFind = createFind;
	return _createFind;
}

export { require_createFind as __require };
//# sourceMappingURL=_createFind.js.map
