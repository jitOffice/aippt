import type { ComponentType } from '../../jsx';
import type { RelationEdgeDatum } from '../../types';
import type { BaseStructureProps } from './types';
/**
 * 泳道内的节点数据
 */
export interface InteractionChildDatum {
    id: string;
    label?: string;
    desc?: string;
    icon?: string;
    /**
     * 手动指定节点的垂直顺序（层级），默认为数组索引
     * 相同 step 的节点会处于同一高度
     */
    step?: number;
}
/**
 * 泳道数据（顶层item）
 * label 作为泳道标题
 * children 作为泳道内的节点列表
 */
export interface InteractionLaneDatum {
    label: string;
    desc?: string;
    icon?: string;
    children?: InteractionChildDatum[];
}
/**
 * 交互流程的数据结构
 * items: 泳道列表，每个泳道有 label 和 children
 * relations: 节点间的关系
 */
export interface InteractionFlowData {
    title?: string;
    desc?: string;
    items?: InteractionLaneDatum[];
    relations?: RelationEdgeDatum[];
}
export interface SequenceInteractionProps extends BaseStructureProps {
    laneGap?: number;
    nodeGap?: number;
    lifelineWidth?: number;
    arrowWidth?: number;
    showLifeline?: boolean;
    padding?: number;
    arrowType?: 'arrow' | 'triangle';
    showLaneHeader?: boolean;
    laneHeaderHeight?: number;
    edgeStyle?: 'solid' | 'dashed';
    animated?: boolean;
    edgeColorMode?: 'solid' | 'gradient';
}
export declare const SequenceInteractionFlow: ComponentType<SequenceInteractionProps>;
