import { __require as require_baseGetAllKeys } from './_baseGetAllKeys.js';
import { __require as require_getSymbols } from './_getSymbols.js';
import { __require as requireKeys } from './keys.js';

var _getAllKeys;
var hasRequired_getAllKeys;

function require_getAllKeys () {
	if (hasRequired_getAllKeys) return _getAllKeys;
	hasRequired_getAllKeys = 1;
	var baseGetAllKeys = require_baseGetAllKeys(),
	    getSymbols = require_getSymbols(),
	    keys = requireKeys();

	/**
	 * Creates an array of own enumerable property names and symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeys(object) {
	  return baseGetAllKeys(object, keys, getSymbols);
	}

	_getAllKeys = getAllKeys;
	return _getAllKeys;
}

export { require_getAllKeys as __require };
//# sourceMappingURL=_getAllKeys.js.map
