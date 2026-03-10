import { Element, GeometryElement, TextElement } from '../types';
export declare const isSVG: (element: any) => element is SVGSVGElement;
export declare const isTitle: (element: SVGElement) => boolean;
export declare const isDesc: (element: SVGElement) => boolean;
export declare const isShape: (element: SVGElement) => boolean;
export declare const isShapesGroup: (element: SVGElement) => boolean;
export declare const isIllus: (element: SVGElement) => boolean;
export declare const isText: (element: SVGElement) => element is SVGTextElement;
export declare const isGroup: (element: SVGElement) => element is SVGGElement;
export declare const isItemIcon: (element: SVGElement) => boolean;
export declare const isItemIconGroup: (element: SVGElement) => boolean;
export declare const isItemLabel: (element: SVGElement) => boolean;
export declare const isItemDesc: (element: SVGElement) => boolean;
export declare const isItemValue: (element: SVGElement) => boolean;
export declare const isItemIllus: (element: SVGElement) => boolean;
export declare const isEditArea: (element: SVGElement) => boolean;
export declare const isBtnsGroup: (element: SVGElement) => boolean;
export declare const isBtnAdd: (element: SVGElement) => boolean;
export declare const isBtnRemove: (element: SVGElement) => boolean;
export declare const isRoughElement: (element: SVGElement) => boolean;
export declare const isRoughVolume: (element: SVGElement) => boolean;
export declare function isForeignObjectElement(element: any): element is SVGForeignObjectElement;
export declare function isTextEntity(element: any): element is HTMLSpanElement;
export declare function isEditableText(node: SVGElement): node is TextElement;
export declare function isEditingText(element: SVGElement | null): boolean;
export declare function isGeometryElement(element: Element): element is GeometryElement;
export declare function isIconElement(element: SVGElement): boolean;
/**
 * 对于编辑器插件、交互挂载的DOM元素，识别其是否为信息图组件的一部分
 * 在元素中操作时不会触发编辑器的取消激活行为
 */
export declare function isInfographicComponent(element: HTMLElement): boolean;
