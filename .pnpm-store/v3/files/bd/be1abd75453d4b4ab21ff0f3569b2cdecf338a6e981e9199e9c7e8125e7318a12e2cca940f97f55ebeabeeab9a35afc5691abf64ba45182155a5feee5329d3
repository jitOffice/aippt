var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { DefsSymbol } from './components/index.js';
import { Fragment } from './jsx-runtime.js';
import { isLayoutComponent, performLayout } from './layout.js';
import { cloneElement, createDefaultContext, escapeHtml, getElementBounds, getRenderableChildrenOf, toSVGAttr, } from './utils/index.js';
/**
 * pre-process the element tree, expanding all components and layouts
 */
function processElement(element, context) {
    if (element == null || typeof element === 'boolean')
        return null;
    if (typeof element === 'string' || typeof element === 'number') {
        return element;
    }
    if (Array.isArray(element)) {
        return element
            .map((child) => processElement(child, context))
            .filter(Boolean);
    }
    // layout component
    if (isLayoutComponent(element)) {
        const layoutResult = performLayout(element, context);
        return processElement(layoutResult, context);
    }
    // expand function components
    if (typeof element.type === 'function') {
        const rendered = element.type(element.props);
        return processElement(rendered, context);
    }
    // process children
    const children = getRenderableChildrenOf(element)
        .map((child) => processElement(child, context))
        .filter(Boolean);
    // process Fragment
    if (element.type === Fragment) {
        return children;
    }
    // process Defs, collect defs content
    if (element.type === DefsSymbol) {
        children.forEach((child) => {
            if (typeof child === 'object' && child.props.id) {
                context.defs.set(child.props.id, child);
            }
        });
        return null;
    }
    if (children.length) {
        return cloneElement(element, { children });
    }
    return element;
}
/**
 * render a single element to string
 */
export function render(element, context) {
    if (element == null)
        return '';
    if (typeof element === 'string')
        return escapeHtml(element);
    if (typeof element === 'number')
        return String(element);
    const { type, props } = element;
    if (!type)
        return '';
    const children = getRenderableChildrenOf(element);
    if (type === Fragment) {
        return children
            .map((child) => render(child, context))
            .filter(Boolean)
            .join('');
    }
    if (type === DefsSymbol) {
        return '';
    }
    // function components and layout components should have been expanded
    if (typeof type === 'function' || isLayoutComponent(element)) {
        console.warn('Unexpected unprocessed component in render:', element);
        return '';
    }
    const attrs = renderAttrs(props);
    const childrenContent = children
        .map((child) => render(child, context))
        .filter(Boolean)
        .join('');
    const tagName = String(type);
    if (!childrenContent)
        return `<${tagName}${attrs} />`;
    return `<${tagName}${attrs}>${childrenContent}</${tagName}>`;
}
/**
 * render element to svg string
 */
export function renderSVG(element, props = {}) {
    const context = createDefaultContext();
    const processed = processElement(element, context);
    if (!processed)
        return '';
    const content = Array.isArray(processed)
        ? processed.map((el) => render(el, context)).join('')
        : render(processed, context);
    const { x, y, width, height, style } = props, rest = __rest(props, ["x", "y", "width", "height", "style"]);
    const finalProps = Object.assign(Object.assign({}, rest), { xmlns: 'http://www.w3.org/2000/svg' });
    if (!finalProps.viewBox) {
        if (width && height) {
            finalProps.viewBox = `${x !== null && x !== void 0 ? x : 0} ${y !== null && y !== void 0 ? y : 0} ${width !== null && width !== void 0 ? width : 0} ${height !== null && height !== void 0 ? height : 0}`;
        }
        else {
            const bounds = getElementBounds(processed);
            if (bounds) {
                const { x, y, width, height } = bounds;
                finalProps.viewBox = `${x} ${y} ${width} ${height}`;
            }
        }
    }
    const attrs = renderAttrs(finalProps);
    const styleStr = renderStyle(style);
    const defsContent = context.defs.size
        ? `<defs>${Array.from(context.defs.values())
            .map((def) => render(def, context))
            .join('')}</defs>`
        : '';
    return `<svg${attrs}${styleStr}>${defsContent}${content}</svg>`;
}
/**
 * render attributes to string
 */
function renderAttrs(props) {
    if (!props)
        return '';
    const { children } = props, attributes = __rest(props, ["children"]);
    return Object.entries(attributes)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => {
        const attrName = toSVGAttr(key);
        const attrValue = typeof value === 'string' ? escapeHtml(String(value)) : String(value);
        return ` ${attrName}="${attrValue}"`;
    })
        .join('');
}
function renderStyle(style) {
    if (!style || Object.keys(style).length === 0)
        return '';
    const styleString = Object.entries(style)
        .map(([key, value]) => {
        const cssKey = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
        return `${cssKey}: ${value};`;
    })
        .join('');
    return ` style="${escapeHtml(styleString)}"`;
}
