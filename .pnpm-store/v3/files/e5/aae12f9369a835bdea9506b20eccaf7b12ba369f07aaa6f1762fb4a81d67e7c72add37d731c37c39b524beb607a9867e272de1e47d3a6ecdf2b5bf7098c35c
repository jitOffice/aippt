import { __require as requireGraph } from './graph.js';
import { __require as requireVersion } from './version.js';

var lib;
var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib;
	hasRequiredLib = 1;
	// Includes only the "core" of graphlib
	lib = {
	  Graph: requireGraph(),
	  version: requireVersion()
	};
	return lib;
}

export { requireLib as __require };
//# sourceMappingURL=index.js.map
