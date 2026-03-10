"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFragment = isFragment;
const jsx_runtime_1 = require("../jsx-runtime");
function isFragment(node) {
    if (!node || typeof node !== 'object' || Array.isArray(node))
        return false;
    return node.type === jsx_runtime_1.Fragment;
}
