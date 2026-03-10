import { __module as isBuffer } from '../../_virtual/isBuffer.js';
import { __require as require_root } from './_root.js';
import { __require as requireStubFalse } from './stubFalse.js';

isBuffer.exports;

var hasRequiredIsBuffer;

function requireIsBuffer () {
	if (hasRequiredIsBuffer) return isBuffer.exports;
	hasRequiredIsBuffer = 1;
	(function (module, exports$1) {
		var root = require_root(),
		    stubFalse = requireStubFalse();

		/** Detect free variable `exports`. */
		var freeExports = exports$1 && !exports$1.nodeType && exports$1;

		/** Detect free variable `module`. */
		var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

		/** Detect the popular CommonJS extension `module.exports`. */
		var moduleExports = freeModule && freeModule.exports === freeExports;

		/** Built-in value references. */
		var Buffer = moduleExports ? root.Buffer : undefined;

		/* Built-in method references for those with the same name as other `lodash` methods. */
		var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

		/**
		 * Checks if `value` is a buffer.
		 *
		 * @static
		 * @memberOf _
		 * @since 4.3.0
		 * @category Lang
		 * @param {*} value The value to check.
		 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
		 * @example
		 *
		 * _.isBuffer(new Buffer(2));
		 * // => true
		 *
		 * _.isBuffer(new Uint8Array(2));
		 * // => false
		 */
		var isBuffer = nativeIsBuffer || stubFalse;

		module.exports = isBuffer; 
	} (isBuffer, isBuffer.exports));
	return isBuffer.exports;
}

export { requireIsBuffer as __require };
//# sourceMappingURL=isBuffer.js.map
