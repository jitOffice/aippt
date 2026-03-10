import { TextElement } from '../../../types';
import type { IPlugin, PluginInitOptions, Selection } from '../../types';
import { Plugin } from '../base';
export interface EditBarOptions {
    style?: Partial<CSSStyleDeclaration>;
    className?: string;
    getContainer?: HTMLElement | (() => HTMLElement);
}
type EditItem = HTMLElement;
export declare class EditBar extends Plugin implements IPlugin {
    private options?;
    name: string;
    private container?;
    private selection;
    constructor(options?: EditBarOptions | undefined);
    init(options: PluginInitOptions): void;
    destroy(): void;
    private handleSelectionChanged;
    private handleGeometryChanged;
    private handleHistoryChanged;
    protected getEditItems(selection: Selection): HTMLElement[];
    protected getOrCreateEditBar(): HTMLDivElement;
    protected getTextEditItems(text: TextElement): EditItem[];
    protected getTextCollectionEditItems(selection: TextElement[]): EditItem[];
    protected getIconEditItems(selection: Selection): EditItem[];
    protected getIconCollectionEditItems(selection: Selection): EditItem[];
    protected getGeometryEditItems(_selection: Selection): EditItem[];
    protected getGeometryCollectionEditItems(selection: Selection): EditItem[];
    protected getElementCollectionEditItems(selection: Selection): EditItem[];
    private placeEditBar;
}
export {};
