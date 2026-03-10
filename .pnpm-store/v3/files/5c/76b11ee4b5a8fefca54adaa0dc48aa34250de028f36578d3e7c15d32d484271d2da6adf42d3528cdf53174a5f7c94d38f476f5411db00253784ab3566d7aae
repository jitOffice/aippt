import { __require as require_copyObject } from './_copyObject.js';
import { __require as requireKeysIn } from './keysIn.js';

var toPlainObject_1;
var hasRequiredToPlainObject;

function requireToPlainObject () {
	if (hasRequiredToPlainObject) return toPlainObject_1;
	hasRequiredToPlainObject = 1;
	var copyObject = require_copyObject(),
	    keysIn = requireKeysIn();

	/**
	 * Converts `value` to a plain object flattening inherited enumerable string
	 * keyed properties of `value` to own properties of the plain object.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {Object} Returns the converted plain object.
	 * @example
	 *
	 * function Foo() {
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.assign({ 'a': 1 }, new Foo);
	 * // => { 'a': 1, 'b': 2 }
	 *
	 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	 * // => { 'a': 1, 'b': 2, 'c': 3 }
	 */
	function toPlainObject(value) {
	  return copyObject(value, keysIn(value));
	}

	toPlainObject_1 = toPlainObject;
	return toPlainObject_1;
}

export { requireToPlainObject as __require };
//# sourceMappingURL=toPlainObject.js.map
