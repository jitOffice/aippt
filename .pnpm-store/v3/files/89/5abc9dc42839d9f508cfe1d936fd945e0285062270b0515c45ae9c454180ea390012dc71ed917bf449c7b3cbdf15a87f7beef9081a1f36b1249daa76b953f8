import { __require as require_defineProperty } from './_defineProperty.js';

var _baseAssignValue;
var hasRequired_baseAssignValue;

function require_baseAssignValue () {
	if (hasRequired_baseAssignValue) return _baseAssignValue;
	hasRequired_baseAssignValue = 1;
	var defineProperty = require_defineProperty();

	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
	  if (key == '__proto__' && defineProperty) {
	    defineProperty(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}

	_baseAssignValue = baseAssignValue;
	return _baseAssignValue;
}

export { require_baseAssignValue as __require };
//# sourceMappingURL=_baseAssignValue.js.map
