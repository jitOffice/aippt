import { __require as require_arrayMap } from './_arrayMap.js';
import { __require as require_baseGet } from './_baseGet.js';
import { __require as require_baseIteratee } from './_baseIteratee.js';
import { __require as require_baseMap } from './_baseMap.js';
import { __require as require_baseSortBy } from './_baseSortBy.js';
import { __require as require_baseUnary } from './_baseUnary.js';
import { __require as require_compareMultiple } from './_compareMultiple.js';
import { __require as requireIdentity } from './identity.js';
import { __require as requireIsArray } from './isArray.js';

var _baseOrderBy;
var hasRequired_baseOrderBy;

function require_baseOrderBy () {
	if (hasRequired_baseOrderBy) return _baseOrderBy;
	hasRequired_baseOrderBy = 1;
	var arrayMap = require_arrayMap(),
	    baseGet = require_baseGet(),
	    baseIteratee = require_baseIteratee(),
	    baseMap = require_baseMap(),
	    baseSortBy = require_baseSortBy(),
	    baseUnary = require_baseUnary(),
	    compareMultiple = require_compareMultiple(),
	    identity = requireIdentity(),
	    isArray = requireIsArray();

	/**
	 * The base implementation of `_.orderBy` without param guards.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
	 * @param {string[]} orders The sort orders of `iteratees`.
	 * @returns {Array} Returns the new sorted array.
	 */
	function baseOrderBy(collection, iteratees, orders) {
	  if (iteratees.length) {
	    iteratees = arrayMap(iteratees, function(iteratee) {
	      if (isArray(iteratee)) {
	        return function(value) {
	          return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
	        }
	      }
	      return iteratee;
	    });
	  } else {
	    iteratees = [identity];
	  }

	  var index = -1;
	  iteratees = arrayMap(iteratees, baseUnary(baseIteratee));

	  var result = baseMap(collection, function(value, key, collection) {
	    var criteria = arrayMap(iteratees, function(iteratee) {
	      return iteratee(value);
	    });
	    return { 'criteria': criteria, 'index': ++index, 'value': value };
	  });

	  return baseSortBy(result, function(object, other) {
	    return compareMultiple(object, other, orders);
	  });
	}

	_baseOrderBy = baseOrderBy;
	return _baseOrderBy;
}

export { require_baseOrderBy as __require };
//# sourceMappingURL=_baseOrderBy.js.map
