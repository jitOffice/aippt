import { __require as require_baseForOwn } from './_baseForOwn.js';
import { __require as require_createBaseEach } from './_createBaseEach.js';

var _baseEach;
var hasRequired_baseEach;

function require_baseEach () {
	if (hasRequired_baseEach) return _baseEach;
	hasRequired_baseEach = 1;
	var baseForOwn = require_baseForOwn(),
	    createBaseEach = require_createBaseEach();

	/**
	 * The base implementation of `_.forEach` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object} Returns `collection`.
	 */
	var baseEach = createBaseEach(baseForOwn);

	_baseEach = baseEach;
	return _baseEach;
}

export { require_baseEach as __require };
//# sourceMappingURL=_baseEach.js.map
