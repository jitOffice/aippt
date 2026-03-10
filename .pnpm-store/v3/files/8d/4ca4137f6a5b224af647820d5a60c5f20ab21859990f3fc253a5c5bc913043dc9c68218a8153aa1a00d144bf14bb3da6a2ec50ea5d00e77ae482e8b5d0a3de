import { __require as require_hashClear } from './_hashClear.js';
import { __require as require_hashDelete } from './_hashDelete.js';
import { __require as require_hashGet } from './_hashGet.js';
import { __require as require_hashHas } from './_hashHas.js';
import { __require as require_hashSet } from './_hashSet.js';

var _Hash;
var hasRequired_Hash;

function require_Hash () {
	if (hasRequired_Hash) return _Hash;
	hasRequired_Hash = 1;
	var hashClear = require_hashClear(),
	    hashDelete = require_hashDelete(),
	    hashGet = require_hashGet(),
	    hashHas = require_hashHas(),
	    hashSet = require_hashSet();

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;

	_Hash = Hash;
	return _Hash;
}

export { require_Hash as __require };
//# sourceMappingURL=_Hash.js.map
