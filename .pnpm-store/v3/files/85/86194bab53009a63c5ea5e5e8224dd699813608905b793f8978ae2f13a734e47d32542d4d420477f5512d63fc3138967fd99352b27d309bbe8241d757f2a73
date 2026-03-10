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
exports.loadRemoteResource = loadRemoteResource;
const utils_1 = require("../../utils");
const image_1 = require("./image");
const svg_1 = require("./svg");
function isRemoteResource(resource) {
    try {
        return Boolean(new URL(resource));
    }
    catch (_a) {
        return false;
    }
}
function shouldParseAsSVG(contentType, format) {
    const normalized = contentType.toLowerCase();
    if (normalized.includes('image/svg'))
        return true;
    if (!contentType && format === 'svg')
        return true;
    return false;
}
function loadRemoteResource(resource, format) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!resource || !isRemoteResource(resource))
            return null;
        const response = yield (0, utils_1.fetchWithCache)(resource);
        if (!response.ok)
            throw new Error('Failed to load resource');
        const contentType = response.headers.get('Content-Type') || '';
        if (shouldParseAsSVG(contentType, format)) {
            const svgText = yield response.text();
            return (0, svg_1.loadSVGResource)(svgText);
        }
        const blob = yield response.blob();
        const base64 = yield blobToBase64(blob);
        return (0, image_1.loadImageBase64Resource)(base64);
    });
}
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
