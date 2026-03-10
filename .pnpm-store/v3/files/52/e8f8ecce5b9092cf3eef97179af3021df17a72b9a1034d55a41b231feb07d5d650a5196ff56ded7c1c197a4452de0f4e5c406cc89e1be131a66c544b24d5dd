import { __require as require_DataView } from './_DataView.js';
import { __require as require_Map } from './_Map.js';
import { __require as require_Promise } from './_Promise.js';
import { __require as require_Set } from './_Set.js';
import { __require as require_WeakMap } from './_WeakMap.js';
import { __require as require_baseGetTag } from './_baseGetTag.js';
import { __require as require_toSource } from './_toSource.js';

var _getTag;
var hasRequired_getTag;

function require_getTag () {
	if (hasRequired_getTag) return _getTag;
	hasRequired_getTag = 1;
	var DataView = require_DataView(),
	    Map = require_Map(),
	    Promise = require_Promise(),
	    Set = require_Set(),
	    WeakMap = require_WeakMap(),
	    baseGetTag = require_baseGetTag(),
	    toSource = require_toSource();

	/** `Object#toString` result references. */
	var mapTag = '[object Map]',
	    objectTag = '[object Object]',
	    promiseTag = '[object Promise]',
	    setTag = '[object Set]',
	    weakMapTag = '[object WeakMap]';

	var dataViewTag = '[object DataView]';

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView),
	    mapCtorString = toSource(Map),
	    promiseCtorString = toSource(Promise),
	    setCtorString = toSource(Set),
	    weakMapCtorString = toSource(WeakMap);

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = baseGetTag;

	// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
	    (Map && getTag(new Map) != mapTag) ||
	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
	    (Set && getTag(new Set) != setTag) ||
	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
	  getTag = function(value) {
	    var result = baseGetTag(value),
	        Ctor = result == objectTag ? value.constructor : undefined,
	        ctorString = Ctor ? toSource(Ctor) : '';

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag;
	        case mapCtorString: return mapTag;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag;
	        case weakMapCtorString: return weakMapTag;
	      }
	    }
	    return result;
	  };
	}

	_getTag = getTag;
	return _getTag;
}

export { require_getTag as __require };
//# sourceMappingURL=_getTag.js.map
