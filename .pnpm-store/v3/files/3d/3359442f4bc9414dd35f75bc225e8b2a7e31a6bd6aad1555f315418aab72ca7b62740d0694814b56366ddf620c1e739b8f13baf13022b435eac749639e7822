/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */

var _isKeyable;
var hasRequired_isKeyable;

function require_isKeyable () {
	if (hasRequired_isKeyable) return _isKeyable;
	hasRequired_isKeyable = 1;
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	_isKeyable = isKeyable;
	return _isKeyable;
}

export { require_isKeyable as __require };
//# sourceMappingURL=_isKeyable.js.map
