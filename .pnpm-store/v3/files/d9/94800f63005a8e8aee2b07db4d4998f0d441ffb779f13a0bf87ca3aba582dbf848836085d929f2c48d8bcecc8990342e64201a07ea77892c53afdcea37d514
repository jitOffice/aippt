import { Expr } from '../../types/common.js';
import { D3ForceCommonOptions, NodeDatum as NodeDatum$1, EdgeDatum as EdgeDatum$1 } from '../d3-force/types.js';

/**
 * @see https://github.com/vasturiano/d3-force-3d
 */
interface D3Force3DLayoutOptions extends D3ForceCommonOptions {
    numDimensions?: 3;
    /**
     * <zh/> 中心力
     *
     * <en/> Center force
     */
    center?: false | {
        x?: number;
        y?: number;
        z?: number;
        strength?: number;
    };
    /**
     * <zh/> 径向力
     *
     * <en/> Radial force
     */
    radial?: false | {
        strength?: number | Expr | ((node: NodeDatum, index: number, nodes: NodeDatum[]) => number);
        radius?: number | Expr | ((node: NodeDatum, index: number, nodes: NodeDatum[]) => number);
        x?: number;
        y?: number;
        z?: number;
    };
    /**
     * <zh/> Z 轴力
     *
     * <en/> Z axis force
     */
    z?: false | {
        strength?: number | Expr | ((node: NodeDatum, index: number, nodes: NodeDatum[]) => number);
        z?: number | Expr | ((node: NodeDatum, index: number, nodes: NodeDatum[]) => number);
    };
}
interface NodeDatum extends NodeDatum$1 {
    z: number;
    vz: number;
}
interface EdgeDatum extends Omit<EdgeDatum$1, 'source' | 'target'> {
    source: NodeDatum | string | number;
    target: NodeDatum | string | number;
}

export type { D3Force3DLayoutOptions, EdgeDatum, NodeDatum };
