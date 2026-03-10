/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

var _nativeKeysIn;
var hasRequired_nativeKeysIn;

function require_nativeKeysIn () {
	if (hasRequired_nativeKeysIn) return _nativeKeysIn;
	hasRequired_nativeKeysIn = 1;
	function nativeKeysIn(object) {
	  var result = [];
	  if (object != null) {
	    for (var key in Object(object)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	_nativeKeysIn = nativeKeysIn;
	return _nativeKeysIn;
}

export { require_nativeKeysIn as __require };
//# sourceMappingURL=_nativeKeysIn.js.map
