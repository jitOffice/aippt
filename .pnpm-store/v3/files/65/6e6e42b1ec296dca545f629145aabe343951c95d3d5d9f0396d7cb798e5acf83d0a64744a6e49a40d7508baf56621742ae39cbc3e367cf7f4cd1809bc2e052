import { __require as requireToString } from './toString.js';

var uniqueId_1;
var hasRequiredUniqueId;

function requireUniqueId () {
	if (hasRequiredUniqueId) return uniqueId_1;
	hasRequiredUniqueId = 1;
	var toString = requireToString();

	/** Used to generate unique IDs. */
	var idCounter = 0;

	/**
	 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {string} [prefix=''] The value to prefix the ID with.
	 * @returns {string} Returns the unique ID.
	 * @example
	 *
	 * _.uniqueId('contact_');
	 * // => 'contact_104'
	 *
	 * _.uniqueId();
	 * // => '105'
	 */
	function uniqueId(prefix) {
	  var id = ++idCounter;
	  return toString(prefix) + id;
	}

	uniqueId_1 = uniqueId;
	return uniqueId_1;
}

export { requireUniqueId as __require };
//# sourceMappingURL=uniqueId.js.map
