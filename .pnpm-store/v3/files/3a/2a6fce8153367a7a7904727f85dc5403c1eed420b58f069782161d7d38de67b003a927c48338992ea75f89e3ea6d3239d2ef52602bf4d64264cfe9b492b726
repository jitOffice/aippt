import { __require as requireDijkstra } from './dijkstra.js';
import { __require as requireLodash } from '../lodash.js';

var dijkstraAll_1;
var hasRequiredDijkstraAll;

function requireDijkstraAll () {
	if (hasRequiredDijkstraAll) return dijkstraAll_1;
	hasRequiredDijkstraAll = 1;
	var dijkstra = requireDijkstra();
	var _ = requireLodash();

	dijkstraAll_1 = dijkstraAll;

	function dijkstraAll(g, weightFunc, edgeFunc) {
	  return _.transform(g.nodes(), function(acc, v) {
	    acc[v] = dijkstra(g, v, weightFunc, edgeFunc);
	  }, {});
	}
	return dijkstraAll_1;
}

export { requireDijkstraAll as __require };
//# sourceMappingURL=dijkstra-all.js.map
