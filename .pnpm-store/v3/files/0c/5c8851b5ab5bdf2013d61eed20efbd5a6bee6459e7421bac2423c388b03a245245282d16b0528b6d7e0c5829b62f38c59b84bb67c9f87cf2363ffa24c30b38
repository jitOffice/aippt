import { transformerTwoslash } from "../index.mjs";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import process from "node:process";
import LZString from "lz-string";
import { hash } from "ohash";
import MagicString from "magic-string";
import MarkdownIt from "markdown-it";

//#region src/cache-inline/file-patcher.ts
var FilePatcher = class {
	files = /* @__PURE__ */ new Map();
	static key(from, to) {
		return `${from}${to ? `:${to}` : ""}`;
	}
	load(path) {
		let file = this.files.get(path);
		if (file === void 0) {
			if (existsSync(path)) file = {
				content: readFileSync(path, { encoding: "utf-8" }),
				patches: /* @__PURE__ */ new Map()
			};
			else file = null;
			this.files.set(path, file);
		}
		return file;
	}
	patch(path) {
		const file = this.files.get(path);
		if (file) {
			if (file.patches.size) {
				const s = new MagicString(file.content);
				for (const [key, value] of file.patches) {
					const [from, to] = key.split(":").map((s) => s !== "" ? Number(s) : void 0);
					if (from === void 0) continue;
					if (to !== void 0) s.update(from, to, value);
					else s.appendRight(from, value);
				}
				writeFileSync(path, s.toString(), { encoding: "utf-8" });
			}
			this.files.delete(path);
		}
	}
};

//#endregion
//#region src/cache-inline/cache-inline.ts
const CODE_INLINE_CACHE_KEY = "@twoslash-cache";
const CODE_INLINE_CACHE_REGEX = new RegExp(`// ${CODE_INLINE_CACHE_KEY}: (.*)(?:\n|$)`, "g");
function createInlineTypesCache({ remove, ignoreCache } = {}) {
	const patcher = new FilePatcher();
	const optionsHashCache = /* @__PURE__ */ new WeakMap();
	function getOptionsHash(options = {}) {
		let hash$1 = optionsHashCache.get(options);
		if (!hash$1) {
			hash$1 = hash(options);
			optionsHashCache.set(options, hash$1);
		}
		return hash$1;
	}
	function cacheHash(code, lang, options) {
		return sha256Hash(`${getOptionsHash(options)}:${lang ?? ""}:${code}`);
	}
	function stringifyCachePayload(data, code, lang, options) {
		const payload = {
			v: 1,
			hash: cacheHash(code, lang, options),
			data: LZString.compressToBase64(JSON.stringify(data))
		};
		return JSON.stringify(payload);
	}
	function resolveCachePayload(cache) {
		if (!cache) return null;
		try {
			const payload = JSON.parse(cache);
			if (payload.v === 1) return {
				payload,
				twoslash: () => {
					try {
						return JSON.parse(LZString.decompressFromBase64(payload.data));
					} catch {
						return null;
					}
				}
			};
		} catch {}
		return null;
	}
	function resolveSourcePatcher(source, search) {
		const file = patcher.load(source.path);
		if (file === null) return void 0;
		const range = { from: source.from };
		let linebreak = true;
		if (search) {
			const cachePos = file.content.indexOf(search, source.from);
			if (cachePos !== -1 && cachePos < source.to) {
				range.from = cachePos;
				range.to = cachePos + search.length;
				linebreak = search.endsWith("\n");
			}
		}
		const patchKey = FilePatcher.key(range.from, range.to);
		return (newCache) => {
			if (newCache === "") {
				if (range.to !== void 0) file.patches.set(patchKey, "");
				return;
			}
			file.patches.set(patchKey, newCache + (linebreak ? "\n" : ""));
		};
	}
	return {
		typesCache: {
			preprocess(code, lang, options, meta) {
				if (!meta) return;
				let rawCache = "";
				let cacheString = "";
				code = code.replaceAll(CODE_INLINE_CACHE_REGEX, (full, p1) => {
					if (!rawCache.length) {
						cacheString = p1;
						rawCache = full;
					}
					return "";
				});
				if (!ignoreCache && !remove) {
					const cache = resolveCachePayload(cacheString);
					if (cache?.payload.hash === cacheHash(code, lang, options)) {
						const twoslash = cache.twoslash();
						if (twoslash) meta.__cache = twoslash;
					}
				}
				if (meta.sourceMap) meta.__patch = resolveSourcePatcher(meta.sourceMap, rawCache);
				return code;
			},
			read(code, lang, options, meta) {
				return meta?.__cache ?? null;
			},
			write(code, data, lang, options, meta) {
				if (remove) {
					meta?.__patch?.("");
					return;
				}
				const cacheStr = `// ${CODE_INLINE_CACHE_KEY}: ${stringifyCachePayload(simplifyTwoslashReturn(data), code, lang, options)}`;
				meta?.__patch?.(cacheStr);
			}
		},
		patcher
	};
}
function sha256Hash(str) {
	return createHash("SHA256").update(str).digest("hex");
}
function simplifyTwoslashReturn(ret) {
	return {
		nodes: ret.nodes,
		code: ret.code,
		meta: ret.meta ? { extension: ret.meta.extension } : void 0
	};
}

//#endregion
//#region src/cache-inline/env.ts
function isEnabledEnv(key) {
	const val = process.env?.[key]?.toLowerCase();
	if (val) return {
		true: true,
		false: false,
		1: true,
		0: false,
		yes: true,
		no: false,
		y: true,
		n: false
	}[val] || null;
	return null;
}

//#endregion
//#region src/cache-inline/markdown-fence.ts
function createMarkdownFenceSourceCodec(mapper) {
	const FENCE_SOURCE_WRAP = `<fsm-${Math.random().toString(36).slice(2)}>`;
	const FENCE_SOURCE_REGEX = new RegExp(`\/\/ ${FENCE_SOURCE_WRAP}(.+?)${FENCE_SOURCE_WRAP}\\n`);
	function stringifyFenceSourceMap(sourceMap) {
		return `// ${FENCE_SOURCE_WRAP}${JSON.stringify(sourceMap)}${FENCE_SOURCE_WRAP}\n`;
	}
	function injectToMarkdown(code, path) {
		const injects = mapper(code, path);
		let newCode = code;
		const injectAts = Array.from(injects.keys()).sort((a, b) => b - a);
		for (const at of injectAts) {
			const data = stringifyFenceSourceMap(injects.get(at));
			newCode = newCode.slice(0, at) + data + newCode.slice(at);
		}
		return newCode;
	}
	function extractFromFence(code) {
		let sourceMap = null;
		try {
			code = code.replace(FENCE_SOURCE_REGEX, (_, p1) => {
				sourceMap = JSON.parse(p1);
				return "";
			});
		} catch {}
		return {
			code,
			sourceMap
		};
	}
	return {
		injectToMarkdown,
		extractFromFence
	};
}

//#endregion
//#region src/cache-inline/markdown-it-mapper.ts
const markdownItMapper = function(code, path) {
	const result = new MarkdownIt().parse(code, {});
	const pos = getLineStartPositions(code);
	const injects = /* @__PURE__ */ new Map();
	for (const token of result) if (token.type === "fence") {
		if (!token.map) continue;
		if (token.map[0] + 1 >= pos.length) continue;
		const codeStart = pos[token.map[0] + 1].from;
		const codeEnd = pos[token.map[1] - 1].from;
		injects.set(codeStart, {
			path,
			from: codeStart,
			to: codeEnd
		});
	}
	return injects;
};
function getLineStartPositions(text) {
	const positions = [];
	let pos = 0;
	while (true) {
		const [idx, len] = findNextNewLine(text, pos);
		if (idx === -1) {
			positions.push({
				from: pos,
				to: text.length
			});
			break;
		}
		positions.push({
			from: pos,
			to: idx
		});
		pos = idx + len;
	}
	return positions;
}
/**
* Finds the next newline starting at or after `position`.
* Supports \n, \r, and \r\n (treated as one newline).
* @returns [newlineStartIndex, newlineLength] or [-1, 0] if none found.
*/
function findNextNewLine(str, position) {
	const nIdx = str.indexOf("\n", position);
	const rIdx = str.indexOf("\r", position);
	if (nIdx === -1 && rIdx === -1) return [-1, 0];
	let idx;
	if (nIdx === -1) idx = rIdx;
	else if (rIdx === -1) idx = nIdx;
	else idx = nIdx < rIdx ? nIdx : rIdx;
	if (str.charCodeAt(idx) === 13 && str.charCodeAt(idx + 1) === 10) return [idx, 2];
	return [idx, 1];
}

//#endregion
//#region src/cache-inline/index.ts
/**
* @experimental This API is experimental and may be changed in the future.
*/
function createTwoslashWithInlineCache(twoslashOptions = {}, { sourceMapper = markdownItMapper, sourceMapCodec = createMarkdownFenceSourceCodec(sourceMapper) } = {}) {
	return function(config) {
		if (isEnabledEnv("TWOSLASH_INLINE_CACHE") === false) return config;
		const { typesCache, patcher } = createInlineTypesCache({
			remove: isEnabledEnv("TWOSLASH_INLINE_CACHE_REMOVE") === true,
			ignoreCache: isEnabledEnv("TWOSLASH_INLINE_CACHE_IGNORE") === true
		});
		const transformer = transformerTwoslash({
			...twoslashOptions,
			typesCache
		});
		const PatchPlugin = {
			name: "vitepress-twoslash:patch",
			enforce: "post",
			transform(code, id) {
				if (id.endsWith(".md")) patcher.patch(id);
			}
		};
		config = withFenceSourceMap(config, sourceMapCodec);
		((config.markdown ??= {}).codeTransformers ??= []).push(transformer);
		((config.vite ??= {}).plugins ??= []).push(PatchPlugin);
		return config;
	};
}
function withFenceSourceMap(config, codec) {
	const InjectPlugin = {
		name: "vitepress-twoslash:inject-fence-source-map",
		enforce: "pre",
		load(id) {
			if (id.endsWith(".md")) {
				const code = readFileSync(id, "utf-8");
				return { code: codec.injectToMarkdown(code, id) };
			}
		}
	};
	const transformer = {
		name: "vitepress-twoslash:extract-fence-source-map",
		enforce: "pre",
		preprocess(code) {
			const { code: transformedCode, sourceMap } = codec.extractFromFence(code);
			this.meta.sourceMap = sourceMap;
			return transformedCode;
		}
	};
	((config.markdown ??= {}).codeTransformers ??= []).unshift(transformer);
	((config.vite ??= {}).plugins ??= []).push(InjectPlugin);
	return config;
}

//#endregion
export { createTwoslashWithInlineCache };