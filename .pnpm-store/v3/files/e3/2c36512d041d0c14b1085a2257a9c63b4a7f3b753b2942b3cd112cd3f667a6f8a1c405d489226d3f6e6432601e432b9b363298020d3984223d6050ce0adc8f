import * as d3 from 'd3';
import type { ComponentType } from '../../jsx';
import type { BaseStructureProps } from './types';
export interface NetworkNode extends d3.SimulationNodeDatum {
    id: number;
    data: any;
    isCenter: boolean;
    _originalIndex: number[];
}
export interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
    source: number | NetworkNode;
    target: number | NetworkNode;
}
export interface RelationNetworkProps extends BaseStructureProps {
    spacing?: number;
    showConnections?: boolean;
}
export declare const RelationNetwork: ComponentType<RelationNetworkProps>;
