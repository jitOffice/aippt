import { __require as require_Stack } from './_Stack.js';
import { __require as require_assignMergeValue } from './_assignMergeValue.js';
import { __require as require_baseFor } from './_baseFor.js';
import { __require as require_baseMergeDeep } from './_baseMergeDeep.js';
import { __require as requireIsObject } from './isObject.js';
import { __require as requireKeysIn } from './keysIn.js';
import { __require as require_safeGet } from './_safeGet.js';

var _baseMerge;
var hasRequired_baseMerge;

function require_baseMerge () {
	if (hasRequired_baseMerge) return _baseMerge;
	hasRequired_baseMerge = 1;
	var Stack = require_Stack(),
	    assignMergeValue = require_assignMergeValue(),
	    baseFor = require_baseFor(),
	    baseMergeDeep = require_baseMergeDeep(),
	    isObject = requireIsObject(),
	    keysIn = requireKeysIn(),
	    safeGet = require_safeGet();

	/**
	 * The base implementation of `_.merge` without support for multiple sources.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} [customizer] The function to customize merged values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMerge(object, source, srcIndex, customizer, stack) {
	  if (object === source) {
	    return;
	  }
	  baseFor(source, function(srcValue, key) {
	    stack || (stack = new Stack);
	    if (isObject(srcValue)) {
	      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
	    }
	    else {
	      var newValue = customizer
	        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
	        : undefined;

	      if (newValue === undefined) {
	        newValue = srcValue;
	      }
	      assignMergeValue(object, key, newValue);
	    }
	  }, keysIn);
	}

	_baseMerge = baseMerge;
	return _baseMerge;
}

export { require_baseMerge as __require };
//# sourceMappingURL=_baseMerge.js.map
