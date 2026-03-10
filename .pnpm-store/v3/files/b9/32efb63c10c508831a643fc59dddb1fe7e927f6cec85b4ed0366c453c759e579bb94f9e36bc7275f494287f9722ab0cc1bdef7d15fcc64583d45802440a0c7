import type { Element } from '../../types';
import type { ElementProps, ICommand, IStateManager } from '../types';
export declare class UpdateElementCommand implements ICommand {
    private element;
    private modified;
    private original?;
    constructor(element: Element, modified: Partial<ElementProps>, original?: Partial<ElementProps>);
    apply(state: IStateManager): Promise<void>;
    undo(state: IStateManager): Promise<void>;
    serialize(): {
        type: string;
        elementId: string;
        modified: Partial<ElementProps>;
        original: Partial<ElementProps> | undefined;
    };
}
