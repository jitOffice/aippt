import { __require as require_assignValue } from './_assignValue.js';
import { __require as require_baseZipObject } from './_baseZipObject.js';

var zipObject_1;
var hasRequiredZipObject;

function requireZipObject () {
	if (hasRequiredZipObject) return zipObject_1;
	hasRequiredZipObject = 1;
	var assignValue = require_assignValue(),
	    baseZipObject = require_baseZipObject();

	/**
	 * This method is like `_.fromPairs` except that it accepts two arrays,
	 * one of property identifiers and one of corresponding values.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.4.0
	 * @category Array
	 * @param {Array} [props=[]] The property identifiers.
	 * @param {Array} [values=[]] The property values.
	 * @returns {Object} Returns the new object.
	 * @example
	 *
	 * _.zipObject(['a', 'b'], [1, 2]);
	 * // => { 'a': 1, 'b': 2 }
	 */
	function zipObject(props, values) {
	  return baseZipObject(props || [], values || [], assignValue);
	}

	zipObject_1 = zipObject;
	return zipObject_1;
}

export { requireZipObject as __require };
//# sourceMappingURL=zipObject.js.map
