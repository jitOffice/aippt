import { __require as require_baseCreate } from './_baseCreate.js';
import { __require as require_getPrototype } from './_getPrototype.js';
import { __require as require_isPrototype } from './_isPrototype.js';

var _initCloneObject;
var hasRequired_initCloneObject;

function require_initCloneObject () {
	if (hasRequired_initCloneObject) return _initCloneObject;
	hasRequired_initCloneObject = 1;
	var baseCreate = require_baseCreate(),
	    getPrototype = require_getPrototype(),
	    isPrototype = require_isPrototype();

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  return (typeof object.constructor == 'function' && !isPrototype(object))
	    ? baseCreate(getPrototype(object))
	    : {};
	}

	_initCloneObject = initCloneObject;
	return _initCloneObject;
}

export { require_initCloneObject as __require };
//# sourceMappingURL=_initCloneObject.js.map
