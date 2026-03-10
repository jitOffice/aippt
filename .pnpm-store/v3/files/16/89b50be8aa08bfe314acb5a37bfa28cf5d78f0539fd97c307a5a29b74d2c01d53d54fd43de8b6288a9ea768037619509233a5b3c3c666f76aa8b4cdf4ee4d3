import type { MindElixirInstance } from '.';
export type Summary = {
    id: string;
    text: string;
    parent: string;
    start: number;
    end: number;
};
export type SummarySvgGroup = SVGGElement & {
    children: [SVGPathElement, SVGTextElement];
    summaryObj: Summary;
};
export declare const createSummary: (this: MindElixirInstance) => void;
export declare const removeSummary: (this: MindElixirInstance, id: string) => void;
export declare const selectSummary: (this: MindElixirInstance, el: SummarySvgGroup) => void;
export declare const unselectSummary: (this: MindElixirInstance) => void;
export declare const renderSummary: (this: MindElixirInstance) => void;
export declare const editSummary: (this: MindElixirInstance, el: SummarySvgGroup) => void;
