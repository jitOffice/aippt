import { __require as requireLodash } from '../lodash.js';

var barycenter_1;
var hasRequiredBarycenter;

function requireBarycenter () {
	if (hasRequiredBarycenter) return barycenter_1;
	hasRequiredBarycenter = 1;
	var _ = requireLodash();

	barycenter_1 = barycenter;

	function barycenter(g, movable) {
	  return _.map(movable, function(v) {
	    var inV = g.inEdges(v);
	    if (!inV.length) {
	      return { v: v };
	    } else {
	      var result = _.reduce(inV, function(acc, e) {
	        var edge = g.edge(e),
	          nodeU = g.node(e.v);
	        return {
	          sum: acc.sum + (edge.weight * nodeU.order),
	          weight: acc.weight + edge.weight
	        };
	      }, { sum: 0, weight: 0 });

	      return {
	        v: v,
	        barycenter: result.sum / result.weight,
	        weight: result.weight
	      };
	    }
	  });
	}
	return barycenter_1;
}

export { requireBarycenter as __require };
//# sourceMappingURL=barycenter.js.map
