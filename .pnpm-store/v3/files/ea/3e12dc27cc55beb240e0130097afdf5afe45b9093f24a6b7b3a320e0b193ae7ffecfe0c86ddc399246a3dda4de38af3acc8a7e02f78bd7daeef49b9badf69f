import { __require as requireLodash } from '../lodash.js';
import { __require as requireInitOrder } from './init-order.js';
import { __require as requireCrossCount } from './cross-count.js';
import { __require as requireSortSubgraph } from './sort-subgraph.js';
import { __require as requireBuildLayerGraph } from './build-layer-graph.js';
import { __require as requireAddSubgraphConstraints } from './add-subgraph-constraints.js';
import { __require as requireGraphlib } from '../graphlib.js';
import { __require as requireUtil } from '../util.js';

var order_1;
var hasRequiredOrder;

function requireOrder () {
	if (hasRequiredOrder) return order_1;
	hasRequiredOrder = 1;

	var _ = requireLodash();
	var initOrder = requireInitOrder();
	var crossCount = requireCrossCount();
	var sortSubgraph = requireSortSubgraph();
	var buildLayerGraph = requireBuildLayerGraph();
	var addSubgraphConstraints = requireAddSubgraphConstraints();
	var Graph = requireGraphlib().Graph;
	var util = requireUtil();

	order_1 = order;

	/*
	 * Applies heuristics to minimize edge crossings in the graph and sets the best
	 * order solution as an order attribute on each node.
	 *
	 * Pre-conditions:
	 *
	 *    1. Graph must be DAG
	 *    2. Graph nodes must be objects with a "rank" attribute
	 *    3. Graph edges must have the "weight" attribute
	 *
	 * Post-conditions:
	 *
	 *    1. Graph nodes will have an "order" attribute based on the results of the
	 *       algorithm.
	 */
	function order(g) {
	  var maxRank = util.maxRank(g),
	    downLayerGraphs = buildLayerGraphs(g, _.range(1, maxRank + 1), "inEdges"),
	    upLayerGraphs = buildLayerGraphs(g, _.range(maxRank - 1, -1, -1), "outEdges");

	  var layering = initOrder(g);
	  assignOrder(g, layering);

	  var bestCC = Number.POSITIVE_INFINITY,
	    best;

	  for (var i = 0, lastBest = 0; lastBest < 4; ++i, ++lastBest) {
	    sweepLayerGraphs(i % 2 ? downLayerGraphs : upLayerGraphs, i % 4 >= 2);

	    layering = util.buildLayerMatrix(g);
	    var cc = crossCount(g, layering);
	    if (cc < bestCC) {
	      lastBest = 0;
	      best = _.cloneDeep(layering);
	      bestCC = cc;
	    }
	  }

	  assignOrder(g, best);
	}

	function buildLayerGraphs(g, ranks, relationship) {
	  return _.map(ranks, function(rank) {
	    return buildLayerGraph(g, rank, relationship);
	  });
	}

	function sweepLayerGraphs(layerGraphs, biasRight) {
	  var cg = new Graph();
	  _.forEach(layerGraphs, function(lg) {
	    var root = lg.graph().root;
	    var sorted = sortSubgraph(lg, root, cg, biasRight);
	    _.forEach(sorted.vs, function(v, i) {
	      lg.node(v).order = i;
	    });
	    addSubgraphConstraints(lg, cg, sorted.vs);
	  });
	}

	function assignOrder(g, layering) {
	  _.forEach(layering, function(layer) {
	    _.forEach(layer, function(v, i) {
	      g.node(v).order = i;
	    });
	  });
	}
	return order_1;
}

export { requireOrder as __require };
//# sourceMappingURL=index.js.map
