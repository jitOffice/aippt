import { Simulation } from 'd3-force';
import { ID } from '../../types/id.js';
import { Position } from '../../types/position.js';
import { BaseLayoutWithIterations } from '../base-layout.js';
import { D3ForceCommonOptions, D3ForceLayoutOptions, NodeDatum, EdgeDatum } from './types.js';

declare class D3ForceLayout<T extends D3ForceCommonOptions = D3ForceLayoutOptions, N extends NodeDatum = NodeDatum, E extends EdgeDatum<N> = EdgeDatum<N>> extends BaseLayoutWithIterations<T> {
    id: string;
    simulation: Simulation<N, E>;
    private d3Nodes;
    private d3Edges;
    protected config: {
        simulationAttrs: string[];
    };
    protected getDefaultOptions(): T;
    protected mergeOptions<T>(base: T, patch?: Partial<T>): T;
    constructor(options?: Partial<T>);
    stop(): this;
    tick(iterations?: number): this;
    restart(alpha?: number): this;
    reheat(): this;
    getAlpha(): number;
    setAlpha(alpha: number): this;
    getForce(name: string): any;
    force(name: string, force: any): this;
    nodes(): N[];
    find(x: number, y: number, radius?: number): N | undefined;
    setFixedPosition(id: ID, position: Position | null[] | null): void;
    protected parseOptions(options: Partial<T>): T;
    protected layout(): Promise<void>;
    private createD3Copies;
    protected syncPositionsFromD3(): void;
    protected initSimulation(): Simulation<N, E>;
    protected setSimulation(options: T): Simulation<N, E>;
    protected setupForces(simulation: Simulation<N, E>, options: T): void;
    private getCenterOptions;
    protected setupCenterForce(simulation: Simulation<N, E>, options: T): void;
    private getManyBodyOptions;
    protected setupManyBodyForce(simulation: Simulation<N, E>, options: T): void;
    private getLinkOptions;
    protected setupLinkForce(simulation: Simulation<N, E>, options: T): void;
    private getCollisionOptions;
    protected setupCollisionForce(simulation: Simulation<N, E>, options: T): void;
    private getXForceOptions;
    protected setupXForce(simulation: Simulation<N, E>, options: T): void;
    private getYForceOptions;
    protected setupYForce(simulation: Simulation<N, E>, options: T): void;
    private getRadialOptions;
    protected setupRadialForce(simulation: Simulation<N, E>, options: T): void;
    protected setupClusterForce(simulation: Simulation<N, E>, options: T): void;
}

export { D3ForceLayout, D3ForceLayoutOptions };
