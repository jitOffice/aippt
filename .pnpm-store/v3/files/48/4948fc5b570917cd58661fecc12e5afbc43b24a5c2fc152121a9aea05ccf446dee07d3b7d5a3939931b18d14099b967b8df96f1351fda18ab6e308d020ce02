/** Used to stand-in for `undefined` hash values. */

var _setCacheAdd;
var hasRequired_setCacheAdd;

function require_setCacheAdd () {
	if (hasRequired_setCacheAdd) return _setCacheAdd;
	hasRequired_setCacheAdd = 1;
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED);
	  return this;
	}

	_setCacheAdd = setCacheAdd;
	return _setCacheAdd;
}

export { require_setCacheAdd as __require };
//# sourceMappingURL=_setCacheAdd.js.map
