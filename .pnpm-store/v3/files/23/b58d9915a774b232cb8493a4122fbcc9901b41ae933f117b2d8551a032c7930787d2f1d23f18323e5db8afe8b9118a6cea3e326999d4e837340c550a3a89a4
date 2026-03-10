import { BaseLayout } from '../base-layout.js';
import { MDSLayoutOptions } from './types.js';

/**
 * <zh/> 多维缩放算法布局
 *
 * <en/> Multidimensional scaling layout
 */
declare class MDSLayout extends BaseLayout<MDSLayoutOptions> {
    id: string;
    protected getDefaultOptions(): Partial<MDSLayoutOptions>;
    protected layout(): Promise<void>;
}

export { MDSLayout, MDSLayoutOptions };
