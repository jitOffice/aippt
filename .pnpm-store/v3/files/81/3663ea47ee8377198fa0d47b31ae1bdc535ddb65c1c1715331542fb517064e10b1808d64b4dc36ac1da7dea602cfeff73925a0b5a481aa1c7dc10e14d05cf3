"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResourceId = getResourceId;
exports.getResourceHref = getResourceHref;
const utils_1 = require("../../utils");
const parser_1 = require("./parser");
function getResourceId(config) {
    const cfg = typeof config === 'string' ? (0, parser_1.parseResourceConfig)(config) : config;
    if (!cfg)
        return null;
    return 'rsc-' + (0, utils_1.getSimpleHash)(JSON.stringify(cfg));
}
function getResourceHref(config) {
    const id = getResourceId(config);
    if (!id)
        return null;
    return `#${id}`;
}
