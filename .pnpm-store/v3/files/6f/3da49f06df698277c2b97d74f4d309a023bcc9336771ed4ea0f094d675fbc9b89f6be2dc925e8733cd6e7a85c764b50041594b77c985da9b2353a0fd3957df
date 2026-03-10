import { ShikiPrimitive, ThemeRegistrationResolved } from "@shikijs/types";
import * as monacoNs from "monaco-editor-core";

//#region src/index.d.ts
interface MonacoTheme extends monacoNs.editor.IStandaloneThemeData {}
interface ShikiToMonacoOptions {
  /**
   * The maximum length of a line to tokenize.
   *
   * @default 20000
   */
  tokenizeMaxLineLength?: number;
  /**
   * The time limit in milliseconds for tokenizing a line.
   *
   * @default 500
   */
  tokenizeTimeLimit?: number;
}
declare function textmateThemeToMonacoTheme(theme: ThemeRegistrationResolved): MonacoTheme;
declare function shikiToMonaco(highlighter: ShikiPrimitive<any, any>, monaco: typeof monacoNs, options?: ShikiToMonacoOptions): void;
//#endregion
export { MonacoTheme, ShikiToMonacoOptions, shikiToMonaco, textmateThemeToMonacoTheme };