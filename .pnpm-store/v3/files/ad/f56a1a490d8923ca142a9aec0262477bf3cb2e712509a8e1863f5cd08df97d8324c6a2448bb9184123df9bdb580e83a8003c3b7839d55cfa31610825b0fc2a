import { loadResource } from '../../resource/index.js';
import { createIconElement, getAttributes } from '../../utils/index.js';
import { parseDynamicAttributes } from '../utils/index.js';
export function renderItemIcon(svg, node, datum, options) {
    var _a, _b;
    const value = datum.icon;
    if (!value)
        return null;
    const { themeConfig } = options;
    const dataAttrs = (_a = datum.attributes) === null || _a === void 0 ? void 0 : _a.icon;
    const attrs = Object.assign(Object.assign({}, (_b = themeConfig.item) === null || _b === void 0 ? void 0 : _b.icon), dataAttrs);
    const parsedAttrs = parseDynamicAttributes(node, attrs);
    return createIcon(svg, node, value, parsedAttrs, datum);
}
function createIcon(svg, node, value, attrs, datum) {
    // load async
    loadResource(svg, 'icon', value, datum);
    return createIconElement(value, Object.assign(Object.assign({}, getAttributes(node, [
        'id',
        'x',
        'y',
        'width',
        'height',
        'fill',
        'stroke',
        'data-element-type',
        'data-indexes',
    ])), attrs));
}
