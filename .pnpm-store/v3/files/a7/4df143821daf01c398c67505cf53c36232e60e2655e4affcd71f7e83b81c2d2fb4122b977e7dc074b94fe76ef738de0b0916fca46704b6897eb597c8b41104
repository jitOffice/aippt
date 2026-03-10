import type { JSXElement } from '../../jsx';
export declare const getMidPoint: (points: [number, number][]) => [number, number] | null;
export declare const createStraightPath: (points: [number, number][], dx: number, dy: number) => string;
export declare const createRoundedPath: (points: [number, number][], radius: number, dx: number, dy: number) => string;
export declare const createArrowElements: (x: number, y: number, angle: number, type: "arrow" | "triangle" | "diamond", fillColor: string, edgeWidth: number, arrowSize: number) => JSXElement[];
export declare const getNodesAnchors: (node: {
    x: number;
    y: number;
    width: number;
    height: number;
    radio?: number;
}) => {
    LT: {
        x: number;
        y: number;
    };
    LC: {
        x: number;
        y: number;
    };
    LB: {
        x: number;
        y: number;
    };
    RT: {
        x: number;
        y: number;
    };
    RC: {
        x: number;
        y: number;
    };
    RB: {
        x: number;
        y: number;
    };
};
export declare const getTangentAngle: (points: [number, number][], t: 0 | 1) => number;
/**
 * 计算贝塞尔曲线上任意 t (0-1) 位置的点
 */
export declare const getPointAtT: (points: [number, number][], t?: number) => [number, number];
export declare const getLabelPosition: (points: [number, number][], selfLoopOffset?: number) => [number, number];
export declare const getEdgePathD: (points: [number, number][]) => string;
