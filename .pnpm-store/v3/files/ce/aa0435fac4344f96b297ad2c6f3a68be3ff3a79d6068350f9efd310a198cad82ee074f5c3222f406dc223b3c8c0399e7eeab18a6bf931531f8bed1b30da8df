import { __require as requireFlatten } from './flatten.js';
import { __require as require_overRest } from './_overRest.js';
import { __require as require_setToString } from './_setToString.js';

var _flatRest;
var hasRequired_flatRest;

function require_flatRest () {
	if (hasRequired_flatRest) return _flatRest;
	hasRequired_flatRest = 1;
	var flatten = requireFlatten(),
	    overRest = require_overRest(),
	    setToString = require_setToString();

	/**
	 * A specialized version of `baseRest` which flattens the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @returns {Function} Returns the new function.
	 */
	function flatRest(func) {
	  return setToString(overRest(func, undefined, flatten), func + '');
	}

	_flatRest = flatRest;
	return _flatRest;
}

export { require_flatRest as __require };
//# sourceMappingURL=_flatRest.js.map
