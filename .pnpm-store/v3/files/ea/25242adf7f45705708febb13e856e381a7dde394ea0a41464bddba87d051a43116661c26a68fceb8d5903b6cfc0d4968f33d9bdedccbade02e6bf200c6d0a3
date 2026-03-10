import { __require as requireTopsort } from './topsort.js';

var isAcyclic_1;
var hasRequiredIsAcyclic;

function requireIsAcyclic () {
	if (hasRequiredIsAcyclic) return isAcyclic_1;
	hasRequiredIsAcyclic = 1;
	var topsort = requireTopsort();

	isAcyclic_1 = isAcyclic;

	function isAcyclic(g) {
	  try {
	    topsort(g);
	  } catch (e) {
	    if (e instanceof topsort.CycleException) {
	      return false;
	    }
	    throw e;
	  }
	  return true;
	}
	return isAcyclic_1;
}

export { requireIsAcyclic as __require };
//# sourceMappingURL=is-acyclic.js.map
