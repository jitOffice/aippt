/** Used to match `RegExp` flags from their coerced string values. */

var _cloneRegExp;
var hasRequired_cloneRegExp;

function require_cloneRegExp () {
	if (hasRequired_cloneRegExp) return _cloneRegExp;
	hasRequired_cloneRegExp = 1;
	var reFlags = /\w*$/;

	/**
	 * Creates a clone of `regexp`.
	 *
	 * @private
	 * @param {Object} regexp The regexp to clone.
	 * @returns {Object} Returns the cloned regexp.
	 */
	function cloneRegExp(regexp) {
	  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
	  result.lastIndex = regexp.lastIndex;
	  return result;
	}

	_cloneRegExp = cloneRegExp;
	return _cloneRegExp;
}

export { require_cloneRegExp as __require };
//# sourceMappingURL=_cloneRegExp.js.map
