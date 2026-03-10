//#region src/async.ts
function setupMarkdownWithCodeToHtml(markdownit, codeToHtml, options) {
	const { parseMetaString, trimEndingNewline = true, defaultLanguage = "text" } = options;
	markdownit.options.highlight = async (code, lang = "text", attrs) => {
		if (lang === "") lang = defaultLanguage;
		const meta = parseMetaString?.(attrs, code, lang) || {};
		const codeOptions = {
			...options,
			lang,
			meta: {
				...options.meta,
				...meta,
				__raw: attrs
			}
		};
		const builtInTransformer = [];
		builtInTransformer.push({
			name: "@shikijs/markdown-it:block-class",
			code(node) {
				node.properties.class = `language-${lang}`;
			}
		});
		if (trimEndingNewline) {
			if (code.endsWith("\n")) code = code.slice(0, -1);
		}
		return await codeToHtml(code, {
			...codeOptions,
			transformers: [...builtInTransformer, ...codeOptions.transformers || []]
		});
	};
}
/**
* Create a markdown-it-async plugin from a codeToHtml function.
*
* This plugin requires to be installed against a markdown-it-async instance.
*/
function fromAsyncCodeToHtml(codeToHtml, options) {
	return async function(markdownit) {
		return setupMarkdownWithCodeToHtml(markdownit, codeToHtml, options);
	};
}

//#endregion
export { fromAsyncCodeToHtml, setupMarkdownWithCodeToHtml };