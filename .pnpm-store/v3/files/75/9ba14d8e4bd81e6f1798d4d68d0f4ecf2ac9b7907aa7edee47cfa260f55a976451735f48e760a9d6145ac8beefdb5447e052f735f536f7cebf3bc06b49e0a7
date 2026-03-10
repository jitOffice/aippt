import { __require as require_castPath } from './_castPath.js';
import { __require as require_toKey } from './_toKey.js';

var _baseGet;
var hasRequired_baseGet;

function require_baseGet () {
	if (hasRequired_baseGet) return _baseGet;
	hasRequired_baseGet = 1;
	var castPath = require_castPath(),
	    toKey = require_toKey();

	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = castPath(path, object);

	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}

	_baseGet = baseGet;
	return _baseGet;
}

export { require_baseGet as __require };
//# sourceMappingURL=_baseGet.js.map
