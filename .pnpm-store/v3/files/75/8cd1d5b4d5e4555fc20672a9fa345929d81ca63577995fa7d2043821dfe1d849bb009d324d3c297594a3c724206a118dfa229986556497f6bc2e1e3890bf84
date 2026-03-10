import tree_add, { addAll } from './add.js';
import tree_cover from './cover.js';
import tree_data from './data.js';
import tree_extent from './extent.js';
import tree_find from './find.js';
import tree_remove, { removeAll } from './remove.js';
import tree_root from './root.js';
import tree_size from './size.js';
import tree_visit from './visit.js';
import tree_visitAfter from './visitAfter.js';
import tree_x, { defaultX } from './x.js';

function binarytree(nodes, x) {
  var tree = new Binarytree(x == null ? defaultX : x, NaN, NaN);
  return nodes == null ? tree : tree.addAll(nodes);
}

function Binarytree(x, x0, x1) {
  this._x = x;
  this._x0 = x0;
  this._x1 = x1;
  this._root = undefined;
}

function leaf_copy$1(leaf) {
  var copy = {data: leaf.data}, next = copy;
  while (leaf = leaf.next) next = next.next = {data: leaf.data};
  return copy;
}

var treeProto$1 = binarytree.prototype = Binarytree.prototype;

treeProto$1.copy = function() {
  var copy = new Binarytree(this._x, this._x0, this._x1),
      node = this._root,
      nodes,
      child;

  if (!node) return copy;

  if (!node.length) return copy._root = leaf_copy$1(node), copy;

  nodes = [{source: node, target: copy._root = new Array(2)}];
  while (node = nodes.pop()) {
    for (var i = 0; i < 2; ++i) {
      if (child = node.source[i]) {
        if (child.length) nodes.push({source: child, target: node.target[i] = new Array(2)});
        else node.target[i] = leaf_copy$1(child);
      }
    }
  }

  return copy;
};

treeProto$1.add = tree_add;
treeProto$1.addAll = addAll;
treeProto$1.cover = tree_cover;
treeProto$1.data = tree_data;
treeProto$1.extent = tree_extent;
treeProto$1.find = tree_find;
treeProto$1.remove = tree_remove;
treeProto$1.removeAll = removeAll;
treeProto$1.root = tree_root;
treeProto$1.size = tree_size;
treeProto$1.visit = tree_visit;
treeProto$1.visitAfter = tree_visitAfter;
treeProto$1.x = tree_x;

export { binarytree as default };
//# sourceMappingURL=binarytree.js.map
