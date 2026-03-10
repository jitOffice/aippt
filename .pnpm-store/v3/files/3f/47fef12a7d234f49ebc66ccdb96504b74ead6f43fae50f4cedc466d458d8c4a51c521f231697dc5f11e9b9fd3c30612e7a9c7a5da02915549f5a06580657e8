import { __require as requireLodash } from '../lodash.js';
import { __require as requireUtil } from '../util.js';
import { __require as requireBk } from './bk.js';

var position_1;
var hasRequiredPosition;

function requirePosition () {
	if (hasRequiredPosition) return position_1;
	hasRequiredPosition = 1;

	var _ = requireLodash();
	var util = requireUtil();
	var positionX = requireBk().positionX;

	position_1 = position;

	function position(g) {
	  g = util.asNonCompoundGraph(g);

	  positionY(g);
	  _.forEach(positionX(g), function(x, v) {
	    g.node(v).x = x;
	  });
	}

	function positionY(g) {
	  var layering = util.buildLayerMatrix(g);
	  var rankSep = g.graph().ranksep;
	  var prevY = 0;
	  _.forEach(layering, function(layer) {
	    var maxHeight = _.max(_.map(layer, function(v) { return g.node(v).height; }));
	    _.forEach(layer, function(v) {
	      g.node(v).y = prevY + maxHeight / 2;
	    });
	    prevY += maxHeight + rankSep;
	  });
	}
	return position_1;
}

export { requirePosition as __require };
//# sourceMappingURL=index.js.map
