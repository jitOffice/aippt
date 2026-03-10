var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { exportToSVG } from '../exporter/index.js';
import { getFontURLs } from '../renderer/index.js';
import { Infographic } from '../runtime/index.js';
import { decodeFontFamily } from '../utils/index.js';
import { setupDOM } from './dom-shim.js';
export function renderToString(options, init) {
    return __awaiter(this, void 0, void 0, function* () {
        const { document } = setupDOM();
        const container = document.getElementById('container');
        let infographic;
        let timeoutId;
        try {
            infographic = new Infographic(Object.assign(Object.assign({}, init), { container, editable: false }));
            const renderPromise = new Promise((resolve, reject) => {
                infographic.on('loaded', (_a) => __awaiter(this, [_a], void 0, function* ({ node }) {
                    try {
                        const svg = yield exportToSVG(node, { embedResources: true });
                        resolve(svg.outerHTML);
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            });
            const timeoutPromise = new Promise((_, reject) => {
                timeoutId = setTimeout(() => {
                    reject(new Error('SSR render timeout'));
                }, 10000);
            });
            infographic.render(options);
            const svg = yield Promise.race([renderPromise, timeoutPromise]);
            return injectXMLStylesheet(svg);
        }
        finally {
            clearTimeout(timeoutId);
            if (infographic) {
                infographic.destroy();
            }
        }
    });
}
function injectXMLStylesheet(svg) {
    const matched = svg.matchAll(/font-family="([\S ]+?)"/g);
    const fonts = Array.from(matched, (match) => match[1]);
    const set = new Set();
    fonts.forEach((font) => {
        const decoded = decodeFontFamily(font);
        decoded.split(',').forEach((f) => set.add(f.trim()));
    });
    const urls = Array.from(set)
        .map((font) => getFontURLs(font))
        .flat();
    if (urls.length === 0)
        return svg;
    return `<?xml version="1.0" encoding="UTF-8"?>
${urls.map((url) => `<?xml-stylesheet href="${url}" type="text/css"?>`).join('\n')}
${svg}`;
}
