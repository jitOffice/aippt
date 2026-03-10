import { BaseSimulation } from '../base-simulation.js';
import { ID } from '../../types/id.js';
import { NullablePosition } from '../../types/position.js';
import { GraphLib } from '../../model/data.js';
import { ParsedForceAtlas2LayoutOptions, ForceAtlas2LayoutOptions } from './types.js';

type SizeMap = Record<string, number>;
/**
 * ForceAtlas2 Simulation
 */
declare class Simulation extends BaseSimulation<ParsedForceAtlas2LayoutOptions> {
    private sg;
    private forces;
    private preForces;
    private bodies;
    private sizes;
    private maxIteration;
    protected model: GraphLib;
    data(model: GraphLib, sizes: SizeMap): this;
    initialize(options: Required<ForceAtlas2LayoutOptions>): void;
    private initForces;
    /**
     * Set a node's fixed position
     */
    setFixedPosition(id: ID, position: NullablePosition | null): void;
    private isNodeFixed;
    private syncFixedPositions;
    /**
     * Execute one step of the simulation
     */
    protected runOneStep(): number;
    private calculateAttractive;
    private calculateOptRepulsiveGravity;
    private calculateRepulsiveGravity;
    private updatePositions;
    destroy(): void;
}

export { Simulation };
