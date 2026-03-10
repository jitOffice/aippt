import { __require as require_baseSetToString } from './_baseSetToString.js';
import { __require as require_shortOut } from './_shortOut.js';

var _setToString;
var hasRequired_setToString;

function require_setToString () {
	if (hasRequired_setToString) return _setToString;
	hasRequired_setToString = 1;
	var baseSetToString = require_baseSetToString(),
	    shortOut = require_shortOut();

	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = shortOut(baseSetToString);

	_setToString = setToString;
	return _setToString;
}

export { require_setToString as __require };
//# sourceMappingURL=_setToString.js.map
