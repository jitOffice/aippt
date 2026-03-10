import { __require as requireLodash } from '../lodash.js';

var components_1;
var hasRequiredComponents;

function requireComponents () {
	if (hasRequiredComponents) return components_1;
	hasRequiredComponents = 1;
	var _ = requireLodash();

	components_1 = components;

	function components(g) {
	  var visited = {};
	  var cmpts = [];
	  var cmpt;

	  function dfs(v) {
	    if (_.has(visited, v)) return;
	    visited[v] = true;
	    cmpt.push(v);
	    _.each(g.successors(v), dfs);
	    _.each(g.predecessors(v), dfs);
	  }

	  _.each(g.nodes(), function(v) {
	    cmpt = [];
	    dfs(v);
	    if (cmpt.length) {
	      cmpts.push(cmpt);
	    }
	  });

	  return cmpts;
	}
	return components_1;
}

export { requireComponents as __require };
//# sourceMappingURL=components.js.map
