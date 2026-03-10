import { __require as require_arrayMap } from './_arrayMap.js';

var _baseValues;
var hasRequired_baseValues;

function require_baseValues () {
	if (hasRequired_baseValues) return _baseValues;
	hasRequired_baseValues = 1;
	var arrayMap = require_arrayMap();

	/**
	 * The base implementation of `_.values` and `_.valuesIn` which creates an
	 * array of `object` property values corresponding to the property names
	 * of `props`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} props The property names to get values for.
	 * @returns {Object} Returns the array of property values.
	 */
	function baseValues(object, props) {
	  return arrayMap(props, function(key) {
	    return object[key];
	  });
	}

	_baseValues = baseValues;
	return _baseValues;
}

export { require_baseValues as __require };
//# sourceMappingURL=_baseValues.js.map
