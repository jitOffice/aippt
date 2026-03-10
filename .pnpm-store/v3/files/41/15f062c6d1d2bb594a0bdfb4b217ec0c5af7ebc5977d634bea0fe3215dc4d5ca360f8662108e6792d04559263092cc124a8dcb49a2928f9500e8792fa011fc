import { fromHighlighter, setupMarkdownIt } from "./core.mjs";
import { bundledLanguages, createHighlighter } from "shiki";

//#region src/index.ts
async function markdownItShiki(options) {
	const highlighter = await createHighlighter({
		themes: ("themes" in options ? Object.values(options.themes) : [options.theme]).filter(Boolean),
		langs: options.langs || Object.keys(bundledLanguages),
		langAlias: options.langAlias || {}
	});
	return function(markdownit) {
		setupMarkdownIt(markdownit, highlighter, options);
	};
}

//#endregion
export { markdownItShiki as default, fromHighlighter, setupMarkdownIt };