import { BaseLayout } from '../base-layout.js';
import { DagreLayoutOptions } from './types.js';

/**
 * <zh/> Dagre 布局
 *
 * <en/> Dagre layout
 */
declare class DagreLayout extends BaseLayout<DagreLayoutOptions> {
    id: string;
    private isCompoundGraph;
    protected config: {
        graphAttributes: string[];
        nodeAttributes: string[];
        edgeAttributes: string[];
    };
    protected getDefaultOptions(): Partial<DagreLayoutOptions>;
    protected layout(): Promise<void>;
    private isCompound;
}

export { DagreLayout, DagreLayoutOptions };
