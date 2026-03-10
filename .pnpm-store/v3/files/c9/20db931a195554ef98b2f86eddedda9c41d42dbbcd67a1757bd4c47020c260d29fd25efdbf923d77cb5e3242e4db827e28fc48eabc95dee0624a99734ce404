import type { CommandManagerInitOptions, ICommand, ICommandManager } from '../types';
export declare class CommandManager implements ICommandManager {
    private emitter;
    private state;
    private undoStack;
    private redoStack;
    init(options: CommandManagerInitOptions): void;
    execute(command: ICommand): Promise<void>;
    executeBatch(commands: ICommand[]): Promise<void>;
    undo(): Promise<void>;
    redo(): Promise<void>;
    serialize(): any[];
    clear(): void;
    canUndo(): boolean;
    canRedo(): boolean;
    getHistorySize(): number;
    destroy(): void;
    private emitHistoryChange;
}
