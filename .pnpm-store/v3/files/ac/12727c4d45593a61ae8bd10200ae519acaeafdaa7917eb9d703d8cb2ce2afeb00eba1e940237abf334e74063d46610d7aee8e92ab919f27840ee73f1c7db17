import { __require as require_ListCache } from './_ListCache.js';
import { __require as require_stackClear } from './_stackClear.js';
import { __require as require_stackDelete } from './_stackDelete.js';
import { __require as require_stackGet } from './_stackGet.js';
import { __require as require_stackHas } from './_stackHas.js';
import { __require as require_stackSet } from './_stackSet.js';

var _Stack;
var hasRequired_Stack;

function require_Stack () {
	if (hasRequired_Stack) return _Stack;
	hasRequired_Stack = 1;
	var ListCache = require_ListCache(),
	    stackClear = require_stackClear(),
	    stackDelete = require_stackDelete(),
	    stackGet = require_stackGet(),
	    stackHas = require_stackHas(),
	    stackSet = require_stackSet();

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  var data = this.__data__ = new ListCache(entries);
	  this.size = data.size;
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = stackClear;
	Stack.prototype['delete'] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;

	_Stack = Stack;
	return _Stack;
}

export { require_Stack as __require };
//# sourceMappingURL=_Stack.js.map
