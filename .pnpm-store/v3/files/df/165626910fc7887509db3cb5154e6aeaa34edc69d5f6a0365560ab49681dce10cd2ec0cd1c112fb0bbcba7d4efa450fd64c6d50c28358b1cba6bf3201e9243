"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSVGResource = loadSVGResource;
const utils_1 = require("../../utils");
function isSVGResource(resource) {
    const trimmedResource = resource.trim();
    return (/^(?:<\?xml[^>]*>\s*)?<svg[\s>]/i.test(trimmedResource) ||
        trimmedResource.startsWith('<symbol'));
}
function loadSVGResource(data) {
    if (!data || !isSVGResource(data))
        return null;
    const str = data
        .replace(/<svg(?=[\s/>])/i, '<symbol')
        .replace(/<\/svg>/i, '</symbol>');
    return (0, utils_1.parseSVG)(str);
}
