import { BaseSimulation } from '../base-simulation.js';
import { NullablePosition } from '../../types/position.js';
import { GraphLib } from '../../model/data.js';
import { ParsedForceLayoutOptions, AccMap } from './types.js';

interface Force {
    (model: GraphLib, accMap: AccMap): void;
    [key: string]: any;
}
declare class ForceSimulation extends BaseSimulation<ParsedForceLayoutOptions> {
    private forces;
    private velMap;
    protected model: GraphLib;
    data(model: GraphLib): this;
    force(name: string, force?: Force | null): Force | null;
    protected runOneStep(): number;
    setFixedPosition(nodeId: string, position: NullablePosition | null): void;
    private updateVelocity;
    private updatePosition;
    private monitor;
}

export { ForceSimulation };
