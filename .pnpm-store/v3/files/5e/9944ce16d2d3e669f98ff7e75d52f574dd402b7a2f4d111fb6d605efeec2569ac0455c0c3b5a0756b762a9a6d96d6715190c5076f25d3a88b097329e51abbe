import { __require as require_nativeCreate } from './_nativeCreate.js';

var _hashClear;
var hasRequired_hashClear;

function require_hashClear () {
	if (hasRequired_hashClear) return _hashClear;
	hasRequired_hashClear = 1;
	var nativeCreate = require_nativeCreate();

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	  this.size = 0;
	}

	_hashClear = hashClear;
	return _hashClear;
}

export { require_hashClear as __require };
//# sourceMappingURL=_hashClear.js.map
