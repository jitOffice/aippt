import { BaseLayout } from '../base-layout.js';
import { AntVDagreLayoutOptions } from './types.js';

/**
 * <zh/> AntV 实现的 Dagre 布局
 *
 * <en/> AntV implementation of Dagre layout
 */
declare class AntVDagreLayout extends BaseLayout<AntVDagreLayoutOptions> {
    id: string;
    protected getDefaultOptions(): AntVDagreLayoutOptions;
    protected layout(options: AntVDagreLayoutOptions): Promise<void>;
}

export { AntVDagreLayout, AntVDagreLayoutOptions };
