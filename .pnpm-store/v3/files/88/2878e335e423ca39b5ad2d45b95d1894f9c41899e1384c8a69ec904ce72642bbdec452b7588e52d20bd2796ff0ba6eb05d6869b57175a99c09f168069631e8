import { __require as requireDfs } from './dfs.js';

var postorder_1;
var hasRequiredPostorder;

function requirePostorder () {
	if (hasRequiredPostorder) return postorder_1;
	hasRequiredPostorder = 1;
	var dfs = requireDfs();

	postorder_1 = postorder;

	function postorder(g, vs) {
	  return dfs(g, vs, "post");
	}
	return postorder_1;
}

export { requirePostorder as __require };
//# sourceMappingURL=postorder.js.map
