import { __require as requireLodash } from './lodash.js';
import { __require as requireUtil } from './util.js';

var addBorderSegments_1;
var hasRequiredAddBorderSegments;

function requireAddBorderSegments () {
	if (hasRequiredAddBorderSegments) return addBorderSegments_1;
	hasRequiredAddBorderSegments = 1;
	var _ = requireLodash();
	var util = requireUtil();

	addBorderSegments_1 = addBorderSegments;

	function addBorderSegments(g) {
	  function dfs(v) {
	    var children = g.children(v);
	    var node = g.node(v);
	    if (children.length) {
	      _.forEach(children, dfs);
	    }

	    if (_.has(node, "minRank")) {
	      node.borderLeft = [];
	      node.borderRight = [];
	      for (var rank = node.minRank, maxRank = node.maxRank + 1;
	        rank < maxRank;
	        ++rank) {
	        addBorderNode(g, "borderLeft", "_bl", v, node, rank);
	        addBorderNode(g, "borderRight", "_br", v, node, rank);
	      }
	    }
	  }

	  _.forEach(g.children(), dfs);
	}

	function addBorderNode(g, prop, prefix, sg, sgNode, rank) {
	  var label = { width: 0, height: 0, rank: rank, borderType: prop };
	  var prev = sgNode[prop][rank - 1];
	  var curr = util.addDummyNode(g, "border", label, prefix);
	  sgNode[prop][rank] = curr;
	  g.setParent(curr, sg);
	  if (prev) {
	    g.setEdge(prev, curr, { weight: 1 });
	  }
	}
	return addBorderSegments_1;
}

export { requireAddBorderSegments as __require };
//# sourceMappingURL=add-border-segments.js.map
