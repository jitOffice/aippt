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
import tree_y, { defaultY } from './y.js';

function quadtree(nodes, x, y) {
  var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
  return nodes == null ? tree : tree.addAll(nodes);
}

function Quadtree(x, y, x0, y0, x1, y1) {
  this._x = x;
  this._y = y;
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  this._root = undefined;
}

function leaf_copy$2(leaf) {
  var copy = {data: leaf.data}, next = copy;
  while (leaf = leaf.next) next = next.next = {data: leaf.data};
  return copy;
}

var treeProto$2 = quadtree.prototype = Quadtree.prototype;

treeProto$2.copy = function() {
  var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
      node = this._root,
      nodes,
      child;

  if (!node) return copy;

  if (!node.length) return copy._root = leaf_copy$2(node), copy;

  nodes = [{source: node, target: copy._root = new Array(4)}];
  while (node = nodes.pop()) {
    for (var i = 0; i < 4; ++i) {
      if (child = node.source[i]) {
        if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
        else node.target[i] = leaf_copy$2(child);
      }
    }
  }

  return copy;
};

treeProto$2.add = tree_add;
treeProto$2.addAll = addAll;
treeProto$2.cover = tree_cover;
treeProto$2.data = tree_data;
treeProto$2.extent = tree_extent;
treeProto$2.find = tree_find;
treeProto$2.remove = tree_remove;
treeProto$2.removeAll = removeAll;
treeProto$2.root = tree_root;
treeProto$2.size = tree_size;
treeProto$2.visit = tree_visit;
treeProto$2.visitAfter = tree_visitAfter;
treeProto$2.x = tree_x;
treeProto$2.y = tree_y;

export { quadtree as default };
//# sourceMappingURL=quadtree.js.map
