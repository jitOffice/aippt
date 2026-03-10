import { __require as require_assignMergeValue } from './_assignMergeValue.js';
import { __require as require_cloneBuffer } from './_cloneBuffer.js';
import { __require as require_cloneTypedArray } from './_cloneTypedArray.js';
import { __require as require_copyArray } from './_copyArray.js';
import { __require as require_initCloneObject } from './_initCloneObject.js';
import { __require as requireIsArguments } from './isArguments.js';
import { __require as requireIsArray } from './isArray.js';
import { __require as requireIsArrayLikeObject } from './isArrayLikeObject.js';
import { __require as requireIsBuffer } from './isBuffer.js';
import { __require as requireIsFunction } from './isFunction.js';
import { __require as requireIsObject } from './isObject.js';
import { __require as requireIsPlainObject } from './isPlainObject.js';
import { __require as requireIsTypedArray } from './isTypedArray.js';
import { __require as require_safeGet } from './_safeGet.js';
import { __require as requireToPlainObject } from './toPlainObject.js';

var _baseMergeDeep;
var hasRequired_baseMergeDeep;

function require_baseMergeDeep () {
	if (hasRequired_baseMergeDeep) return _baseMergeDeep;
	hasRequired_baseMergeDeep = 1;
	var assignMergeValue = require_assignMergeValue(),
	    cloneBuffer = require_cloneBuffer(),
	    cloneTypedArray = require_cloneTypedArray(),
	    copyArray = require_copyArray(),
	    initCloneObject = require_initCloneObject(),
	    isArguments = requireIsArguments(),
	    isArray = requireIsArray(),
	    isArrayLikeObject = requireIsArrayLikeObject(),
	    isBuffer = requireIsBuffer(),
	    isFunction = requireIsFunction(),
	    isObject = requireIsObject(),
	    isPlainObject = requireIsPlainObject(),
	    isTypedArray = requireIsTypedArray(),
	    safeGet = require_safeGet(),
	    toPlainObject = requireToPlainObject();

	/**
	 * A specialized version of `baseMerge` for arrays and objects which performs
	 * deep merges and tracks traversed objects enabling objects with circular
	 * references to be merged.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {string} key The key of the value to merge.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} mergeFunc The function to merge values.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	  var objValue = safeGet(object, key),
	      srcValue = safeGet(source, key),
	      stacked = stack.get(srcValue);

	  if (stacked) {
	    assignMergeValue(object, key, stacked);
	    return;
	  }
	  var newValue = customizer
	    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
	    : undefined;

	  var isCommon = newValue === undefined;

	  if (isCommon) {
	    var isArr = isArray(srcValue),
	        isBuff = !isArr && isBuffer(srcValue),
	        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

	    newValue = srcValue;
	    if (isArr || isBuff || isTyped) {
	      if (isArray(objValue)) {
	        newValue = objValue;
	      }
	      else if (isArrayLikeObject(objValue)) {
	        newValue = copyArray(objValue);
	      }
	      else if (isBuff) {
	        isCommon = false;
	        newValue = cloneBuffer(srcValue, true);
	      }
	      else if (isTyped) {
	        isCommon = false;
	        newValue = cloneTypedArray(srcValue, true);
	      }
	      else {
	        newValue = [];
	      }
	    }
	    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
	      newValue = objValue;
	      if (isArguments(objValue)) {
	        newValue = toPlainObject(objValue);
	      }
	      else if (!isObject(objValue) || isFunction(objValue)) {
	        newValue = initCloneObject(srcValue);
	      }
	    }
	    else {
	      isCommon = false;
	    }
	  }
	  if (isCommon) {
	    // Recursively merge objects and arrays (susceptible to call stack limits).
	    stack.set(srcValue, newValue);
	    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
	    stack['delete'](srcValue);
	  }
	  assignMergeValue(object, key, newValue);
	}

	_baseMergeDeep = baseMergeDeep;
	return _baseMergeDeep;
}

export { require_baseMergeDeep as __require };
//# sourceMappingURL=_baseMergeDeep.js.map
