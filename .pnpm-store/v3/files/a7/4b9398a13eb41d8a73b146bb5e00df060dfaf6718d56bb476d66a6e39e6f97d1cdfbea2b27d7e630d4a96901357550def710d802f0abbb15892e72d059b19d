import { __require as require_getTag } from './_getTag.js';
import { __require as requireIsObjectLike } from './isObjectLike.js';

var _baseIsSet;
var hasRequired_baseIsSet;

function require_baseIsSet () {
	if (hasRequired_baseIsSet) return _baseIsSet;
	hasRequired_baseIsSet = 1;
	var getTag = require_getTag(),
	    isObjectLike = requireIsObjectLike();

	/** `Object#toString` result references. */
	var setTag = '[object Set]';

	/**
	 * The base implementation of `_.isSet` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
	 */
	function baseIsSet(value) {
	  return isObjectLike(value) && getTag(value) == setTag;
	}

	_baseIsSet = baseIsSet;
	return _baseIsSet;
}

export { require_baseIsSet as __require };
//# sourceMappingURL=_baseIsSet.js.map
