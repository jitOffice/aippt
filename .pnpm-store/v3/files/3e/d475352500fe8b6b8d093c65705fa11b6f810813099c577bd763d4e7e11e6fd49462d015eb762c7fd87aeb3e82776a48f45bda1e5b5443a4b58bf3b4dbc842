import { __require as require_baseClone } from './_baseClone.js';

var cloneDeep_1;
var hasRequiredCloneDeep;

function requireCloneDeep () {
	if (hasRequiredCloneDeep) return cloneDeep_1;
	hasRequiredCloneDeep = 1;
	var baseClone = require_baseClone();

	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG = 1,
	    CLONE_SYMBOLS_FLAG = 4;

	/**
	 * This method is like `_.clone` except that it recursively clones `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.0.0
	 * @category Lang
	 * @param {*} value The value to recursively clone.
	 * @returns {*} Returns the deep cloned value.
	 * @see _.clone
	 * @example
	 *
	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
	 *
	 * var deep = _.cloneDeep(objects);
	 * console.log(deep[0] === objects[0]);
	 * // => false
	 */
	function cloneDeep(value) {
	  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
	}

	cloneDeep_1 = cloneDeep;
	return cloneDeep_1;
}

export { requireCloneDeep as __require };
//# sourceMappingURL=cloneDeep.js.map
