import { __require as require_baseGet } from './_baseGet.js';

var _basePropertyDeep;
var hasRequired_basePropertyDeep;

function require_basePropertyDeep () {
	if (hasRequired_basePropertyDeep) return _basePropertyDeep;
	hasRequired_basePropertyDeep = 1;
	var baseGet = require_baseGet();

	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function basePropertyDeep(path) {
	  return function(object) {
	    return baseGet(object, path);
	  };
	}

	_basePropertyDeep = basePropertyDeep;
	return _basePropertyDeep;
}

export { require_basePropertyDeep as __require };
//# sourceMappingURL=_basePropertyDeep.js.map
