import type { UpdatableInfographicOptions } from '../../options';
import type { ICommand, IStateManager } from '../types';
export declare class UpdateOptionsCommand implements ICommand {
    private options;
    private original?;
    constructor(options: UpdatableInfographicOptions, original?: UpdatableInfographicOptions | undefined);
    apply(state: IStateManager): Promise<void>;
    undo(state: IStateManager): Promise<void>;
    serialize(): {
        type: string;
        options: Partial<Omit<import("../../options").ParsedInfographicOptions, "container">>;
        original: Partial<Omit<import("../../options").ParsedInfographicOptions, "container">> | undefined;
    };
}
