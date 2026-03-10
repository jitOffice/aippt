"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLayout = createLayout;
exports.isLayoutComponent = isLayoutComponent;
exports.performLayout = performLayout;
const utils_1 = require("./utils");
const LAYOUT_FN_MAP = new Map();
function createLayout(fn) {
    const type = Symbol('layout');
    LAYOUT_FN_MAP.set(type, fn);
    const LayoutComponent = (props) => ({ type, props });
    return LayoutComponent;
}
function isLayoutComponent(element) {
    return (element != null &&
        typeof element === 'object' &&
        !Array.isArray(element) &&
        typeof element.type === 'symbol' &&
        LAYOUT_FN_MAP.has(element.type));
}
function performLayout(element, context = (0, utils_1.createDefaultContext)()) {
    const layoutFn = LAYOUT_FN_MAP.get(element.type);
    if (!layoutFn) {
        console.warn('Layout function not found for symbol:', element.type);
        return element;
    }
    const children = (0, utils_1.getRenderableChildrenOf)(element).filter((child) => {
        // ignore text nodes
        return typeof child === 'object';
    });
    return layoutFn(children, element.props, context);
}
