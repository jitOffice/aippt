"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeToElements = nodeToElements;
exports.nodeToRenderableNodes = nodeToRenderableNodes;
const is_fragment_1 = require("./is-fragment");
const is_jsx_element_1 = require("./is-jsx-element");
function nodeToElements(node) {
    return nodeToRenderableNodes(node).filter(is_jsx_element_1.isJSXElement);
}
function nodeToRenderableNodes(node, result = []) {
    var _a;
    if (!node || typeof node === 'boolean') {
        return result;
    }
    if (Array.isArray(node)) {
        node.forEach((child) => nodeToRenderableNodes(child, result));
    }
    else {
        if ((0, is_fragment_1.isFragment)(node)) {
            const children = (_a = node.props) === null || _a === void 0 ? void 0 : _a.children;
            (Array.isArray(children) ? children : [children])
                .filter(Boolean)
                .forEach((child) => {
                nodeToRenderableNodes(child, result);
            });
        }
        else if (typeof node === 'object')
            result.push(node);
        else
            result.push(node);
    }
    return result;
}
