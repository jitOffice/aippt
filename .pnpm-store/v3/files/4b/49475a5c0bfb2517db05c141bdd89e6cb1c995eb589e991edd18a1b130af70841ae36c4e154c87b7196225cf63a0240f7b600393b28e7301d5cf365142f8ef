import { __require as require_Symbol } from './_Symbol.js';
import { __require as requireIsArguments } from './isArguments.js';
import { __require as requireIsArray } from './isArray.js';

var _isFlattenable;
var hasRequired_isFlattenable;

function require_isFlattenable () {
	if (hasRequired_isFlattenable) return _isFlattenable;
	hasRequired_isFlattenable = 1;
	var Symbol = require_Symbol(),
	    isArguments = requireIsArguments(),
	    isArray = requireIsArray();

	/** Built-in value references. */
	var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

	/**
	 * Checks if `value` is a flattenable `arguments` object or array.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
	 */
	function isFlattenable(value) {
	  return isArray(value) || isArguments(value) ||
	    !!(spreadableSymbol && value && value[spreadableSymbol]);
	}

	_isFlattenable = isFlattenable;
	return _isFlattenable;
}

export { require_isFlattenable as __require };
//# sourceMappingURL=_isFlattenable.js.map
