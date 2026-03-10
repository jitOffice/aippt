import { __require as requireIsSymbol } from './isSymbol.js';

var _toKey;
var hasRequired_toKey;

function require_toKey () {
	if (hasRequired_toKey) return _toKey;
	hasRequired_toKey = 1;
	var isSymbol = requireIsSymbol();

	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey(value) {
	  if (typeof value == 'string' || isSymbol(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -Infinity) ? '-0' : result;
	}

	_toKey = toKey;
	return _toKey;
}

export { require_toKey as __require };
//# sourceMappingURL=_toKey.js.map
