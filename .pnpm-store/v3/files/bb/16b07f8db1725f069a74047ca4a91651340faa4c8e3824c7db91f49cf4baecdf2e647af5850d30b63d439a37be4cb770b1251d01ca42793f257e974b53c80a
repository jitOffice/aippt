import { __require as require_arrayPush } from './_arrayPush.js';
import { __require as requireIsArray } from './isArray.js';

var _baseGetAllKeys;
var hasRequired_baseGetAllKeys;

function require_baseGetAllKeys () {
	if (hasRequired_baseGetAllKeys) return _baseGetAllKeys;
	hasRequired_baseGetAllKeys = 1;
	var arrayPush = require_arrayPush(),
	    isArray = requireIsArray();

	/**
	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	  var result = keysFunc(object);
	  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
	}

	_baseGetAllKeys = baseGetAllKeys;
	return _baseGetAllKeys;
}

export { require_baseGetAllKeys as __require };
//# sourceMappingURL=_baseGetAllKeys.js.map
