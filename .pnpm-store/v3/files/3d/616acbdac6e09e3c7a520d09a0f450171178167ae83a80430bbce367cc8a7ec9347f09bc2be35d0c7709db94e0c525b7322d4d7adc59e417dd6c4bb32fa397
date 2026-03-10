import { createDefaultContext, getRenderableChildrenOf } from './utils/index.js';
const LAYOUT_FN_MAP = new Map();
export function createLayout(fn) {
    const type = Symbol('layout');
    LAYOUT_FN_MAP.set(type, fn);
    const LayoutComponent = (props) => ({ type, props });
    return LayoutComponent;
}
export function isLayoutComponent(element) {
    return (element != null &&
        typeof element === 'object' &&
        !Array.isArray(element) &&
        typeof element.type === 'symbol' &&
        LAYOUT_FN_MAP.has(element.type));
}
export function performLayout(element, context = createDefaultContext()) {
    const layoutFn = LAYOUT_FN_MAP.get(element.type);
    if (!layoutFn) {
        console.warn('Layout function not found for symbol:', element.type);
        return element;
    }
    const children = getRenderableChildrenOf(element).filter((child) => {
        // ignore text nodes
        return typeof child === 'object';
    });
    return layoutFn(children, element.props, context);
}
