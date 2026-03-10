import { __require as require_baseKeys } from './_baseKeys.js';
import { __require as require_getTag } from './_getTag.js';
import { __require as requireIsArrayLike } from './isArrayLike.js';
import { __require as requireIsString } from './isString.js';
import { __require as require_stringSize } from './_stringSize.js';

var size_1;
var hasRequiredSize;

function requireSize () {
	if (hasRequiredSize) return size_1;
	hasRequiredSize = 1;
	var baseKeys = require_baseKeys(),
	    getTag = require_getTag(),
	    isArrayLike = requireIsArrayLike(),
	    isString = requireIsString(),
	    stringSize = require_stringSize();

	/** `Object#toString` result references. */
	var mapTag = '[object Map]',
	    setTag = '[object Set]';

	/**
	 * Gets the size of `collection` by returning its length for array-like
	 * values or the number of own enumerable string keyed properties for objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object|string} collection The collection to inspect.
	 * @returns {number} Returns the collection size.
	 * @example
	 *
	 * _.size([1, 2, 3]);
	 * // => 3
	 *
	 * _.size({ 'a': 1, 'b': 2 });
	 * // => 2
	 *
	 * _.size('pebbles');
	 * // => 7
	 */
	function size(collection) {
	  if (collection == null) {
	    return 0;
	  }
	  if (isArrayLike(collection)) {
	    return isString(collection) ? stringSize(collection) : collection.length;
	  }
	  var tag = getTag(collection);
	  if (tag == mapTag || tag == setTag) {
	    return collection.size;
	  }
	  return baseKeys(collection).length;
	}

	size_1 = size;
	return size_1;
}

export { requireSize as __require };
//# sourceMappingURL=size.js.map
