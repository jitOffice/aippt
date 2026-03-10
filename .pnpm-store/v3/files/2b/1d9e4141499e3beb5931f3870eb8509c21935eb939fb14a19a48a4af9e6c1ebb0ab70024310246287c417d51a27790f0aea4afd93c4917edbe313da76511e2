export declare function createElement<T extends SVGElement = SVGElement>(tagName: string, attributes?: Record<string, any>): T;
export declare function parseSVG<T extends SVGElement = SVGSVGElement>(svg: string): T | null;
export declare function setAttributes(element: SVGElement, attrs: Record<string, any>): void;
export declare function getAttributes(element: SVGElement, attrs: readonly string[], ignoreEmpty?: boolean): Record<string, string | null>;
export declare function removeAttributes(element: SVGElement, attrs: string[]): void;
export declare function traverse(node: SVGElement, callback: <T extends SVGElement = SVGElement>(child: T) => boolean | void): void;
export declare function getOrCreateDefs(svg: SVGSVGElement, defsId?: string): SVGDefsElement;
