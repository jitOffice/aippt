import { type PieArcDatum } from 'd3';
import type { ComponentType } from '../../jsx';
import { ItemDatum } from '../../types';
import type { BaseStructureProps } from './types';
export interface ChartPieProps extends BaseStructureProps {
    radius?: number;
    innerRadius?: number;
    padding?: number;
    showPercentage?: boolean;
    avoidLabelOverlap?: boolean;
    minShowLabelPercent?: number | string;
}
export declare const ChartPie: ComponentType<ChartPieProps>;
export interface LabelItem {
    arcDatum: PieArcDatum<ItemDatum>;
    originalIndex: number;
    /** 标签中心点 Y 坐标 */
    y: number;
    x: number;
    height: number;
    isRight: boolean;
    color: string;
}
/**
 * 核心避障逻辑：蜘蛛腿算法 (Spider Leg Layout)
 *
 * 注意：y 坐标表示标签的中心点坐标
 *
 * @param items 待处理的标签数组（y 为中心点坐标）
 * @param spacing 垂直最小间距（标签边缘之间的间距）
 * @param minY 标签中心点的上边界
 * @param maxY 标签中心点的下边界
 */
export declare function distributeLabels(items: LabelItem[], spacing: number, minY: number, maxY: number): LabelItem[];
