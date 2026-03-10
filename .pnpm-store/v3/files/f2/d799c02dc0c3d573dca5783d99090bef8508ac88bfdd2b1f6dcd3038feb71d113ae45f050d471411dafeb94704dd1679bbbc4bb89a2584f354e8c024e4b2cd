"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDOM = setupDOM;
const linkedom_1 = require("linkedom");
function setupDOM() {
    const { document, window } = (0, linkedom_1.parseHTML)('<!DOCTYPE html><html><body><div id="container"></div></body></html>');
    Object.assign(globalThis, {
        window,
        document,
        DOMParser: linkedom_1.DOMParser,
    });
    const classes = [
        'HTMLElement',
        'HTMLDivElement',
        'HTMLSpanElement',
        'HTMLImageElement',
        'HTMLCanvasElement',
        'HTMLInputElement',
        'HTMLButtonElement',
        'Element',
        'Node',
        'Text',
        'Comment',
        'DocumentFragment',
        'Document',
        'XMLSerializer',
        'MutationObserver',
        // SVG
        'SVGElement',
        'SVGSVGElement',
        'SVGGraphicsElement',
        'SVGGElement',
        'SVGPathElement',
        'SVGRectElement',
        'SVGCircleElement',
        'SVGTextElement',
        'SVGLineElement',
        'SVGPolygonElement',
        'SVGPolylineElement',
        'SVGEllipseElement',
        'SVGImageElement',
        'SVGDefsElement',
        'SVGUseElement',
        'SVGClipPathElement',
        'SVGLinearGradientElement',
        'SVGRadialGradientElement',
        'SVGStopElement',
        'SVGPatternElement',
        'SVGMaskElement',
        'SVGForeignObjectElement',
        'Image',
    ];
    classes.forEach((name) => {
        if (window[name])
            globalThis[name] = window[name];
    });
    if (!document.fonts) {
        const fontSet = new Set();
        Object.defineProperty(document, 'fonts', {
            value: {
                add: (font) => fontSet.add(font),
                delete: (font) => fontSet.delete(font),
                has: (font) => fontSet.has(font),
                clear: () => fontSet.clear(),
                forEach: (callback) => fontSet.forEach(callback),
                entries: () => fontSet.entries(),
                keys: () => fontSet.keys(),
                values: () => fontSet.values(),
                [Symbol.iterator]: () => fontSet[Symbol.iterator](),
                get size() {
                    return fontSet.size;
                },
                get ready() {
                    return Promise.resolve(this);
                },
                check: () => true,
                load: () => Promise.resolve([]),
                get status() {
                    return 'loaded';
                },
                onloading: null,
                onloadingdone: null,
                onloadingerror: null,
                addEventListener: () => { },
                removeEventListener: () => { },
                dispatchEvent: () => true,
            },
            configurable: true,
        });
    }
    const rafIds = new Map();
    let nextRafId = 0;
    globalThis.requestAnimationFrame = (cb) => {
        const id = ++nextRafId;
        const immediate = setImmediate(() => {
            rafIds.delete(id);
            cb(performance.now());
        });
        rafIds.set(id, immediate);
        return id;
    };
    globalThis.cancelAnimationFrame = (id) => {
        const immediate = rafIds.get(id);
        if (immediate) {
            clearImmediate(immediate);
            rafIds.delete(id);
        }
    };
    return { window, document };
}
