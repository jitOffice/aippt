import { __require as requireIdentity } from './identity.js';

var _castFunction;
var hasRequired_castFunction;

function require_castFunction () {
	if (hasRequired_castFunction) return _castFunction;
	hasRequired_castFunction = 1;
	var identity = requireIdentity();

	/**
	 * Casts `value` to `identity` if it's not a function.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {Function} Returns cast function.
	 */
	function castFunction(value) {
	  return typeof value == 'function' ? value : identity;
	}

	_castFunction = castFunction;
	return _castFunction;
}

export { require_castFunction as __require };
//# sourceMappingURL=_castFunction.js.map
