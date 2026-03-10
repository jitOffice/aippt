import type { TextElement } from '../../types';
import type { ICommand, IStateManager } from '../types';
export declare class UpdateTextCommand implements ICommand {
    private element;
    private originalText;
    private modifiedText;
    constructor(element: TextElement, newText: string, originalText?: string);
    apply(state: IStateManager): Promise<void>;
    undo(state: IStateManager): Promise<void>;
    serialize(): {
        type: string;
        elementId: string;
        original: string;
        modified: string;
    };
}
