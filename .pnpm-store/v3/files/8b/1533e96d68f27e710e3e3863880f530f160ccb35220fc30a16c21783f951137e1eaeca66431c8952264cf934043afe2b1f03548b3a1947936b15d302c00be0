import { __require as requireLodash } from '../lodash.js';
import { __require as requireTarjan } from './tarjan.js';

var findCycles_1;
var hasRequiredFindCycles;

function requireFindCycles () {
	if (hasRequiredFindCycles) return findCycles_1;
	hasRequiredFindCycles = 1;
	var _ = requireLodash();
	var tarjan = requireTarjan();

	findCycles_1 = findCycles;

	function findCycles(g) {
	  return _.filter(tarjan(g), function(cmpt) {
	    return cmpt.length > 1 || (cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]));
	  });
	}
	return findCycles_1;
}

export { requireFindCycles as __require };
//# sourceMappingURL=find-cycles.js.map
