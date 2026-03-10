import Half from './half.js';

function tree_visit$1(callback) {
  var halves = [], q, node = this._root, child, x0, x1;
  if (node) halves.push(new Half(node, this._x0, this._x1));
  while (q = halves.pop()) {
    if (!callback(node = q.node, x0 = q.x0, x1 = q.x1) && node.length) {
      var xm = (x0 + x1) / 2;
      if (child = node[1]) halves.push(new Half(child, xm, x1));
      if (child = node[0]) halves.push(new Half(child, x0, xm));
    }
  }
  return this;
}

export { tree_visit$1 as default };
//# sourceMappingURL=visit.js.map
