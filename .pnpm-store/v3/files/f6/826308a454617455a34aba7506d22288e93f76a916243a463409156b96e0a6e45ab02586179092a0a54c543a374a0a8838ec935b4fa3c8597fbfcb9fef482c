import { __require as require_baseRest } from './_baseRest.js';
import { __require as requireEq } from './eq.js';
import { __require as require_isIterateeCall } from './_isIterateeCall.js';
import { __require as requireKeysIn } from './keysIn.js';

var defaults_1;
var hasRequiredDefaults;

function requireDefaults () {
	if (hasRequiredDefaults) return defaults_1;
	hasRequiredDefaults = 1;
	var baseRest = require_baseRest(),
	    eq = requireEq(),
	    isIterateeCall = require_isIterateeCall(),
	    keysIn = requireKeysIn();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Assigns own and inherited enumerable string keyed properties of source
	 * objects to the destination object for all destination properties that
	 * resolve to `undefined`. Source objects are applied from left to right.
	 * Once a property is set, additional values of the same property are ignored.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @see _.defaultsDeep
	 * @example
	 *
	 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
	 * // => { 'a': 1, 'b': 2 }
	 */
	var defaults = baseRest(function(object, sources) {
	  object = Object(object);

	  var index = -1;
	  var length = sources.length;
	  var guard = length > 2 ? sources[2] : undefined;

	  if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	    length = 1;
	  }

	  while (++index < length) {
	    var source = sources[index];
	    var props = keysIn(source);
	    var propsIndex = -1;
	    var propsLength = props.length;

	    while (++propsIndex < propsLength) {
	      var key = props[propsIndex];
	      var value = object[key];

	      if (value === undefined ||
	          (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
	        object[key] = source[key];
	      }
	    }
	  }

	  return object;
	});

	defaults_1 = defaults;
	return defaults_1;
}

export { requireDefaults as __require };
//# sourceMappingURL=defaults.js.map
