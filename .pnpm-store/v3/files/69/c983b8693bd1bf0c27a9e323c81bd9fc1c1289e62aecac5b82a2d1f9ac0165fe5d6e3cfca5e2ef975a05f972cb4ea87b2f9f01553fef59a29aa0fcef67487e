import type { ICommand, IStateManager } from '../types';
export declare class BatchCommand implements ICommand {
    private commands;
    constructor(commands: ICommand[]);
    apply(state: IStateManager): Promise<void>;
    undo(state: IStateManager): Promise<void>;
    serialize(): {
        type: string;
        commands: any[];
    };
}
