/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */

var _safeGet;
var hasRequired_safeGet;

function require_safeGet () {
	if (hasRequired_safeGet) return _safeGet;
	hasRequired_safeGet = 1;
	function safeGet(object, key) {
	  if (key === 'constructor' && typeof object[key] === 'function') {
	    return;
	  }

	  if (key == '__proto__') {
	    return;
	  }

	  return object[key];
	}

	_safeGet = safeGet;
	return _safeGet;
}

export { require_safeGet as __require };
//# sourceMappingURL=_safeGet.js.map
