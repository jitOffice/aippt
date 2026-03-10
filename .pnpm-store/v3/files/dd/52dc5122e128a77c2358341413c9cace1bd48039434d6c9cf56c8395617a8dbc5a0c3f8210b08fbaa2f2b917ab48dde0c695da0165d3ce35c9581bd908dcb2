/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */

var _baseProperty;
var hasRequired_baseProperty;

function require_baseProperty () {
	if (hasRequired_baseProperty) return _baseProperty;
	hasRequired_baseProperty = 1;
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	_baseProperty = baseProperty;
	return _baseProperty;
}

export { require_baseProperty as __require };
//# sourceMappingURL=_baseProperty.js.map
