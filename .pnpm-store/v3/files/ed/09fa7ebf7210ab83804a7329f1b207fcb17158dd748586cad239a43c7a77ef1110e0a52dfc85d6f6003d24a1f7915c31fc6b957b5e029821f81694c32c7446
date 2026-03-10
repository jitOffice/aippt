import { __require as require_assocIndexOf } from './_assocIndexOf.js';

var _listCacheSet;
var hasRequired_listCacheSet;

function require_listCacheSet () {
	if (hasRequired_listCacheSet) return _listCacheSet;
	hasRequired_listCacheSet = 1;
	var assocIndexOf = require_assocIndexOf();

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	_listCacheSet = listCacheSet;
	return _listCacheSet;
}

export { require_listCacheSet as __require };
//# sourceMappingURL=_listCacheSet.js.map
