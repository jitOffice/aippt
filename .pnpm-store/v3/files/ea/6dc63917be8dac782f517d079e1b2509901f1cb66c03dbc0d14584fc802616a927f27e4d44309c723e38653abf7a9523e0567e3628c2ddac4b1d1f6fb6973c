import { __require as require_baseRange } from './_baseRange.js';
import { __require as require_isIterateeCall } from './_isIterateeCall.js';
import { __require as requireToFinite } from './toFinite.js';

var _createRange;
var hasRequired_createRange;

function require_createRange () {
	if (hasRequired_createRange) return _createRange;
	hasRequired_createRange = 1;
	var baseRange = require_baseRange(),
	    isIterateeCall = require_isIterateeCall(),
	    toFinite = requireToFinite();

	/**
	 * Creates a `_.range` or `_.rangeRight` function.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new range function.
	 */
	function createRange(fromRight) {
	  return function(start, end, step) {
	    if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
	      end = step = undefined;
	    }
	    // Ensure the sign of `-0` is preserved.
	    start = toFinite(start);
	    if (end === undefined) {
	      end = start;
	      start = 0;
	    } else {
	      end = toFinite(end);
	    }
	    step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
	    return baseRange(start, end, step, fromRight);
	  };
	}

	_createRange = createRange;
	return _createRange;
}

export { require_createRange as __require };
//# sourceMappingURL=_createRange.js.map
