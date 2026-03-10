import { __require as requireUtil } from './util.js';
import { __require as requireFeasibleTree } from './feasible-tree.js';
import { __require as requireNetworkSimplex } from './network-simplex.js';

var rank_1;
var hasRequiredRank;

function requireRank () {
	if (hasRequiredRank) return rank_1;
	hasRequiredRank = 1;

	var rankUtil = requireUtil();
	var longestPath = rankUtil.longestPath;
	var feasibleTree = requireFeasibleTree();
	var networkSimplex = requireNetworkSimplex();

	rank_1 = rank;

	/*
	 * Assigns a rank to each node in the input graph that respects the "minlen"
	 * constraint specified on edges between nodes.
	 *
	 * This basic structure is derived from Gansner, et al., "A Technique for
	 * Drawing Directed Graphs."
	 *
	 * Pre-conditions:
	 *
	 *    1. Graph must be a connected DAG
	 *    2. Graph nodes must be objects
	 *    3. Graph edges must have "weight" and "minlen" attributes
	 *
	 * Post-conditions:
	 *
	 *    1. Graph nodes will have a "rank" attribute based on the results of the
	 *       algorithm. Ranks can start at any index (including negative), we'll
	 *       fix them up later.
	 */
	function rank(g) {
	  switch(g.graph().ranker) {
	  case "network-simplex": networkSimplexRanker(g); break;
	  case "tight-tree": tightTreeRanker(g); break;
	  case "longest-path": longestPathRanker(g); break;
	  default: networkSimplexRanker(g);
	  }
	}

	// A fast and simple ranker, but results are far from optimal.
	var longestPathRanker = longestPath;

	function tightTreeRanker(g) {
	  longestPath(g);
	  feasibleTree(g);
	}

	function networkSimplexRanker(g) {
	  networkSimplex(g);
	}
	return rank_1;
}

export { requireRank as __require };
//# sourceMappingURL=index.js.map
