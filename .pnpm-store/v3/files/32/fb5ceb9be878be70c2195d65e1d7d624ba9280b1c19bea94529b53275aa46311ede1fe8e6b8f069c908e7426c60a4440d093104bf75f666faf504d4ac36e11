import { __require as require_baseValues } from './_baseValues.js';
import { __require as requireKeys } from './keys.js';

var values_1;
var hasRequiredValues;

function requireValues () {
	if (hasRequiredValues) return values_1;
	hasRequiredValues = 1;
	var baseValues = require_baseValues(),
	    keys = requireKeys();

	/**
	 * Creates an array of the own enumerable string keyed property values of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property values.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.values(new Foo);
	 * // => [1, 2] (iteration order is not guaranteed)
	 *
	 * _.values('hi');
	 * // => ['h', 'i']
	 */
	function values(object) {
	  return object == null ? [] : baseValues(object, keys(object));
	}

	values_1 = values;
	return values_1;
}

export { requireValues as __require };
//# sourceMappingURL=values.js.map
