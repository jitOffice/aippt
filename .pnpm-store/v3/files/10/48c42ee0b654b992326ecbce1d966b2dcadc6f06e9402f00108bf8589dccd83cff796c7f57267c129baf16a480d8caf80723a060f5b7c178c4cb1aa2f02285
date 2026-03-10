import { n as MarkdownItShikiSetupOptions, t as MarkdownItShikiExtraOptions } from "./common-CiaeKkQk.mjs";
import { CodeToHastOptions } from "shiki";
import { MarkdownItAsync } from "markdown-it-async";

//#region src/async.d.ts
declare function setupMarkdownWithCodeToHtml(markdownit: MarkdownItAsync, codeToHtml: (code: string, options: CodeToHastOptions<any, any>) => Promise<string>, options: MarkdownItShikiSetupOptions): void;
/**
 * Create a markdown-it-async plugin from a codeToHtml function.
 *
 * This plugin requires to be installed against a markdown-it-async instance.
 */
declare function fromAsyncCodeToHtml(codeToHtml: (code: string, options: CodeToHastOptions<any, any>) => Promise<string>, options: MarkdownItShikiSetupOptions): (markdownit: MarkdownItAsync) => Promise<void>;
//#endregion
export { type MarkdownItShikiExtraOptions, type MarkdownItShikiSetupOptions, fromAsyncCodeToHtml, setupMarkdownWithCodeToHtml };