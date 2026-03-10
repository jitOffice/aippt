import { commonjsRequire } from '../../../_virtual/_commonjs-dynamic-modules.js';
import { __require as requireGraphlib$1 } from '../../graphlib/index.js';

/* global window */

var graphlib_1;
var hasRequiredGraphlib;

function requireGraphlib () {
	if (hasRequiredGraphlib) return graphlib_1;
	hasRequiredGraphlib = 1;
	var graphlib;

	if (typeof commonjsRequire === "function") {
	  try {
	    graphlib = requireGraphlib$1();
	  } catch (e) {
	    // continue regardless of error
	  }
	}

	if (!graphlib) {
	  graphlib = window.graphlib;
	}

	graphlib_1 = graphlib;
	return graphlib_1;
}

export { requireGraphlib as __require };
//# sourceMappingURL=graphlib.js.map
