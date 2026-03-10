"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRenderableChildrenOf = getRenderableChildrenOf;
const element_1 = require("./element");
function getRenderableChildrenOf(element) {
    var _a;
    if (element === null ||
        element === undefined ||
        typeof element === 'boolean') {
        return [];
    }
    if (Array.isArray(element))
        return (0, element_1.nodeToRenderableNodes)(element);
    if (typeof element === 'object') {
        return (0, element_1.nodeToRenderableNodes)((_a = element.props) === null || _a === void 0 ? void 0 : _a.children);
    }
    return [element];
}
