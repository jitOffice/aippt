/** Used for built-in method references. */

var _baseHas;
var hasRequired_baseHas;

function require_baseHas () {
	if (hasRequired_baseHas) return _baseHas;
	hasRequired_baseHas = 1;
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * The base implementation of `_.has` without support for deep paths.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHas(object, key) {
	  return object != null && hasOwnProperty.call(object, key);
	}

	_baseHas = baseHas;
	return _baseHas;
}

export { require_baseHas as __require };
//# sourceMappingURL=_baseHas.js.map
