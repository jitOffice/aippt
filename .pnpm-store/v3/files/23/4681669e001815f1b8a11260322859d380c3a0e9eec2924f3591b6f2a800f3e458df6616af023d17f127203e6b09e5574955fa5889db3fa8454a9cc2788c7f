import { ID } from '../../types/id.js';
import { NullablePosition } from '../../types/position.js';
import { BaseLayoutWithIterations } from '../base-layout.js';
import { Simulation } from './simulation.js';
import { ForceAtlas2LayoutOptions } from './types.js';

declare class ForceAtlas2Layout extends BaseLayoutWithIterations<ForceAtlas2LayoutOptions> {
    id: string;
    simulation: Simulation | null;
    protected getDefaultOptions(): Partial<ForceAtlas2LayoutOptions>;
    protected layout(options: ForceAtlas2LayoutOptions): Promise<void>;
    private getSizes;
    private setSimulation;
    private parseOptions;
    stop(): void;
    tick(iterations?: number): void;
    restart(): void;
    setFixedPosition(id: ID, position: NullablePosition | null): void;
    destroy(): void;
}

export { ForceAtlas2Layout, ForceAtlas2LayoutOptions };
