import { __require as requireLodash } from '../lodash.js';
import { __require as requirePriorityQueue } from '../data/priority-queue.js';

var dijkstra_1;
var hasRequiredDijkstra;

function requireDijkstra () {
	if (hasRequiredDijkstra) return dijkstra_1;
	hasRequiredDijkstra = 1;
	var _ = requireLodash();
	var PriorityQueue = requirePriorityQueue();

	dijkstra_1 = dijkstra;

	var DEFAULT_WEIGHT_FUNC = _.constant(1);

	function dijkstra(g, source, weightFn, edgeFn) {
	  return runDijkstra(g, String(source),
	    weightFn || DEFAULT_WEIGHT_FUNC,
	    edgeFn || function(v) { return g.outEdges(v); });
	}

	function runDijkstra(g, source, weightFn, edgeFn) {
	  var results = {};
	  var pq = new PriorityQueue();
	  var v, vEntry;

	  var updateNeighbors = function(edge) {
	    var w = edge.v !== v ? edge.v : edge.w;
	    var wEntry = results[w];
	    var weight = weightFn(edge);
	    var distance = vEntry.distance + weight;

	    if (weight < 0) {
	      throw new Error("dijkstra does not allow negative edge weights. " +
	                      "Bad edge: " + edge + " Weight: " + weight);
	    }

	    if (distance < wEntry.distance) {
	      wEntry.distance = distance;
	      wEntry.predecessor = v;
	      pq.decrease(w, distance);
	    }
	  };

	  g.nodes().forEach(function(v) {
	    var distance = v === source ? 0 : Number.POSITIVE_INFINITY;
	    results[v] = { distance: distance };
	    pq.add(v, distance);
	  });

	  while (pq.size() > 0) {
	    v = pq.removeMin();
	    vEntry = results[v];
	    if (vEntry.distance === Number.POSITIVE_INFINITY) {
	      break;
	    }

	    edgeFn(v).forEach(updateNeighbors);
	  }

	  return results;
	}
	return dijkstra_1;
}

export { requireDijkstra as __require };
//# sourceMappingURL=dijkstra.js.map
