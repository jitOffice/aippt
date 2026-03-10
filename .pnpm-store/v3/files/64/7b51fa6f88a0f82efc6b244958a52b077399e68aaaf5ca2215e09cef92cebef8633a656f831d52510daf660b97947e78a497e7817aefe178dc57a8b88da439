"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = render;
exports.renderSVG = renderSVG;
const components_1 = require("./components");
const jsx_runtime_1 = require("./jsx-runtime");
const layout_1 = require("./layout");
const utils_1 = require("./utils");
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
    if ((0, layout_1.isLayoutComponent)(element)) {
        const layoutResult = (0, layout_1.performLayout)(element, context);
        return processElement(layoutResult, context);
    }
    // expand function components
    if (typeof element.type === 'function') {
        const rendered = element.type(element.props);
        return processElement(rendered, context);
    }
    // process children
    const children = (0, utils_1.getRenderableChildrenOf)(element)
        .map((child) => processElement(child, context))
        .filter(Boolean);
    // process Fragment
    if (element.type === jsx_runtime_1.Fragment) {
        return children;
    }
    // process Defs, collect defs content
    if (element.type === components_1.DefsSymbol) {
        children.forEach((child) => {
            if (typeof child === 'object' && child.props.id) {
                context.defs.set(child.props.id, child);
            }
        });
        return null;
    }
    if (children.length) {
        return (0, utils_1.cloneElement)(element, { children });
    }
    return element;
}
/**
 * render a single element to string
 */
function render(element, context) {
    if (element == null)
        return '';
    if (typeof element === 'string')
        return (0, utils_1.escapeHtml)(element);
    if (typeof element === 'number')
        return String(element);
    const { type, props } = element;
    if (!type)
        return '';
    const children = (0, utils_1.getRenderableChildrenOf)(element);
    if (type === jsx_runtime_1.Fragment) {
        return children
            .map((child) => render(child, context))
            .filter(Boolean)
            .join('');
    }
    if (type === components_1.DefsSymbol) {
        return '';
    }
    // function components and layout components should have been expanded
    if (typeof type === 'function' || (0, layout_1.isLayoutComponent)(element)) {
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
function renderSVG(element, props = {}) {
    const context = (0, utils_1.createDefaultContext)();
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
            const bounds = (0, utils_1.getElementBounds)(processed);
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
        const attrName = (0, utils_1.toSVGAttr)(key);
        const attrValue = typeof value === 'string' ? (0, utils_1.escapeHtml)(String(value)) : String(value);
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
    return ` style="${(0, utils_1.escapeHtml)(styleString)}"`;
}
