/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */

var constant_1;
var hasRequiredConstant;

function requireConstant () {
	if (hasRequiredConstant) return constant_1;
	hasRequiredConstant = 1;
	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	constant_1 = constant;
	return constant_1;
}

export { requireConstant as __require };
//# sourceMappingURL=constant.js.map
