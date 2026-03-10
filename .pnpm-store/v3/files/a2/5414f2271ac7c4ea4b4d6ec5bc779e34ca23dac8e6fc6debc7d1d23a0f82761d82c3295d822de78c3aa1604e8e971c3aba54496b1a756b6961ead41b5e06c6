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
exports.renderToString = renderToString;
const exporter_1 = require("../exporter");
const renderer_1 = require("../renderer");
const runtime_1 = require("../runtime");
const utils_1 = require("../utils");
const dom_shim_1 = require("./dom-shim");
function renderToString(options, init) {
    return __awaiter(this, void 0, void 0, function* () {
        const { document } = (0, dom_shim_1.setupDOM)();
        const container = document.getElementById('container');
        let infographic;
        let timeoutId;
        try {
            infographic = new runtime_1.Infographic(Object.assign(Object.assign({}, init), { container, editable: false }));
            const renderPromise = new Promise((resolve, reject) => {
                infographic.on('loaded', (_a) => __awaiter(this, [_a], void 0, function* ({ node }) {
                    try {
                        const svg = yield (0, exporter_1.exportToSVG)(node, { embedResources: true });
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
        const decoded = (0, utils_1.decodeFontFamily)(font);
        decoded.split(',').forEach((f) => set.add(f.trim()));
    });
    const urls = Array.from(set)
        .map((font) => (0, renderer_1.getFontURLs)(font))
        .flat();
    if (urls.length === 0)
        return svg;
    return `<?xml version="1.0" encoding="UTF-8"?>
${urls.map((url) => `<?xml-stylesheet href="${url}" type="text/css"?>`).join('\n')}
${svg}`;
}
