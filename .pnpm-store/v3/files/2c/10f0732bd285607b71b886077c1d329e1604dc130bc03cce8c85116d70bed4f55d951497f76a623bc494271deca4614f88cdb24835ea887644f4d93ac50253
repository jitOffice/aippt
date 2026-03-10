"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSearchResource = loadSearchResource;
const constants_1 = require("../../constants");
const utils_1 = require("../../utils");
const image_1 = require("./image");
const remote_1 = require("./remote");
const svg_1 = require("./svg");
const queryIcon = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const params = new URLSearchParams({ text: query, topK: '1' });
        const url = `${constants_1.ICON_SERVICE_URL}?${params.toString()}`;
        const response = yield (0, utils_1.fetchWithCache)(url);
        if (!response.ok)
            return null;
        const result = yield response.json();
        if (!(result === null || result === void 0 ? void 0 : result.status) || !Array.isArray((_a = result.data) === null || _a === void 0 ? void 0 : _a.data))
            return null;
        return result.data.data[0] || null;
    }
    catch (error) {
        console.error(`Failed to query icon for "${query}":`, error);
        return null;
    }
});
function isDataURI(resource) {
    return resource.startsWith('data:');
}
function looksLikeSVG(resource) {
    const str = resource.trim();
    return str.startsWith('<svg') || str.startsWith('<symbol');
}
function loadSearchResource(query, format) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!query)
            return null;
        const result = yield queryIcon(query);
        if (!result)
            return null;
        if (looksLikeSVG(result))
            return (0, svg_1.loadSVGResource)(result);
        if (isDataURI(result)) {
            const mimeType = ((_a = result.match(/^data:([^;]+)/)) === null || _a === void 0 ? void 0 : _a[1]) || '';
            const isBase64 = result.includes(';base64,');
            if (mimeType === 'image/svg+xml' && !isBase64) {
                const commaIndex = result.indexOf(',');
                const svgText = commaIndex >= 0 ? result.slice(commaIndex + 1) : result;
                return (0, svg_1.loadSVGResource)(svgText);
            }
            if (mimeType === 'image/svg+xml' && format === 'svg' && isBase64) {
                return (0, image_1.loadImageBase64Resource)(result);
            }
            return (0, image_1.loadImageBase64Resource)(result);
        }
        return (0, remote_1.loadRemoteResource)(result, format);
    });
}
