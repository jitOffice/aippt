import type { ComponentType } from '../../jsx';
import type { HierarchyColorMode } from '../utils';
import type { BaseStructureProps } from './types';
type EdgeAlign = 'top' | 'center' | 'bottom' | number;
type EdgeType = 'curved' | 'straight';
type EdgeColorMode = 'solid' | 'gradient';
export interface HierarchyMindmapProps extends BaseStructureProps {
    /** 水平层级间距 */
    levelGap?: number;
    /** 垂直节点间距 */
    nodeGap?: number;
    /** 连线在节点上的垂直对齐方式；字符串为固定位置，数字为 0-1 比例 */
    edgeAlign?: EdgeAlign;
    /** 节点/连线着色模式 */
    colorMode?: HierarchyColorMode;
    /** 连线颜色模式 */
    edgeColorMode?: EdgeColorMode;
    /** 连线类型：曲线或直线 */
    edgeType?: EdgeType;
    /** 连线宽度 */
    edgeWidth?: number;
}
export declare const HierarchyMindmap: ComponentType<HierarchyMindmapProps>;
export {};
