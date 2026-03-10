import type { CustomSvg, Topic } from './types/dom';
import type { MindElixirInstance, Uid } from './index';
export type Arrow = {
    id: string;
    label: string;
    from: Uid;
    to: Uid;
    delta1: {
        x: number;
        y: number;
    };
    delta2: {
        x: number;
        y: number;
    };
};
export type DivData = {
    cx: number;
    cy: number;
    w: number;
    h: number;
    ctrlX: number;
    ctrlY: number;
};
export declare const createArrow: (this: MindElixirInstance, from: Topic, to: Topic) => void;
export declare const removeArrow: (this: MindElixirInstance, linkSvg?: CustomSvg) => void;
export declare const selectArrow: (this: MindElixirInstance, link: CustomSvg) => void;
export declare const unselectArrow: (this: MindElixirInstance) => void;
export declare function renderArrow(this: MindElixirInstance): void;
export declare function editArrowLabel(this: MindElixirInstance, el: CustomSvg): void;
export declare function tidyArrow(this: MindElixirInstance): void;
