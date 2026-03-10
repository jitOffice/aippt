var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchWithCache } from '../../utils/index.js';
import { loadImageBase64Resource } from './image.js';
import { loadSVGResource } from './svg.js';
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
export function loadRemoteResource(resource, format) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!resource || !isRemoteResource(resource))
            return null;
        const response = yield fetchWithCache(resource);
        if (!response.ok)
            throw new Error('Failed to load resource');
        const contentType = response.headers.get('Content-Type') || '';
        if (shouldParseAsSVG(contentType, format)) {
            const svgText = yield response.text();
            return loadSVGResource(svgText);
        }
        const blob = yield response.blob();
        const base64 = yield blobToBase64(blob);
        return loadImageBase64Resource(base64);
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
