import { isFragment } from './is-fragment.js';
import { isJSXElement } from './is-jsx-element.js';
export function nodeToElements(node) {
    return nodeToRenderableNodes(node).filter(isJSXElement);
}
export function nodeToRenderableNodes(node, result = []) {
    var _a;
    if (!node || typeof node === 'boolean') {
        return result;
    }
    if (Array.isArray(node)) {
        node.forEach((child) => nodeToRenderableNodes(child, result));
    }
    else {
        if (isFragment(node)) {
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
