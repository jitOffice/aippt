"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommonAttrs = getCommonAttrs;
function getCommonAttrs(attrs) {
    return Object.keys(attrs[0]).reduce((acc, key) => {
        const k = key;
        if (attrs.every((attr) => attr[k] === attrs[0][k])) {
            acc[k] = attrs[0][k];
        }
        return acc;
    }, {});
}
