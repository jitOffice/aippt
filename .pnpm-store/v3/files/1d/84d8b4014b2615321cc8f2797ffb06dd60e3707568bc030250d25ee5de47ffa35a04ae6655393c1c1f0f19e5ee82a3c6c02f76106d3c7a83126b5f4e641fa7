import { __require as require_MapCache } from './_MapCache.js';
import { __require as require_setCacheAdd } from './_setCacheAdd.js';
import { __require as require_setCacheHas } from './_setCacheHas.js';

var _SetCache;
var hasRequired_SetCache;

function require_SetCache () {
	if (hasRequired_SetCache) return _SetCache;
	hasRequired_SetCache = 1;
	var MapCache = require_MapCache(),
	    setCacheAdd = require_setCacheAdd(),
	    setCacheHas = require_setCacheHas();

	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values == null ? 0 : values.length;

	  this.__data__ = new MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}

	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;

	_SetCache = SetCache;
	return _SetCache;
}

export { require_SetCache as __require };
//# sourceMappingURL=_SetCache.js.map
