"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addPolygraphToGitIgnore;
const ignore_1 = require("../../utils/ignore");
function addPolygraphToGitIgnore(tree) {
    if (!tree.exists('.gitignore')) {
        return;
    }
    // Lerna users that don't use nx.json may not expect .nx directory changes
    if (tree.exists('lerna.json') && !tree.exists('nx.json')) {
        return;
    }
    (0, ignore_1.addEntryToGitIgnore)(tree, '.gitignore', '.nx/polygraph');
}
