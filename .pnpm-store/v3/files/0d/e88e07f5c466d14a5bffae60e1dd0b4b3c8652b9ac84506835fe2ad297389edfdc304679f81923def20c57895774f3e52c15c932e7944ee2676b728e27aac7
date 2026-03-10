/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */

var _matchesStrictComparable;
var hasRequired_matchesStrictComparable;

function require_matchesStrictComparable () {
	if (hasRequired_matchesStrictComparable) return _matchesStrictComparable;
	hasRequired_matchesStrictComparable = 1;
	function matchesStrictComparable(key, srcValue) {
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    return object[key] === srcValue &&
	      (srcValue !== undefined || (key in Object(object)));
	  };
	}

	_matchesStrictComparable = matchesStrictComparable;
	return _matchesStrictComparable;
}

export { require_matchesStrictComparable as __require };
//# sourceMappingURL=_matchesStrictComparable.js.map
