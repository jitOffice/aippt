import type { ComponentType } from '../../jsx';
import type { HierarchyColorMode } from '../utils';
import type { BaseStructureProps } from './types';
export interface HierarchyTreeProps extends BaseStructureProps {
    /** 层级间距：父子节点之间的垂直距离，默认 80 */
    levelGap?: number;
    /** 节点间距：同级节点之间的水平距离，默认 60 */
    nodeGap?: number;
    /** 布局方向：'top-bottom' 自上而下 | 'bottom-top' 自下而上 | 'left-right' 自左向右 | 'right-left' 自右向左，默认 'top-bottom' */
    orientation?: 'top-bottom' | 'bottom-top' | 'left-right' | 'right-left';
    /** 连接线类型：'straight' 直线 | 'curved' 曲线，默认 'curved' */
    edgeType?: 'straight' | 'curved';
    /** 连接线颜色模式：'solid' 单色 | 'gradient' 渐变色，默认 'gradient' */
    edgeColorMode?: 'solid' | 'gradient';
    /** 连接线宽度，默认 2 */
    edgeWidth?: number;
    /** 连接线样式：'solid' 实线 | 'dashed' 虚线，默认 'solid' */
    edgeStyle?: 'solid' | 'dashed';
    /** 虚线样式（仅当 edgeStyle 为 'dashed' 时生效），默认 '5,5' */
    edgeDashPattern?: string;
    /** 直线拐角圆角半径（仅当 edgeType 为 'straight' 时生效），默认 0 */
    edgeCornerRadius?: number;
    /** 连接线与节点的间隔距离，默认 0 */
    edgeOffset?: number;
    /** 多子节点时连接线起点模式：'center' 从父节点中心出发 | 'distributed' 从父节点底部分散出发，默认 'center' */
    edgeOrigin?: 'center' | 'distributed';
    /** 分布式起点的内边距（仅当 edgeOrigin 为 'distributed' 时生效），默认 0 */
    edgeOriginPadding?: number;
    /** 连接线标记类型：'none' 无标记 | 'dot' 连接点 | 'arrow' 箭头，默认 'dot' */
    edgeMarker?: 'none' | 'dot' | 'arrow';
    /** 标记大小（点的半径或箭头的大小），默认 6 */
    markerSize?: number;
    /**
     * 节点着色模式：
     * - 'level': 按层级着色，同一层级的节点使用相同颜色
     * - 'branch': 按分支着色，根节点使用第一个颜色，二级节点及其子树使用不同颜色
     * - 'group': 按分组着色，datum.group 相同的节点使用相同颜色
     * - 'node-flat': 按节点着色，每个节点使用不同颜色
     * 默认 'branch'
     */
    colorMode?: HierarchyColorMode;
}
export declare const HierarchyTree: ComponentType<HierarchyTreeProps>;
