import { __require as require_baseGetAllKeys } from './_baseGetAllKeys.js';
import { __require as require_getSymbolsIn } from './_getSymbolsIn.js';
import { __require as requireKeysIn } from './keysIn.js';

var _getAllKeysIn;
var hasRequired_getAllKeysIn;

function require_getAllKeysIn () {
	if (hasRequired_getAllKeysIn) return _getAllKeysIn;
	hasRequired_getAllKeysIn = 1;
	var baseGetAllKeys = require_baseGetAllKeys(),
	    getSymbolsIn = require_getSymbolsIn(),
	    keysIn = requireKeysIn();

	/**
	 * Creates an array of own and inherited enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeysIn(object) {
	  return baseGetAllKeys(object, keysIn, getSymbolsIn);
	}

	_getAllKeysIn = getAllKeysIn;
	return _getAllKeysIn;
}

export { require_getAllKeysIn as __require };
//# sourceMappingURL=_getAllKeysIn.js.map
