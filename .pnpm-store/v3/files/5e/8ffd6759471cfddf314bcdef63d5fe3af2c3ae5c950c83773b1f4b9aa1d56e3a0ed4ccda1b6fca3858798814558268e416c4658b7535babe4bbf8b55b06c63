import { __require as requireLodash } from '../lodash.js';

var tarjan_1;
var hasRequiredTarjan;

function requireTarjan () {
	if (hasRequiredTarjan) return tarjan_1;
	hasRequiredTarjan = 1;
	var _ = requireLodash();

	tarjan_1 = tarjan;

	function tarjan(g) {
	  var index = 0;
	  var stack = [];
	  var visited = {}; // node id -> { onStack, lowlink, index }
	  var results = [];

	  function dfs(v) {
	    var entry = visited[v] = {
	      onStack: true,
	      lowlink: index,
	      index: index++
	    };
	    stack.push(v);

	    g.successors(v).forEach(function(w) {
	      if (!_.has(visited, w)) {
	        dfs(w);
	        entry.lowlink = Math.min(entry.lowlink, visited[w].lowlink);
	      } else if (visited[w].onStack) {
	        entry.lowlink = Math.min(entry.lowlink, visited[w].index);
	      }
	    });

	    if (entry.lowlink === entry.index) {
	      var cmpt = [];
	      var w;
	      do {
	        w = stack.pop();
	        visited[w].onStack = false;
	        cmpt.push(w);
	      } while (v !== w);
	      results.push(cmpt);
	    }
	  }

	  g.nodes().forEach(function(v) {
	    if (!_.has(visited, v)) {
	      dfs(v);
	    }
	  });

	  return results;
	}
	return tarjan_1;
}

export { requireTarjan as __require };
//# sourceMappingURL=tarjan.js.map
