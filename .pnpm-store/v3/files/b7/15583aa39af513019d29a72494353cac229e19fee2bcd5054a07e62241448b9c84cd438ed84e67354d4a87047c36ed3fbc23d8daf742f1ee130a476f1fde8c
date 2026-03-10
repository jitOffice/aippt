import { __require as require_baseAssignValue } from './_baseAssignValue.js';
import { __require as requireEq } from './eq.js';

var _assignMergeValue;
var hasRequired_assignMergeValue;

function require_assignMergeValue () {
	if (hasRequired_assignMergeValue) return _assignMergeValue;
	hasRequired_assignMergeValue = 1;
	var baseAssignValue = require_baseAssignValue(),
	    eq = requireEq();

	/**
	 * This function is like `assignValue` except that it doesn't assign
	 * `undefined` values.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignMergeValue(object, key, value) {
	  if ((value !== undefined && !eq(object[key], value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue(object, key, value);
	  }
	}

	_assignMergeValue = assignMergeValue;
	return _assignMergeValue;
}

export { require_assignMergeValue as __require };
//# sourceMappingURL=_assignMergeValue.js.map
