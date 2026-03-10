/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */

var _createBaseFor;
var hasRequired_createBaseFor;

function require_createBaseFor () {
	if (hasRequired_createBaseFor) return _createBaseFor;
	hasRequired_createBaseFor = 1;
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	_createBaseFor = createBaseFor;
	return _createBaseFor;
}

export { require_createBaseFor as __require };
//# sourceMappingURL=_createBaseFor.js.map
