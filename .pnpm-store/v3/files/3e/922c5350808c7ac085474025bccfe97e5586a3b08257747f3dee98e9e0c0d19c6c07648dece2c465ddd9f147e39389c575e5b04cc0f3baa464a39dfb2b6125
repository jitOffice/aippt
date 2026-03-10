import { __require as require_copyObject } from './_copyObject.js';
import { __require as requireKeysIn } from './keysIn.js';

var _baseAssignIn;
var hasRequired_baseAssignIn;

function require_baseAssignIn () {
	if (hasRequired_baseAssignIn) return _baseAssignIn;
	hasRequired_baseAssignIn = 1;
	var copyObject = require_copyObject(),
	    keysIn = requireKeysIn();

	/**
	 * The base implementation of `_.assignIn` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssignIn(object, source) {
	  return object && copyObject(source, keysIn(source), object);
	}

	_baseAssignIn = baseAssignIn;
	return _baseAssignIn;
}

export { require_baseAssignIn as __require };
//# sourceMappingURL=_baseAssignIn.js.map
