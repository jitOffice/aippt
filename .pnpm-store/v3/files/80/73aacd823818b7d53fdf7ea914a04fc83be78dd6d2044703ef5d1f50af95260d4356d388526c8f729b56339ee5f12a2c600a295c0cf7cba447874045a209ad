import * as solid_js from 'solid-js';
import { JSX } from 'solid-js';
import { HighlighterCore } from 'shiki/core';
import { MagicMoveRenderOptions, MagicMoveDifferOptions, KeyedTokensInfo } from './types.mjs';
import 'diff-match-patch-es';

interface ShikiMagicMoveProps {
    highlighter: HighlighterCore;
    lang: string;
    theme: string;
    code: string;
    options?: MagicMoveRenderOptions & MagicMoveDifferOptions;
    onStart?: () => void;
    onEnd?: () => void;
    class?: string;
    tabindex?: number;
}
declare function ShikiMagicMove(props: ShikiMagicMoveProps): solid_js.JSX.Element;

interface ShikiMagicMovePrecompiledProps {
    steps: KeyedTokensInfo[];
    step?: number;
    animate?: boolean;
    options?: MagicMoveRenderOptions & MagicMoveDifferOptions;
    onStart?: () => void;
    onEnd?: () => void;
}
/**
 * Component to render a compiled magic move step,
 * Where the tokens can be generated on build time.
 */
declare function ShikiMagicMovePrecompiled(props: ShikiMagicMovePrecompiledProps): solid_js.JSX.Element;

/** @jsxImportSource solid-js */

interface ShikiMagicMoveRendererProps {
    animate?: boolean;
    tokens: KeyedTokensInfo;
    previous?: KeyedTokensInfo;
    options?: MagicMoveRenderOptions;
    onStart?: () => void;
    onEnd?: () => void;
    class?: string;
    style?: JSX.CSSProperties;
}
/**
 * A wrapper component to `MagicMoveRenderer`
 */
declare function ShikiMagicMoveRenderer(props: ShikiMagicMoveRendererProps): JSX.Element;

export { ShikiMagicMove, ShikiMagicMovePrecompiled, ShikiMagicMoveRenderer };
