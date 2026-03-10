import { HighlighterCore } from 'shiki/core';
import { KeyedTokensInfo, MagicMoveRenderOptions, MagicMoveDifferOptions } from './types.js';
import 'diff-match-patch-es';

declare class ShikiMagicMoveRenderer extends HTMLElement {
    private _animated;
    private _tokens;
    private _previous?;
    private _options?;
    private _class;
    get animated(): boolean;
    set animated(value: boolean);
    get tokens(): KeyedTokensInfo;
    set tokens(value: KeyedTokensInfo);
    get previous(): KeyedTokensInfo | undefined;
    set previous(value: KeyedTokensInfo);
    get options(): MagicMoveRenderOptions | undefined;
    set options(value: MagicMoveRenderOptions | undefined);
    get class(): string;
    set class(value: string);
    private container?;
    private renderer?;
    private batchUpdate;
    private hasUpdated;
    constructor();
    connectedCallback(): void;
    propertyChangedCallback(): void;
    transform(): Promise<void>;
}

declare class ShikiMagicMove extends HTMLElement {
    private _highlighter;
    private _lang;
    private _theme;
    private _code;
    private _class?;
    private _options?;
    get highlighter(): HighlighterCore;
    set highlighter(value: HighlighterCore);
    get lang(): string;
    set lang(value: string);
    get theme(): string;
    set theme(value: string);
    get code(): string;
    set code(value: string);
    get class(): string | undefined;
    set class(value: string | undefined);
    get options(): (MagicMoveRenderOptions & MagicMoveDifferOptions) | undefined;
    set options(value: MagicMoveRenderOptions & MagicMoveDifferOptions | undefined);
    private machine?;
    private renderer?;
    private result?;
    private batchUpdate;
    private hasUpdated;
    constructor();
    connectedCallback(): void;
    propertyChangedCallback(): void;
    updateRenderer(): void;
}

declare class ShikiMagicMovePrecompiled extends HTMLElement {
    private _steps;
    private _step;
    private _animated;
    private _options?;
    get steps(): KeyedTokensInfo[];
    set steps(value: KeyedTokensInfo[]);
    get step(): number;
    set step(value: number);
    get animated(): boolean;
    set animated(value: boolean);
    get options(): MagicMoveRenderOptions & MagicMoveDifferOptions | undefined;
    set options(value: MagicMoveRenderOptions & MagicMoveDifferOptions);
    private renderer?;
    private previous;
    private batchUpdate;
    private hasUpdated;
    constructor();
    connectedCallback(): void;
    propertyChangedCallback(): void;
    updateRenderer(): void;
}

export { ShikiMagicMove, ShikiMagicMovePrecompiled, ShikiMagicMoveRenderer };
