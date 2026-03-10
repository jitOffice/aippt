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
import { getResourceHref, getResourceId, loadResource, parseResourceConfig, } from '../../resource/index.js';
import { createElement, getAttributes, getOrCreateDefs, removeAttributes, setAttributes, uuid, } from '../../utils/index.js';
export function renderIllus(svg, node, value, datum, attrs = {}) {
    if (!value)
        return null;
    const config = parseResourceConfig(value);
    if (!config)
        return null;
    const id = getResourceId(config);
    if (attrs && Object.keys(attrs).length > 0) {
        setAttributes(node, attrs);
    }
    const clipPathId = createClipPath(svg, node, id);
    loadResource(svg, 'illus', config, datum);
    const { data, color } = config;
    return createIllusElement(id, Object.assign(Object.assign(Object.assign(Object.assign({}, parseIllusBounds(node)), (color ? { color } : {})), attrs), { 'clip-path': `url(#${clipPathId})` }), data);
}
export function renderItemIllus(svg, node, datum) {
    var _a;
    const value = datum.illus;
    const attrs = (_a = datum.attributes) === null || _a === void 0 ? void 0 : _a.illus;
    return renderIllus(svg, node, value, datum, attrs);
}
function createClipPath(svg, node, id) {
    const clipPathId = `clip-${id}-${uuid()}`;
    if (svg.querySelector(`#${clipPathId}`)) {
        return clipPathId;
    }
    const defs = getOrCreateDefs(svg);
    const clipPath = createElement('clipPath', {
        id: clipPathId,
    });
    const clonedNode = node.cloneNode();
    removeAttributes(clonedNode, [
        'id',
        'data-illus-bounds',
        'data-element-type',
    ]);
    clipPath.appendChild(clonedNode);
    defs.appendChild(clipPath);
    return clipPathId;
}
function createIllusElement(id, attrs, value) {
    const { 'clip-path': clipPath } = attrs, restAttrs = __rest(attrs, ['clip-path']);
    const { x = '0', y = '0', width = '0', height = '0' } = restAttrs;
    const bounds = createElement('rect', {
        id: `${id}-volume`,
        'data-element-type': "illus-volume" /* ElementTypeEnum.IllusVolume */,
        x,
        y,
        width,
        height,
        fill: 'transparent',
    });
    const g = createElement('g', {
        'data-element-type': "illus-group" /* ElementTypeEnum.IllusGroup */,
        'clip-path': clipPath,
        id: `${id}-group`,
    });
    g.appendChild(bounds);
    const use = createElement('use', Object.assign(Object.assign({ id, fill: 'lightgray' }, restAttrs), { href: getResourceHref(value), 'data-element-type': "illus" /* ElementTypeEnum.Illus */ }));
    g.appendChild(use);
    return g;
}
function parseIllusBounds(node) {
    const dataIllusBounds = node.getAttribute('data-illus-bounds');
    if (!dataIllusBounds) {
        return Object.assign({ x: '0', y: '0', width: '0', height: '0' }, getAttributes(node, ['x', 'y', 'width', 'height']));
    }
    const [x, y, width, height] = dataIllusBounds.split(' ');
    return { x, y, width, height };
}
