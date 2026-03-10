"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElement = createElement;
exports.parseSVG = parseSVG;
exports.setAttributes = setAttributes;
exports.getAttributes = getAttributes;
exports.removeAttributes = removeAttributes;
exports.traverse = traverse;
exports.getOrCreateDefs = getOrCreateDefs;
function createElement(tagName, attributes = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    setAttributes(element, attributes);
    return element;
}
function parseSVG(svg) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
        throw new Error('Invalid SVG string');
    }
    return doc.documentElement;
}
function setAttributes(element, attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            element.removeAttribute(key);
        }
        else {
            element.setAttribute(key, value);
        }
    });
}
function getAttributes(element, attrs, ignoreEmpty = true) {
    return attrs.reduce((acc, attr) => {
        const value = element.getAttribute(attr);
        if (!ignoreEmpty ||
            (value !== null && value !== '' && value !== undefined)) {
            acc[attr] = value;
        }
        return acc;
    }, {});
}
function removeAttributes(element, attrs) {
    attrs.forEach((attr) => {
        element.removeAttribute(attr);
    });
}
function traverse(node, callback) {
    if (callback(node) === false)
        return;
    const children = Array.from(node.children);
    children.forEach((child) => {
        traverse(child, callback);
    });
}
function getOrCreateDefs(svg, defsId = 'infographic-defs') {
    const selector = defsId ? `defs#${defsId}` : 'defs';
    const defs = svg.querySelector(selector);
    if (defs)
        return defs;
    const newDefs = createElement('defs');
    if (defsId)
        newDefs.id = defsId;
    svg.prepend(newDefs);
    return newDefs;
}
