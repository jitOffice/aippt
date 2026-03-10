"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderItemIcon = renderItemIcon;
const resource_1 = require("../../resource");
const utils_1 = require("../../utils");
const utils_2 = require("../utils");
function renderItemIcon(svg, node, datum, options) {
    var _a, _b;
    const value = datum.icon;
    if (!value)
        return null;
    const { themeConfig } = options;
    const dataAttrs = (_a = datum.attributes) === null || _a === void 0 ? void 0 : _a.icon;
    const attrs = Object.assign(Object.assign({}, (_b = themeConfig.item) === null || _b === void 0 ? void 0 : _b.icon), dataAttrs);
    const parsedAttrs = (0, utils_2.parseDynamicAttributes)(node, attrs);
    return createIcon(svg, node, value, parsedAttrs, datum);
}
function createIcon(svg, node, value, attrs, datum) {
    // load async
    (0, resource_1.loadResource)(svg, 'icon', value, datum);
    return (0, utils_1.createIconElement)(value, Object.assign(Object.assign({}, (0, utils_1.getAttributes)(node, [
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
