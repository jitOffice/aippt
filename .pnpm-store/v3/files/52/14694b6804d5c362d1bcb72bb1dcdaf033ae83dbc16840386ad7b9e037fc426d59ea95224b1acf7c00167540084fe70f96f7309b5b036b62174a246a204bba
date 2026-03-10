import { __require as requireLodash } from '../lodash.js';

var topsort_1;
var hasRequiredTopsort;

function requireTopsort () {
	if (hasRequiredTopsort) return topsort_1;
	hasRequiredTopsort = 1;
	var _ = requireLodash();

	topsort_1 = topsort;
	topsort.CycleException = CycleException;

	function topsort(g) {
	  var visited = {};
	  var stack = {};
	  var results = [];

	  function visit(node) {
	    if (_.has(stack, node)) {
	      throw new CycleException();
	    }

	    if (!_.has(visited, node)) {
	      stack[node] = true;
	      visited[node] = true;
	      _.each(g.predecessors(node), visit);
	      delete stack[node];
	      results.push(node);
	    }
	  }

	  _.each(g.sinks(), visit);

	  if (_.size(visited) !== g.nodeCount()) {
	    throw new CycleException();
	  }

	  return results;
	}

	function CycleException() {}
	CycleException.prototype = new Error(); // must be an instance of Error to pass testing
	return topsort_1;
}

export { requireTopsort as __require };
//# sourceMappingURL=topsort.js.map
