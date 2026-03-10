import { __require as requireIdentity } from './identity.js';
import { __require as require_overRest } from './_overRest.js';
import { __require as require_setToString } from './_setToString.js';

var _baseRest;
var hasRequired_baseRest;

function require_baseRest () {
	if (hasRequired_baseRest) return _baseRest;
	hasRequired_baseRest = 1;
	var identity = requireIdentity(),
	    overRest = require_overRest(),
	    setToString = require_setToString();

	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return setToString(overRest(func, start, identity), func + '');
	}

	_baseRest = baseRest;
	return _baseRest;
}

export { require_baseRest as __require };
//# sourceMappingURL=_baseRest.js.map
