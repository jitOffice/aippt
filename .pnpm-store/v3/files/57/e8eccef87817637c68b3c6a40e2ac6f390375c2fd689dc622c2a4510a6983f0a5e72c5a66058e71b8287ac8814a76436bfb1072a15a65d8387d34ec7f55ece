import { __require as requireDfs } from './dfs.js';

var preorder_1;
var hasRequiredPreorder;

function requirePreorder () {
	if (hasRequiredPreorder) return preorder_1;
	hasRequiredPreorder = 1;
	var dfs = requireDfs();

	preorder_1 = preorder;

	function preorder(g, vs) {
	  return dfs(g, vs, "pre");
	}
	return preorder_1;
}

export { requirePreorder as __require };
//# sourceMappingURL=preorder.js.map
