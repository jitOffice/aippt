import { __require as require_arrayFilter } from './_arrayFilter.js';
import { __require as requireStubArray } from './stubArray.js';

var _getSymbols;
var hasRequired_getSymbols;

function require_getSymbols () {
	if (hasRequired_getSymbols) return _getSymbols;
	hasRequired_getSymbols = 1;
	var arrayFilter = require_arrayFilter(),
	    stubArray = requireStubArray();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols;

	/**
	 * Creates an array of the own enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
	  if (object == null) {
	    return [];
	  }
	  object = Object(object);
	  return arrayFilter(nativeGetSymbols(object), function(symbol) {
	    return propertyIsEnumerable.call(object, symbol);
	  });
	};

	_getSymbols = getSymbols;
	return _getSymbols;
}

export { require_getSymbols as __require };
//# sourceMappingURL=_getSymbols.js.map
