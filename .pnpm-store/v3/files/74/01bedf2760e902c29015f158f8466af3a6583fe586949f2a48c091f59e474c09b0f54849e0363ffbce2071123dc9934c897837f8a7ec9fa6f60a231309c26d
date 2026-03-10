import { __require as require_Symbol } from './_Symbol.js';
import { __require as require_arrayMap } from './_arrayMap.js';
import { __require as requireIsArray } from './isArray.js';
import { __require as requireIsSymbol } from './isSymbol.js';

var _baseToString;
var hasRequired_baseToString;

function require_baseToString () {
	if (hasRequired_baseToString) return _baseToString;
	hasRequired_baseToString = 1;
	var Symbol = require_Symbol(),
	    arrayMap = require_arrayMap(),
	    isArray = requireIsArray(),
	    isSymbol = requireIsSymbol();

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isArray(value)) {
	    // Recursively convert values (susceptible to call stack limits).
	    return arrayMap(value, baseToString) + '';
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -Infinity) ? '-0' : result;
	}

	_baseToString = baseToString;
	return _baseToString;
}

export { require_baseToString as __require };
//# sourceMappingURL=_baseToString.js.map
