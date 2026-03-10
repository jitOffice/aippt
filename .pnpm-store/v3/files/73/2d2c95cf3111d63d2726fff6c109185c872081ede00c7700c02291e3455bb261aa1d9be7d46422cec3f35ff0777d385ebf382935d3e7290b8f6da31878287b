import { __require as require_memoizeCapped } from './_memoizeCapped.js';

var _stringToPath;
var hasRequired_stringToPath;

function require_stringToPath () {
	if (hasRequired_stringToPath) return _stringToPath;
	hasRequired_stringToPath = 1;
	var memoizeCapped = require_memoizeCapped();

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath = memoizeCapped(function(string) {
	  var result = [];
	  if (string.charCodeAt(0) === 46 /* . */) {
	    result.push('');
	  }
	  string.replace(rePropName, function(match, number, quote, subString) {
	    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	_stringToPath = stringToPath;
	return _stringToPath;
}

export { require_stringToPath as __require };
//# sourceMappingURL=_stringToPath.js.map
