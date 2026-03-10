import { createTransformerFactory } from "@shikijs/twoslash/core";
import { removeTwoslashNotations } from "twoslash";
import { createTwoslasher } from "twoslash-vue";
import { defaultHoverInfoProcessor, rendererRich } from "@shikijs/twoslash";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { defaultHandlers, toHast } from "mdast-util-to-hast";

//#region src/renderer-floating-vue.ts
function rendererFloatingVue(options = {}) {
	const { classCopyIgnore = "vp-copy-ignore", classFloatingPanel = "twoslash-floating", classMarkdown = "vp-doc", floatingVueTheme = "twoslash", floatingVueThemeQuery = "twoslash-query", floatingVueThemeCompletion = "twoslash-completion" } = options.floatingVue || {};
	const { errorRendering = "line" } = options;
	const hoverBasicProps = {
		"class": "twoslash-hover",
		"popper-class": [
			"shiki",
			classFloatingPanel,
			classCopyIgnore
		].join(" "),
		"theme": floatingVueTheme
	};
	return rendererRich({
		classExtra: classCopyIgnore,
		...options,
		renderMarkdown,
		renderMarkdownInline,
		hast: {
			hoverToken: {
				tagName: "v-menu",
				properties: hoverBasicProps
			},
			hoverCompose: compose,
			queryToken: {
				tagName: "v-menu",
				properties: {
					...hoverBasicProps,
					":shown": "true",
					"theme": floatingVueThemeQuery
				}
			},
			queryCompose: compose,
			popupDocs: { class: `twoslash-popup-docs ${classMarkdown}` },
			popupDocsTags: { class: `twoslash-popup-docs twoslash-popup-docs-tags ${classMarkdown}` },
			popupError: { class: `twoslash-popup-error ${classMarkdown}` },
			errorToken: errorRendering === "line" ? void 0 : {
				tagName: "v-menu",
				properties: {
					...hoverBasicProps,
					class: "twoslash-error twoslash-error-hover"
				}
			},
			errorCompose: compose,
			completionCompose({ popup, cursor }) {
				return [{
					type: "element",
					tagName: "v-menu",
					properties: {
						"popper-class": [
							"shiki twoslash-completion",
							classCopyIgnore,
							classFloatingPanel
						],
						"theme": floatingVueThemeCompletion,
						":shown": "true"
					},
					children: [cursor, {
						type: "element",
						tagName: "template",
						properties: { "v-slot:popper": "{}" },
						content: {
							type: "root",
							children: [vPre(popup)]
						}
					}]
				}];
			}
		}
	});
}
function vPre(el) {
	if (el.type === "element") {
		el.properties = el.properties || {};
		el.properties["v-pre"] = "";
	}
	return el;
}
function renderMarkdown(md) {
	return toHast(fromMarkdown(md.replace(/\{@link ([^}]*)\}/g, "$1"), { mdastExtensions: [gfmFromMarkdown()] }), { handlers: { code: (state, node) => {
		const lang = node.lang || "";
		if (lang) return {
			type: "element",
			tagName: "code",
			properties: {},
			children: this.codeToHast(node.value, {
				...this.options,
				transformers: [],
				lang,
				structure: node.value.trim().includes("\n") ? "classic" : "inline"
			}).children
		};
		return defaultHandlers.code(state, node);
	} } }).children;
}
function renderMarkdownInline(md, context) {
	if (context === "tag:param") md = md.replace(/^([\w$-]+)/, "`$1` ");
	const children = renderMarkdown.call(this, md);
	if (children.length === 1 && children[0].type === "element" && children[0].tagName === "p") return children[0].children;
	return children;
}
function compose(parts) {
	if (parts.token.type === "element" && parts.token.children.length < 1) {
		const classes = parts.token.properties.class || "";
		parts.token.properties.class = `${classes} twoslash-error-empty`;
	}
	return [{
		type: "element",
		tagName: "span",
		properties: {},
		children: [parts.token]
	}, {
		type: "element",
		tagName: "template",
		properties: { "v-slot:popper": "{}" },
		content: {
			type: "root",
			children: [vPre(parts.popup)]
		},
		children: []
	}];
}

//#endregion
//#region src/index.ts
/**
* Create a Shiki transformer for VitePress to enable twoslash integration
*
* Add this to `markdown.codeTransformers` in `.vitepress/config.ts`
*/
function transformerTwoslash(options = {}) {
	const { explicitTrigger = true } = options;
	const onError = (error, code) => {
		const isCI = typeof process !== "undefined" && process?.env?.CI;
		const isDev = typeof process !== "undefined" && process?.env?.NODE_ENV === "development";
		const shouldThrow = (options.throws || isCI || !isDev) && options.throws !== false;
		console.error(`\n\n--------\nTwoslash error in code:\n--------\n${code.split(/\n/g).slice(0, 15).join("\n").trim()}\n--------\n`);
		if (shouldThrow) throw error;
		else console.error(error);
		return removeTwoslashNotations(code);
	};
	const twoslash = createTransformerFactory(createTwoslasher(options.twoslashOptions))({
		langs: [
			"ts",
			"tsx",
			"js",
			"jsx",
			"json",
			"vue"
		],
		renderer: rendererFloatingVue(options),
		onTwoslashError: onError,
		onShikiError: onError,
		...options,
		explicitTrigger
	});
	const trigger = explicitTrigger instanceof RegExp ? explicitTrigger : /\btwoslash\b/;
	return {
		...twoslash,
		name: "@shikijs/vitepress-twoslash",
		preprocess(code, options) {
			const cleanup = options.transformers?.find((i) => i.name === "vitepress:clean-up");
			if (cleanup) options.transformers?.splice(options.transformers.indexOf(cleanup), 1);
			if (!explicitTrigger || options.meta?.__raw?.match(trigger)) {
				const vPre = options.transformers?.find((i) => i.name === "vitepress:v-pre");
				if (vPre) options.transformers?.splice(options.transformers.indexOf(vPre), 1);
			}
			return twoslash.preprocess.call(this, code, options);
		},
		postprocess(html) {
			if (this.meta.twoslash) return html.replace(/\{/g, "&#123;");
		}
	};
}

//#endregion
export { defaultHoverInfoProcessor, rendererFloatingVue, transformerTwoslash };