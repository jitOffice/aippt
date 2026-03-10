import { __require as requireLodash } from '../lodash.js';
import { __require as requireBarycenter } from './barycenter.js';
import { __require as requireResolveConflicts } from './resolve-conflicts.js';
import { __require as requireSort } from './sort.js';

var sortSubgraph_1;
var hasRequiredSortSubgraph;

function requireSortSubgraph () {
	if (hasRequiredSortSubgraph) return sortSubgraph_1;
	hasRequiredSortSubgraph = 1;
	var _ = requireLodash();
	var barycenter = requireBarycenter();
	var resolveConflicts = requireResolveConflicts();
	var sort = requireSort();

	sortSubgraph_1 = sortSubgraph;

	function sortSubgraph(g, v, cg, biasRight) {
	  var movable = g.children(v);
	  var node = g.node(v);
	  var bl = node ? node.borderLeft : undefined;
	  var br = node ? node.borderRight: undefined;
	  var subgraphs = {};

	  if (bl) {
	    movable = _.filter(movable, function(w) {
	      return w !== bl && w !== br;
	    });
	  }

	  var barycenters = barycenter(g, movable);
	  _.forEach(barycenters, function(entry) {
	    if (g.children(entry.v).length) {
	      var subgraphResult = sortSubgraph(g, entry.v, cg, biasRight);
	      subgraphs[entry.v] = subgraphResult;
	      if (_.has(subgraphResult, "barycenter")) {
	        mergeBarycenters(entry, subgraphResult);
	      }
	    }
	  });

	  var entries = resolveConflicts(barycenters, cg);
	  expandSubgraphs(entries, subgraphs);

	  var result = sort(entries, biasRight);

	  if (bl) {
	    result.vs = _.flatten([bl, result.vs, br], true);
	    if (g.predecessors(bl).length) {
	      var blPred = g.node(g.predecessors(bl)[0]),
	        brPred = g.node(g.predecessors(br)[0]);
	      if (!_.has(result, "barycenter")) {
	        result.barycenter = 0;
	        result.weight = 0;
	      }
	      result.barycenter = (result.barycenter * result.weight +
	                           blPred.order + brPred.order) / (result.weight + 2);
	      result.weight += 2;
	    }
	  }

	  return result;
	}

	function expandSubgraphs(entries, subgraphs) {
	  _.forEach(entries, function(entry) {
	    entry.vs = _.flatten(entry.vs.map(function(v) {
	      if (subgraphs[v]) {
	        return subgraphs[v].vs;
	      }
	      return v;
	    }), true);
	  });
	}

	function mergeBarycenters(target, other) {
	  if (!_.isUndefined(target.barycenter)) {
	    target.barycenter = (target.barycenter * target.weight +
	                         other.barycenter * other.weight) /
	                        (target.weight + other.weight);
	    target.weight += other.weight;
	  } else {
	    target.barycenter = other.barycenter;
	    target.weight = other.weight;
	  }
	}
	return sortSubgraph_1;
}

export { requireSortSubgraph as __require };
//# sourceMappingURL=sort-subgraph.js.map
