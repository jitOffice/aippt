import { __require as require_baseFor } from './_baseFor.js';
import { __require as requireKeys } from './keys.js';

var _baseForOwn;
var hasRequired_baseForOwn;

function require_baseForOwn () {
	if (hasRequired_baseForOwn) return _baseForOwn;
	hasRequired_baseForOwn = 1;
	var baseFor = require_baseFor(),
	    keys = requireKeys();

	/**
	 * The base implementation of `_.forOwn` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return object && baseFor(object, iteratee, keys);
	}

	_baseForOwn = baseForOwn;
	return _baseForOwn;
}

export { require_baseForOwn as __require };
//# sourceMappingURL=_baseForOwn.js.map
