import { nodeToRenderableNodes } from './element.js';
export function getRenderableChildrenOf(element) {
    var _a;
    if (element === null ||
        element === undefined ||
        typeof element === 'boolean') {
        return [];
    }
    if (Array.isArray(element))
        return nodeToRenderableNodes(element);
    if (typeof element === 'object') {
        return nodeToRenderableNodes((_a = element.props) === null || _a === void 0 ? void 0 : _a.children);
    }
    return [element];
}
