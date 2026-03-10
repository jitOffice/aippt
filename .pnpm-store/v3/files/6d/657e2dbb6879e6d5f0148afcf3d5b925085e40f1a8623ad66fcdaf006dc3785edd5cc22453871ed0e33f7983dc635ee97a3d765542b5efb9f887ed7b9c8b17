import type { ComponentType, JSXElement, JSXNode, RenderContext, WithChildren } from './types';
type LayoutComponent = JSXElement & {
    type: symbol;
};
type LayoutFunction<T = {}> = (children: JSXElement[], props: WithChildren<T>, context: RenderContext) => JSXElement;
export declare function createLayout<T = {}>(fn: LayoutFunction<T>): ComponentType<T>;
export declare function isLayoutComponent(element: JSXNode): element is LayoutComponent;
export declare function performLayout(element: LayoutComponent, context?: RenderContext): JSXElement;
export {};
