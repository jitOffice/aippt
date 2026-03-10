"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIconResourceConfig = getIconResourceConfig;
exports.createIconElement = createIconElement;
exports.applyIconColor = applyIconColor;
exports.getIconEntity = getIconEntity;
exports.getIconAttrs = getIconAttrs;
exports.updateIconElement = updateIconElement;
const resource_1 = require("../resource");
const svg_1 = require("./svg");
const ICON_RESOURCE_CACHE = new WeakMap();
function getIconResourceConfig(icon) {
    return ICON_RESOURCE_CACHE.get(icon) || null;
}
function createIconElement(value, attrs = {}) {
    const icon = (0, svg_1.createElement)('use', Object.assign(Object.assign({}, attrs), { href: (0, resource_1.getResourceHref)(value) }));
    applyIconColor(icon);
    ICON_RESOURCE_CACHE.set(icon, value);
    return icon;
}
function applyIconColor(icon) {
    const { stroke, fill } = (0, svg_1.getAttributes)(icon, ['fill', 'stroke']);
    icon.style.color = fill || stroke || 'currentColor';
}
function getIconEntity(icon) {
    if (icon.tagName === 'use') {
        return icon;
    }
    return icon.querySelector('use');
}
function getIconAttrs(icon) {
    const entity = getIconEntity(icon);
    if (!entity)
        return {};
    const attrs = (0, svg_1.getAttributes)(entity, [
        'width',
        'height',
        'x',
        'y',
        'width',
        'height',
        'fill',
        'fill-opacity',
        'stroke',
        'opacity',
    ]);
    return attrs;
}
function updateIconElement(icon, value, attrs) {
    const entity = getIconEntity(icon);
    if (!entity)
        return;
    if (value)
        (0, svg_1.setAttributes)(entity, { href: (0, resource_1.getResourceHref)(value) });
    if (attrs)
        (0, svg_1.setAttributes)(entity, attrs);
    applyIconColor(entity);
}
