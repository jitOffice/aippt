import { __require as requireComponents } from './components.js';
import { __require as requireDijkstra } from './dijkstra.js';
import { __require as requireDijkstraAll } from './dijkstra-all.js';
import { __require as requireFindCycles } from './find-cycles.js';
import { __require as requireFloydWarshall } from './floyd-warshall.js';
import { __require as requireIsAcyclic } from './is-acyclic.js';
import { __require as requirePostorder } from './postorder.js';
import { __require as requirePreorder } from './preorder.js';
import { __require as requirePrim } from './prim.js';
import { __require as requireTarjan } from './tarjan.js';
import { __require as requireTopsort } from './topsort.js';

var alg;
var hasRequiredAlg;

function requireAlg () {
	if (hasRequiredAlg) return alg;
	hasRequiredAlg = 1;
	alg = {
	  components: requireComponents(),
	  dijkstra: requireDijkstra(),
	  dijkstraAll: requireDijkstraAll(),
	  findCycles: requireFindCycles(),
	  floydWarshall: requireFloydWarshall(),
	  isAcyclic: requireIsAcyclic(),
	  postorder: requirePostorder(),
	  preorder: requirePreorder(),
	  prim: requirePrim(),
	  tarjan: requireTarjan(),
	  topsort: requireTopsort()
	};
	return alg;
}

export { requireAlg as __require };
//# sourceMappingURL=index.js.map
