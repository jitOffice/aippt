import { __require as require_arrayEach } from './_arrayEach.js';
import { __require as require_baseCreate } from './_baseCreate.js';
import { __require as require_baseForOwn } from './_baseForOwn.js';
import { __require as require_baseIteratee } from './_baseIteratee.js';
import { __require as require_getPrototype } from './_getPrototype.js';
import { __require as requireIsArray } from './isArray.js';
import { __require as requireIsBuffer } from './isBuffer.js';
import { __require as requireIsFunction } from './isFunction.js';
import { __require as requireIsObject } from './isObject.js';
import { __require as requireIsTypedArray } from './isTypedArray.js';

var transform_1;
var hasRequiredTransform;

function requireTransform () {
	if (hasRequiredTransform) return transform_1;
	hasRequiredTransform = 1;
	var arrayEach = require_arrayEach(),
	    baseCreate = require_baseCreate(),
	    baseForOwn = require_baseForOwn(),
	    baseIteratee = require_baseIteratee(),
	    getPrototype = require_getPrototype(),
	    isArray = requireIsArray(),
	    isBuffer = requireIsBuffer(),
	    isFunction = requireIsFunction(),
	    isObject = requireIsObject(),
	    isTypedArray = requireIsTypedArray();

	/**
	 * An alternative to `_.reduce`; this method transforms `object` to a new
	 * `accumulator` object which is the result of running each of its own
	 * enumerable string keyed properties thru `iteratee`, with each invocation
	 * potentially mutating the `accumulator` object. If `accumulator` is not
	 * provided, a new object with the same `[[Prototype]]` will be used. The
	 * iteratee is invoked with four arguments: (accumulator, value, key, object).
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.3.0
	 * @category Object
	 * @param {Object} object The object to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @param {*} [accumulator] The custom accumulator value.
	 * @returns {*} Returns the accumulated value.
	 * @example
	 *
	 * _.transform([2, 3, 4], function(result, n) {
	 *   result.push(n *= n);
	 *   return n % 2 == 0;
	 * }, []);
	 * // => [4, 9]
	 *
	 * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
	 *   (result[value] || (result[value] = [])).push(key);
	 * }, {});
	 * // => { '1': ['a', 'c'], '2': ['b'] }
	 */
	function transform(object, iteratee, accumulator) {
	  var isArr = isArray(object),
	      isArrLike = isArr || isBuffer(object) || isTypedArray(object);

	  iteratee = baseIteratee(iteratee, 4);
	  if (accumulator == null) {
	    var Ctor = object && object.constructor;
	    if (isArrLike) {
	      accumulator = isArr ? new Ctor : [];
	    }
	    else if (isObject(object)) {
	      accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
	    }
	    else {
	      accumulator = {};
	    }
	  }
	  (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
	    return iteratee(accumulator, value, index, object);
	  });
	  return accumulator;
	}

	transform_1 = transform;
	return transform_1;
}

export { requireTransform as __require };
//# sourceMappingURL=transform.js.map
