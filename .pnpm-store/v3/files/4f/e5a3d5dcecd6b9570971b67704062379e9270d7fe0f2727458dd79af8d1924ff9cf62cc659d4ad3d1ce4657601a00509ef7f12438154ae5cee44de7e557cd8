import { __require as require_baseRest } from './_baseRest.js';
import { __require as require_isIterateeCall } from './_isIterateeCall.js';

var _createAssigner;
var hasRequired_createAssigner;

function require_createAssigner () {
	if (hasRequired_createAssigner) return _createAssigner;
	hasRequired_createAssigner = 1;
	var baseRest = require_baseRest(),
	    isIterateeCall = require_isIterateeCall();

	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return baseRest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;

	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;

	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}

	_createAssigner = createAssigner;
	return _createAssigner;
}

export { require_createAssigner as __require };
//# sourceMappingURL=_createAssigner.js.map
