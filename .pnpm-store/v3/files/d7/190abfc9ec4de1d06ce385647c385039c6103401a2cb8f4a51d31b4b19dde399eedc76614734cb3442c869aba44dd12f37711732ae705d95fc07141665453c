import { __require as require_asciiSize } from './_asciiSize.js';
import { __require as require_hasUnicode } from './_hasUnicode.js';
import { __require as require_unicodeSize } from './_unicodeSize.js';

var _stringSize;
var hasRequired_stringSize;

function require_stringSize () {
	if (hasRequired_stringSize) return _stringSize;
	hasRequired_stringSize = 1;
	var asciiSize = require_asciiSize(),
	    hasUnicode = require_hasUnicode(),
	    unicodeSize = require_unicodeSize();

	/**
	 * Gets the number of symbols in `string`.
	 *
	 * @private
	 * @param {string} string The string to inspect.
	 * @returns {number} Returns the string size.
	 */
	function stringSize(string) {
	  return hasUnicode(string)
	    ? unicodeSize(string)
	    : asciiSize(string);
	}

	_stringSize = stringSize;
	return _stringSize;
}

export { require_stringSize as __require };
//# sourceMappingURL=_stringSize.js.map
