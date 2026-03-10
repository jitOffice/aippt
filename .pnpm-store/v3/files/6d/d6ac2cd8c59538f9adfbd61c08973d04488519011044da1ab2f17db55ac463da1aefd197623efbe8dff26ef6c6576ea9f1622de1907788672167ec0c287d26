import { __require as require_cloneArrayBuffer } from './_cloneArrayBuffer.js';

var _cloneDataView;
var hasRequired_cloneDataView;

function require_cloneDataView () {
	if (hasRequired_cloneDataView) return _cloneDataView;
	hasRequired_cloneDataView = 1;
	var cloneArrayBuffer = require_cloneArrayBuffer();

	/**
	 * Creates a clone of `dataView`.
	 *
	 * @private
	 * @param {Object} dataView The data view to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned data view.
	 */
	function cloneDataView(dataView, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
	  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
	}

	_cloneDataView = cloneDataView;
	return _cloneDataView;
}

export { require_cloneDataView as __require };
//# sourceMappingURL=_cloneDataView.js.map
