import { __module as _cloneBuffer } from '../../_virtual/_cloneBuffer.js';
import { __require as require_root } from './_root.js';

_cloneBuffer.exports;

var hasRequired_cloneBuffer;

function require_cloneBuffer () {
	if (hasRequired_cloneBuffer) return _cloneBuffer.exports;
	hasRequired_cloneBuffer = 1;
	(function (module, exports$1) {
		var root = require_root();

		/** Detect free variable `exports`. */
		var freeExports = exports$1 && !exports$1.nodeType && exports$1;

		/** Detect free variable `module`. */
		var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

		/** Detect the popular CommonJS extension `module.exports`. */
		var moduleExports = freeModule && freeModule.exports === freeExports;

		/** Built-in value references. */
		var Buffer = moduleExports ? root.Buffer : undefined,
		    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

		/**
		 * Creates a clone of  `buffer`.
		 *
		 * @private
		 * @param {Buffer} buffer The buffer to clone.
		 * @param {boolean} [isDeep] Specify a deep clone.
		 * @returns {Buffer} Returns the cloned buffer.
		 */
		function cloneBuffer(buffer, isDeep) {
		  if (isDeep) {
		    return buffer.slice();
		  }
		  var length = buffer.length,
		      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

		  buffer.copy(result);
		  return result;
		}

		module.exports = cloneBuffer; 
	} (_cloneBuffer, _cloneBuffer.exports));
	return _cloneBuffer.exports;
}

export { require_cloneBuffer as __require };
//# sourceMappingURL=_cloneBuffer.js.map
