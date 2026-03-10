"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDynamicAttributes = parseDynamicAttributes;
function parseDynamicAttributes(node, attributes) {
    const attrs = Object.entries(attributes).reduce((acc, [key, value]) => {
        if (typeof value === 'function') {
            const staticValue = value(node.getAttribute(key), node);
            if (staticValue !== undefined && staticValue !== null)
                acc[key] = staticValue;
        }
        else {
            Object.assign(acc, { [key]: value });
        }
        return acc;
    }, {});
    return attrs;
}
