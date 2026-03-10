import { BaseLayout } from '../base-layout.js';
import { GridLayoutOptions } from './types.js';

/**
 * <zh/> 网格布局
 *
 * <en/> Grid layout
 */
declare class GridLayout extends BaseLayout<GridLayoutOptions> {
    id: string;
    protected getDefaultOptions(): Partial<GridLayoutOptions>;
    private parseOptions;
    protected layout(): Promise<void>;
}

export { GridLayout, GridLayoutOptions };
