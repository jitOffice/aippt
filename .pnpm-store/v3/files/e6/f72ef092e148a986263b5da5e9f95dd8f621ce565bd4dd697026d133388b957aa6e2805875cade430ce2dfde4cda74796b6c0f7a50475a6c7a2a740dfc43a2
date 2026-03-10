/**
 * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
 *
 * @private
 * @param {Array} props The property identifiers.
 * @param {Array} values The property values.
 * @param {Function} assignFunc The function to assign values.
 * @returns {Object} Returns the new object.
 */

var _baseZipObject;
var hasRequired_baseZipObject;

function require_baseZipObject () {
	if (hasRequired_baseZipObject) return _baseZipObject;
	hasRequired_baseZipObject = 1;
	function baseZipObject(props, values, assignFunc) {
	  var index = -1,
	      length = props.length,
	      valsLength = values.length,
	      result = {};

	  while (++index < length) {
	    var value = index < valsLength ? values[index] : undefined;
	    assignFunc(result, props[index], value);
	  }
	  return result;
	}

	_baseZipObject = baseZipObject;
	return _baseZipObject;
}

export { require_baseZipObject as __require };
//# sourceMappingURL=_baseZipObject.js.map
