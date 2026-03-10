import { ID } from '../../types/id.js';
import { NullablePosition } from '../../types/position.js';
import { BaseLayoutWithIterations } from '../base-layout.js';
import { FruchtermanLayoutOptions, ParsedFruchtermanLayoutOptions } from './types.js';

declare class FruchtermanLayout extends BaseLayoutWithIterations<FruchtermanLayoutOptions> {
    id: string;
    private simulation;
    protected getDefaultOptions(): Partial<FruchtermanLayoutOptions>;
    protected parseOptions(options?: Partial<FruchtermanLayoutOptions>): ParsedFruchtermanLayoutOptions;
    protected layout(): Promise<void>;
    private setSimulation;
    restart(): void;
    stop(): void;
    tick(iterations?: number): void;
    setFixedPosition(id: ID, position: NullablePosition | null): void;
    destroy(): void;
}

export { FruchtermanLayout, FruchtermanLayoutOptions };
