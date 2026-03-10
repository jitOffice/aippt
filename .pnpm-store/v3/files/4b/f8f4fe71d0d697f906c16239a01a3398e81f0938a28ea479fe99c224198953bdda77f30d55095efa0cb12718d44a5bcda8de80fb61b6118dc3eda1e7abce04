import { __require as require_arrayPush } from './_arrayPush.js';
import { __require as require_getPrototype } from './_getPrototype.js';
import { __require as require_getSymbols } from './_getSymbols.js';
import { __require as requireStubArray } from './stubArray.js';

var _getSymbolsIn;
var hasRequired_getSymbolsIn;

function require_getSymbolsIn () {
	if (hasRequired_getSymbolsIn) return _getSymbolsIn;
	hasRequired_getSymbolsIn = 1;
	var arrayPush = require_arrayPush(),
	    getPrototype = require_getPrototype(),
	    getSymbols = require_getSymbols(),
	    stubArray = requireStubArray();

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols;

	/**
	 * Creates an array of the own and inherited enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
	  var result = [];
	  while (object) {
	    arrayPush(result, getSymbols(object));
	    object = getPrototype(object);
	  }
	  return result;
	};

	_getSymbolsIn = getSymbolsIn;
	return _getSymbolsIn;
}

export { require_getSymbolsIn as __require };
//# sourceMappingURL=_getSymbolsIn.js.map
