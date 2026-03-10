import { n as MarkdownItShikiSetupOptions, t as MarkdownItShikiExtraOptions } from "./common-CiaeKkQk.mjs";
import { fromHighlighter, setupMarkdownIt } from "./core.mjs";
import { BuiltinLanguage, LanguageInput } from "shiki";
import MarkdownIt from "markdown-it";

//#region src/index.d.ts
type MarkdownItShikiOptions = MarkdownItShikiSetupOptions & {
  /**
   * Language names to include.
   *
   * @default Object.keys(bundledLanguages)
   */
  langs?: Array<LanguageInput | BuiltinLanguage>;
  /**
   * Alias of languages
   * @example { 'my-lang': 'javascript' }
   */
  langAlias?: Record<string, string>;
};
declare function markdownItShiki(options: MarkdownItShikiOptions): Promise<(markdownit: MarkdownIt) => void>;
//#endregion
export { MarkdownItShikiExtraOptions, MarkdownItShikiOptions, MarkdownItShikiSetupOptions, markdownItShiki as default, fromHighlighter, setupMarkdownIt };