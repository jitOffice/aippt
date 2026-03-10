import { DOMParser, parseHTML } from 'linkedom';

export function setupDOM(): { window: Window; document: Document } {
  const { document, window } = parseHTML(
    '<!DOCTYPE html><html><body><div id="container"></div></body></html>',
  );

  Object.assign(globalThis, {
    window,
    document,
    DOMParser,
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
    if ((window as any)[name])
      (globalThis as any)[name] = (window as any)[name];
  });

  if (!(document as any).fonts) {
    const fontSet = new Set();
    Object.defineProperty(document, 'fonts', {
      value: {
        add: (font: unknown) => fontSet.add(font),
        delete: (font: unknown) => fontSet.delete(font),
        has: (font: unknown) => fontSet.has(font),
        clear: () => fontSet.clear(),
        forEach: (callback: (font: unknown) => void) =>
          fontSet.forEach(callback),
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
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      },
      configurable: true,
    });
  }

  const rafIds = new Map<number, NodeJS.Immediate>();
  let nextRafId = 0;

  (globalThis as any).requestAnimationFrame = (
    cb: (time: number) => void,
  ): number => {
    const id = ++nextRafId;
    const immediate = setImmediate(() => {
      rafIds.delete(id);
      cb(performance.now());
    });
    rafIds.set(id, immediate);
    return id;
  };

  (globalThis as any).cancelAnimationFrame = (id: number) => {
    const immediate = rafIds.get(id);
    if (immediate) {
      clearImmediate(immediate);
      rafIds.delete(id);
    }
  };

  return { window, document };
}
