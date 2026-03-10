import { __require as requireConstant } from './constant.js';
import { __require as require_defineProperty } from './_defineProperty.js';
import { __require as requireIdentity } from './identity.js';

var _baseSetToString;
var hasRequired_baseSetToString;

function require_baseSetToString () {
	if (hasRequired_baseSetToString) return _baseSetToString;
	hasRequired_baseSetToString = 1;
	var constant = requireConstant(),
	    defineProperty = require_defineProperty(),
	    identity = requireIdentity();

	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !defineProperty ? identity : function(func, string) {
	  return defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant(string),
	    'writable': true
	  });
	};

	_baseSetToString = baseSetToString;
	return _baseSetToString;
}

export { require_baseSetToString as __require };
//# sourceMappingURL=_baseSetToString.js.map
