import { a as defaultCustomTagIcons, c as ShikiTwoslashError, i as defaultCompletionIcons, n as rendererRich, o as TwoslashIncludesManager, r as rendererClassic, s as parseIncludeMeta, t as defaultHoverInfoProcessor } from "./renderer-rich-DEkszi0Z.mjs";
import { splitTokens } from "@shikijs/core";

//#region src/core.ts
function defaultTwoslashOptions() {
	return {
		customTags: [
			"annotate",
			"log",
			"warn",
			"error"
		],
		compilerOptions: { moduleResolution: 100 }
	};
}
function createTransformerFactory(defaultTwoslasher, defaultRenderer) {
	return function transformerTwoslash(options = {}) {
		const { langs = ["ts", "tsx"], twoslashOptions = defaultTwoslashOptions(), langAlias = {
			typescript: "ts",
			json5: "json",
			yml: "yaml"
		}, twoslasher = defaultTwoslasher, explicitTrigger = false, disableTriggers = ["notwoslash", "no-twoslash"], renderer = defaultRenderer, throws = true, includesMap = /* @__PURE__ */ new Map(), typesCache } = options;
		const onTwoslashError = options.onTwoslashError || (throws ? (error) => {
			throw error;
		} : () => false);
		const onShikiError = options.onShikiError || (throws ? (error) => {
			throw error;
		} : () => false);
		const trigger = explicitTrigger instanceof RegExp ? explicitTrigger : /\btwoslash\b/;
		if (!renderer) throw new ShikiTwoslashError("Missing renderer");
		const map = /* @__PURE__ */ new WeakMap();
		const { filter = (lang, _, options) => {
			return langs.includes(lang) && (!explicitTrigger || trigger.test(options.meta?.__raw || "")) && !disableTriggers.some((i) => typeof i === "string" ? options.meta?.__raw?.includes(i) : i.test(options.meta?.__raw || ""));
		} } = options;
		const includes = new TwoslashIncludesManager(includesMap);
		let _twoslasher = twoslasher;
		if (typesCache) {
			_twoslasher = ((code, lang, options, meta) => {
				const preprocessed = typesCache?.preprocess?.(code, lang, options, meta);
				if (preprocessed !== void 0) code = preprocessed;
				let twoslash = typesCache?.read(code, lang, options, meta);
				if (!twoslash) {
					twoslash = twoslasher(code, lang, options);
					typesCache?.write(code, twoslash, lang, options, meta);
				}
				return twoslash;
			});
			typesCache.init?.();
		}
		return {
			preprocess(code) {
				let lang = this.options.lang;
				if (lang in langAlias) lang = langAlias[this.options.lang];
				if (filter(lang, code, this.options, this)) try {
					const codeWithIncludes = includes.applyInclude(code);
					const include = parseIncludeMeta(this.options.meta?.__raw);
					if (include) includes.add(include, codeWithIncludes);
					const twoslash = _twoslasher(codeWithIncludes, lang, twoslashOptions, this.meta);
					map.set(this.meta, twoslash);
					this.meta.twoslash = twoslash;
					this.options.lang = twoslash.meta?.extension || lang;
					return twoslash.code;
				} catch (error) {
					const result = onTwoslashError(error, code, lang, this.options);
					if (typeof result === "string") return result;
				}
			},
			tokens(tokens) {
				const twoslash = map.get(this.meta);
				if (!twoslash) return;
				return splitTokens(tokens, twoslash.nodes.flatMap((i) => [
					"hover",
					"error",
					"query",
					"highlight",
					"completion"
				].includes(i.type) ? [i.start, i.start + i.length] : []));
			},
			pre(pre) {
				if (!map.get(this.meta)) return;
				this.addClassToHast(pre, "twoslash lsp");
			},
			code(codeEl) {
				const twoslash = map.get(this.meta);
				if (!twoslash) return;
				const insertAfterLine = (line, nodes) => {
					if (!nodes.length) return;
					let index;
					if (line >= this.lines.length) index = codeEl.children.length;
					else {
						const lineEl = this.lines[line];
						index = codeEl.children.indexOf(lineEl);
						if (index === -1) {
							onShikiError(new ShikiTwoslashError(`Cannot find line ${line} in code element`), this.source, this.options.lang);
							return;
						}
					}
					const nodeAfter = codeEl.children[index + 1];
					if (nodeAfter && nodeAfter.type === "text" && nodeAfter.value === "\n") codeEl.children.splice(index + 1, 1);
					codeEl.children.splice(index + 1, 0, ...nodes);
				};
				const tokensMap = [];
				this.lines.forEach((lineEl, line) => {
					let index = 0;
					for (const token of lineEl.children.flatMap((i) => i.type === "element" ? i.children || [] : [])) if ("value" in token && typeof token.value === "string") {
						tokensMap.push([
							line,
							index,
							index + token.value.length,
							token
						]);
						index += token.value.length;
					}
				});
				const locateTextTokens = (line, character, length) => {
					const start = character;
					const end = character + length;
					if (length === 0) return tokensMap.filter(([l, s, e]) => l === line && s < start && start <= e).map((i) => i[3]);
					return tokensMap.filter(([l, s, e]) => l === line && start <= s && s < end && start < e && e <= end).map((i) => i[3]);
				};
				const tokensSkipHover = /* @__PURE__ */ new Set();
				const actionsHovers = [];
				const actionsHighlights = [];
				for (const node of twoslash.nodes) {
					if (node.type === "tag") {
						if (renderer.lineCustomTag) insertAfterLine(node.line, renderer.lineCustomTag.call(this, node));
						continue;
					}
					const tokens = locateTextTokens(node.line, node.character, node.length);
					if (!tokens.length && !(node.type === "error" && renderer.nodesError)) {
						onShikiError(new ShikiTwoslashError(`Cannot find tokens for node: ${JSON.stringify(node)}`), this.source, this.options.lang);
						continue;
					}
					const wrapTokens = (fn) => {
						const line = this.lines[node.line];
						let charIndex = 0;
						let itemStart = line.children.length;
						let itemEnd = 0;
						line.children.forEach((token, index) => {
							if (charIndex >= node.character && index < itemStart) itemStart = index;
							if (charIndex <= node.character + node.length && index > itemEnd) itemEnd = index;
							charIndex += getTokenString(token).length;
						});
						if (charIndex <= node.character + node.length) itemEnd = line.children.length;
						const targets = line.children.slice(itemStart, itemEnd);
						const length = targets.length;
						line.children.splice(itemStart, length, ...fn(targets));
					};
					switch (node.type) {
						case "error":
							if (renderer.nodeError) tokens.forEach((token) => {
								tokensSkipHover.add(token);
								const clone = { ...token };
								Object.assign(token, renderer.nodeError.call(this, node, clone));
							});
							if (renderer.nodesError) {
								tokens.forEach((token) => {
									tokensSkipHover.add(token);
								});
								actionsHighlights.push(() => {
									wrapTokens((targets) => renderer.nodesError?.call(this, node, targets) || targets);
								});
							}
							if (renderer.lineError) insertAfterLine(node.line, renderer.lineError.call(this, node));
							break;
						case "query": {
							const token = tokens[0];
							if (token && renderer.nodeQuery) {
								tokensSkipHover.add(token);
								const clone = { ...token };
								Object.assign(token, renderer.nodeQuery.call(this, node, clone));
							}
							if (renderer.lineQuery) insertAfterLine(node.line, renderer.lineQuery.call(this, node, token));
							break;
						}
						case "completion":
							if (renderer.nodeCompletion) tokens.forEach((token) => {
								tokensSkipHover.add(token);
								const clone = { ...token };
								Object.assign(token, renderer.nodeCompletion.call(this, node, clone));
							});
							if (renderer.lineCompletion) insertAfterLine(node.line, renderer.lineCompletion.call(this, node));
							break;
						case "highlight":
							if (renderer.nodesHighlight) actionsHighlights.push(() => {
								wrapTokens((targets) => renderer.nodesHighlight?.call(this, node, targets) || targets);
							});
							break;
						case "hover":
							if (renderer.nodeStaticInfo) actionsHovers.push(() => {
								tokens.forEach((token) => {
									if (tokensSkipHover.has(token)) return;
									tokensSkipHover.add(token);
									const clone = { ...token };
									Object.assign(token, renderer.nodeStaticInfo.call(this, node, clone));
								});
							});
							break;
						default: onShikiError(new ShikiTwoslashError(`Unknown node type: ${node?.type}`), this.source, this.options.lang);
					}
				}
				actionsHovers.forEach((i) => i());
				actionsHighlights.forEach((i) => i());
			}
		};
	};
}
function getTokenString(token) {
	if ("value" in token) return token.value;
	return token.children?.map(getTokenString).join("") || "";
}

//#endregion
export { ShikiTwoslashError, createTransformerFactory, defaultCompletionIcons, defaultCustomTagIcons, defaultHoverInfoProcessor, defaultTwoslashOptions, rendererClassic, rendererRich };