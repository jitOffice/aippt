import { __require as require_isStrictComparable } from './_isStrictComparable.js';
import { __require as requireKeys } from './keys.js';

var _getMatchData;
var hasRequired_getMatchData;

function require_getMatchData () {
	if (hasRequired_getMatchData) return _getMatchData;
	hasRequired_getMatchData = 1;
	var isStrictComparable = require_isStrictComparable(),
	    keys = requireKeys();

	/**
	 * Gets the property names, values, and compare flags of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the match data of `object`.
	 */
	function getMatchData(object) {
	  var result = keys(object),
	      length = result.length;

	  while (length--) {
	    var key = result[length],
	        value = object[key];

	    result[length] = [key, value, isStrictComparable(value)];
	  }
	  return result;
	}

	_getMatchData = getMatchData;
	return _getMatchData;
}

export { require_getMatchData as __require };
//# sourceMappingURL=_getMatchData.js.map
