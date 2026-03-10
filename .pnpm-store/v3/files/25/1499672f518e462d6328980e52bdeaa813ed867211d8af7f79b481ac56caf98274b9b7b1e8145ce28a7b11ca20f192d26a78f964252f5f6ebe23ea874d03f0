import { __require as requireLodash } from '../lodash.js';

var dfs_1;
var hasRequiredDfs;

function requireDfs () {
	if (hasRequiredDfs) return dfs_1;
	hasRequiredDfs = 1;
	var _ = requireLodash();

	dfs_1 = dfs;

	/*
	 * A helper that preforms a pre- or post-order traversal on the input graph
	 * and returns the nodes in the order they were visited. If the graph is
	 * undirected then this algorithm will navigate using neighbors. If the graph
	 * is directed then this algorithm will navigate using successors.
	 *
	 * Order must be one of "pre" or "post".
	 */
	function dfs(g, vs, order) {
	  if (!_.isArray(vs)) {
	    vs = [vs];
	  }

	  var navigation = (g.isDirected() ? g.successors : g.neighbors).bind(g);

	  var acc = [];
	  var visited = {};
	  _.each(vs, function(v) {
	    if (!g.hasNode(v)) {
	      throw new Error("Graph does not have node: " + v);
	    }

	    doDfs(g, v, order === "post", visited, navigation, acc);
	  });
	  return acc;
	}

	function doDfs(g, v, postorder, visited, navigation, acc) {
	  if (!_.has(visited, v)) {
	    visited[v] = true;

	    if (!postorder) { acc.push(v); }
	    _.each(navigation(v), function(w) {
	      doDfs(g, w, postorder, visited, navigation, acc);
	    });
	    if (postorder) { acc.push(v); }
	  }
	}
	return dfs_1;
}

export { requireDfs as __require };
//# sourceMappingURL=dfs.js.map
