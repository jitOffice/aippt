import { getResourceHref } from '../resource/index.js';
import { createElement, getAttributes, setAttributes } from './svg.js';
const ICON_RESOURCE_CACHE = new WeakMap();
export function getIconResourceConfig(icon) {
    return ICON_RESOURCE_CACHE.get(icon) || null;
}
export function createIconElement(value, attrs = {}) {
    const icon = createElement('use', Object.assign(Object.assign({}, attrs), { href: getResourceHref(value) }));
    applyIconColor(icon);
    ICON_RESOURCE_CACHE.set(icon, value);
    return icon;
}
export function applyIconColor(icon) {
    const { stroke, fill } = getAttributes(icon, ['fill', 'stroke']);
    icon.style.color = fill || stroke || 'currentColor';
}
export function getIconEntity(icon) {
    if (icon.tagName === 'use') {
        return icon;
    }
    return icon.querySelector('use');
}
export function getIconAttrs(icon) {
    const entity = getIconEntity(icon);
    if (!entity)
        return {};
    const attrs = getAttributes(entity, [
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
export function updateIconElement(icon, value, attrs) {
    const entity = getIconEntity(icon);
    if (!entity)
        return;
    if (value)
        setAttributes(entity, { href: getResourceHref(value) });
    if (attrs)
        setAttributes(entity, attrs);
    applyIconColor(entity);
}
