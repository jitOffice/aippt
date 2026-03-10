import { i as parseTimeString, n as parseRangeString, r as parseTimesplits, t as parseAspectRatio } from "./utils-BiNCPCdQ.mjs";
import { ensurePrefix, toArray, uniq } from "@antfu/utils";
import YAML from "yaml";

//#region src/config.ts
function getDefaultConfig() {
	return {
		theme: "default",
		title: "Slidev",
		titleTemplate: "%s - Slidev",
		addons: [],
		remoteAssets: false,
		monaco: true,
		monacoTypesSource: "local",
		monacoTypesAdditionalPackages: [],
		monacoTypesIgnorePackages: [],
		monacoRunAdditionalDeps: [],
		monacoRunUseStrict: true,
		download: false,
		export: {},
		info: false,
		highlighter: "shiki",
		twoslash: true,
		lineNumbers: false,
		colorSchema: "auto",
		routerMode: "history",
		aspectRatio: 16 / 9,
		canvasWidth: 980,
		exportFilename: "",
		selectable: false,
		themeConfig: {},
		fonts: {},
		favicon: "https://cdn.jsdelivr.net/gh/slidevjs/slidev/assets/favicon.png",
		drawings: {},
		plantUmlServer: "https://www.plantuml.com/plantuml",
		codeCopy: true,
		magicMoveCopy: true,
		author: "",
		record: "dev",
		css: "unocss",
		presenter: true,
		browserExporter: "dev",
		htmlAttrs: {},
		transition: null,
		editor: true,
		contextMenu: null,
		wakeLock: true,
		remote: false,
		mdc: false,
		comark: false,
		seoMeta: {},
		notesAutoRuby: {},
		duration: "30min",
		timer: "stopwatch",
		magicMoveDuration: 800,
		preloadImages: true
	};
}
function resolveConfig(headmatter, themeMeta = {}, filepath, verify = false) {
	const themeHightlighter = [
		"prism",
		"shiki",
		"shikiji"
	].includes(themeMeta.highlighter || "") ? themeMeta.highlighter : void 0;
	const themeColorSchema = ["light", "dark"].includes(themeMeta.colorSchema || "") ? themeMeta.colorSchema : void 0;
	const defaultConfig = getDefaultConfig();
	const config = {
		...defaultConfig,
		highlighter: themeHightlighter || defaultConfig.highlighter,
		colorSchema: themeColorSchema || defaultConfig.colorSchema,
		...themeMeta.defaults,
		...headmatter.config,
		...headmatter,
		fonts: resolveFonts({
			...themeMeta.defaults?.fonts,
			...headmatter.config?.fonts,
			...headmatter?.fonts
		}),
		drawings: resolveDrawings(headmatter.drawings, filepath),
		htmlAttrs: {
			...themeMeta.defaults?.htmlAttrs,
			...headmatter.config?.htmlAttrs,
			...headmatter?.htmlAttrs
		}
	};
	if (config.highlighter === "shikiji") {
		console.warn(`[slidev] "shikiji" is merged back to "shiki", you can safely change it "highlighter: shiki"`);
		config.highlighter = "shiki";
	}
	if (config.highlighter === "prism") throw new Error(`[slidev] "prism" support has been dropped. Please use "highlighter: shiki" instead`);
	if (config.colorSchema !== "dark" && config.colorSchema !== "light") config.colorSchema = "auto";
	if (themeColorSchema && config.colorSchema === "auto") config.colorSchema = themeColorSchema;
	config.aspectRatio = parseAspectRatio(config.aspectRatio);
	if (verify) verifyConfig(config, themeMeta);
	return config;
}
function verifyConfig(config, themeMeta = {}, warn = (v) => console.warn(`[slidev] ${v}`)) {
	const themeHightlighter = themeMeta.highlighter === "shiki" ? themeMeta.highlighter : void 0;
	const themeColorSchema = ["light", "dark"].includes(themeMeta.colorSchema || "") ? themeMeta.colorSchema : void 0;
	if (themeColorSchema && config.colorSchema !== themeColorSchema) warn(`Color schema "${config.colorSchema}" does not supported by the theme`);
	if (themeHightlighter && config.highlighter !== themeHightlighter) warn(`Syntax highlighter "${config.highlighter}" does not supported by the theme`);
	if (config.css !== "unocss") {
		warn(`Unsupported Atomic CSS engine "${config.css}", fallback to UnoCSS`);
		config.css = "unocss";
	}
}
function resolveFonts(fonts = {}) {
	const { fallbacks = true, italic = false, provider = "google" } = fonts;
	let sans = toArray(fonts.sans).flatMap((i) => i.split(/,\s*/g)).map((i) => i.trim());
	let serif = toArray(fonts.serif).flatMap((i) => i.split(/,\s*/g)).map((i) => i.trim());
	let mono = toArray(fonts.mono).flatMap((i) => i.split(/,\s*/g)).map((i) => i.trim());
	const weights = toArray(fonts.weights || "200,400,600").flatMap((i) => i.toString().split(/,\s*/g)).map((i) => i.trim());
	const custom = toArray(fonts.custom).flatMap((i) => i.split(/,\s*/g)).map((i) => i.trim());
	const local = toArray(fonts.local).flatMap((i) => i.split(/,\s*/g)).map((i) => i.trim());
	const webfonts = fonts.webfonts ? fonts.webfonts : fallbacks ? uniq([
		...sans,
		...serif,
		...mono,
		...custom
	]).filter((i) => !local.includes(i)) : [];
	function toQuoted(font) {
		if (/^(['"]).*\1$/.test(font)) return font;
		return `"${font}"`;
	}
	if (fallbacks) {
		sans = uniq([
			...sans.map(toQuoted),
			"ui-sans-serif",
			"system-ui",
			"-apple-system",
			"BlinkMacSystemFont",
			"\"Segoe UI\"",
			"Roboto",
			"\"Helvetica Neue\"",
			"Arial",
			"\"Noto Sans\"",
			"sans-serif",
			"\"Apple Color Emoji\"",
			"\"Segoe UI Emoji\"",
			"\"Segoe UI Symbol\"",
			"\"Noto Color Emoji\""
		]);
		serif = uniq([
			...serif.map(toQuoted),
			"ui-serif",
			"Georgia",
			"Cambria",
			"\"Times New Roman\"",
			"Times",
			"serif"
		]);
		mono = uniq([
			...mono.map(toQuoted),
			"ui-monospace",
			"SFMono-Regular",
			"Menlo",
			"Monaco",
			"Consolas",
			"\"Liberation Mono\"",
			"\"Courier New\"",
			"monospace"
		]);
	}
	return {
		sans,
		serif,
		mono,
		webfonts,
		provider,
		local,
		italic,
		weights
	};
}
function resolveDrawings(options = {}, filepath) {
	const { enabled = true, persist = false, presenterOnly = false, syncAll = true } = options;
	return {
		enabled,
		persist: typeof persist === "string" ? persist : persist ? `.slidev/drawings${filepath ? `/${filepath.match(/([^\\/]+?)(\.\w+)?$/)?.[1]}` : ""}` : false,
		presenterOnly,
		syncAll
	};
}

//#endregion
//#region src/core.ts
function stringify(data) {
	return `${data.slides.map(stringifySlide).join("\n").trim()}\n`;
}
function stringifySlide(data, idx = 0) {
	return data.raw.startsWith("---") || idx === 0 ? data.raw : `---\n${ensurePrefix("\n", data.raw)}`;
}
function prettifySlide(data) {
	data.content = data.content.trim() ? `\n${data.content.trim()}\n` : "";
	data.raw = data.frontmatterDoc?.contents ? data.frontmatterStyle === "yaml" ? `\`\`\`yaml\n${data.frontmatterDoc.toString().trim()}\n\`\`\`\n${data.content}` : `---\n${data.frontmatterDoc.toString().trim()}\n---\n${data.content}` : data.content;
	if (data.note) data.raw += `\n<!--\n${data.note.trim()}\n-->\n`;
	return data;
}
function prettify(data) {
	data.slides.forEach(prettifySlide);
	return data;
}
function matter(code, options) {
	let type;
	let raw;
	let content = code.replace(/^---.*\r?\n([\s\S]*?)---/, (_, f) => {
		type = "frontmatter";
		raw = f;
		return "";
	});
	if (type !== "frontmatter") content = content.replace(/^\s*```ya?ml([\s\S]*?)```/, (_, f) => {
		type = "yaml";
		raw = f;
		return "";
	});
	const doc = raw && !options.noParseYAML ? YAML.parseDocument(raw) : void 0;
	return {
		type,
		raw,
		doc,
		data: doc?.toJSON(),
		content
	};
}
const IMAGE_EXTENSIONS = /\.(?:png|jpe?g|gif|svg|webp|avif|ico|bmp|tiff?)$/i;
/**
* Extract image URLs from slide content and frontmatter.
* Strips code blocks first to avoid false positives.
*/
function extractImagesUsage(content, frontmatter) {
	const images = /* @__PURE__ */ new Set();
	for (const key of [
		"image",
		"backgroundImage",
		"background"
	]) {
		const val = frontmatter[key];
		if (typeof val === "string" && val && !val.startsWith("data:")) if (key === "background") {
			if (IMAGE_EXTENSIONS.test(val) || val.startsWith("/") || val.startsWith("http")) images.add(val);
		} else images.add(val);
	}
	const stripped = content.replace(/^```[\s\S]+?^```/gm, "");
	for (const [, url] of stripped.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) if (url && !url.startsWith("data:")) images.add(url.trim());
	for (const [, url] of stripped.matchAll(/\b(?:src|image)=["']([^"']+)["']/g)) if (url && !url.startsWith("data:") && !url.includes("{{") && IMAGE_EXTENSIONS.test(url)) images.add(url.trim());
	for (const [, url] of stripped.matchAll(/:(?:src|image)=["']'([^']+)'["']/g)) if (url && !url.startsWith("data:") && IMAGE_EXTENSIONS.test(url)) images.add(url.trim());
	for (const [, url] of stripped.matchAll(/url\(["']?([^"')]+)["']?\)/g)) if (url && !url.startsWith("data:") && IMAGE_EXTENSIONS.test(url)) images.add(url.trim());
	return Array.from(images);
}
function detectFeatures(code) {
	return {
		katex: !!code.match(/\$.*?\$/) || !!code.match(/\$\$/),
		monaco: code.match(/\{monaco.*\}/) ? scanMonacoReferencedMods(code) : false,
		tweet: !!code.match(/<Tweet\b/),
		mermaid: !!code.match(/^```mermaid/m)
	};
}
function parseSlide(raw, options = {}) {
	const matterResult = matter(raw, options);
	let note;
	const frontmatter = matterResult.data || {};
	let content = matterResult.content.trim();
	const revision = hash(raw.trim());
	const comments = Array.from(content.matchAll(/<!--([\s\S]*?)-->/g));
	if (comments.length) {
		const last = comments[comments.length - 1];
		if (last.index !== void 0 && last.index + last[0].length >= content.length) {
			note = last[1].trim();
			content = content.slice(0, last.index).trim();
		}
	}
	let title;
	let level;
	if (frontmatter.title || frontmatter.name) title = frontmatter.title || frontmatter.name;
	else {
		const match = content.match(/^(#+) (.*)$/m);
		title = match?.[2]?.trim();
		level = match?.[1]?.length;
	}
	if (frontmatter.level) level = frontmatter.level || 1;
	const images = extractImagesUsage(content, frontmatter);
	return {
		raw,
		title,
		level,
		revision,
		content,
		contentRaw: content,
		frontmatter,
		frontmatterStyle: matterResult.type,
		frontmatterDoc: matterResult.doc,
		frontmatterRaw: matterResult.raw,
		note,
		images
	};
}
async function parse(markdown, filepath, extensions, options = {}) {
	const lines = markdown.split(options.preserveCR ? "\n" : /\r?\n/g);
	const slides = [];
	let start = 0;
	let contentStart = 0;
	async function slice(end) {
		if (start === end) return;
		const slide = {
			...parseSlide(lines.slice(start, end).join("\n"), options),
			filepath,
			index: slides.length,
			start,
			contentStart,
			end
		};
		if (extensions) for (const e of extensions) {
			if (e.transformSlide) {
				const newContent = await e.transformSlide(slide.content, slide.frontmatter);
				if (newContent !== void 0) slide.content = newContent;
				if (typeof slide.frontmatter.title === "string") slide.title = slide.frontmatter.title;
				if (typeof slide.frontmatter.level === "number") slide.level = slide.frontmatter.level;
			}
			if (e.transformNote) {
				const newNote = await e.transformNote(slide.note, slide.frontmatter);
				if (newNote !== void 0) slide.note = newNote;
			}
		}
		slides.push(slide);
		start = end + 1;
		contentStart = end + 1;
	}
	if (extensions) {
		for (const e of extensions) if (e.transformRawLines) await e.transformRawLines(lines);
	}
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trimEnd();
		if (line.startsWith("---")) {
			await slice(i);
			const next = lines[i + 1];
			if (line[3] !== "-" && next?.trim()) {
				start = i;
				for (i += 1; i < lines.length; i++) if (lines[i].trimEnd() === "---") break;
				contentStart = i + 1;
			}
		} else if (line.trimStart().startsWith("```")) {
			const codeBlockLevel = line.match(/^\s*`+/)[0];
			let j = i + 1;
			for (; j < lines.length; j++) if (lines[j].startsWith(codeBlockLevel)) break;
			if (j !== lines.length) i = j;
		}
	}
	if (start <= lines.length - 1) await slice(lines.length);
	return {
		filepath,
		raw: markdown,
		slides
	};
}
function parseSync(markdown, filepath, options = {}) {
	const lines = markdown.split(options.preserveCR ? "\n" : /\r?\n/g);
	const slides = [];
	let start = 0;
	let contentStart = 0;
	function slice(end) {
		if (start === end) return;
		const slide = {
			...parseSlide(lines.slice(start, end).join("\n"), options),
			filepath,
			index: slides.length,
			start,
			contentStart,
			end
		};
		slides.push(slide);
		start = end + 1;
		contentStart = end + 1;
	}
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trimEnd();
		if (line.startsWith("---")) {
			slice(i);
			const next = lines[i + 1];
			if (line[3] !== "-" && next?.trim()) {
				start = i;
				for (i += 1; i < lines.length; i++) if (lines[i].trimEnd() === "---") break;
				contentStart = i + 1;
			}
		} else if (line.trimStart().startsWith("```")) {
			const codeBlockLevel = line.match(/^\s*`+/)[0];
			let j = i + 1;
			for (; j < lines.length; j++) if (lines[j].startsWith(codeBlockLevel)) break;
			if (j !== lines.length) i = j;
		}
	}
	if (start <= lines.length - 1) slice(lines.length);
	return {
		filepath,
		raw: markdown,
		slides
	};
}
function scanMonacoReferencedMods(md) {
	const types = /* @__PURE__ */ new Set();
	const deps = /* @__PURE__ */ new Set();
	md.replace(/^```(\w+)\s*\{monaco([^}]*)\}\s*(\S[\s\S]*?)^```/gm, (full, lang = "ts", kind, code) => {
		lang = lang.trim();
		const isDep = kind === "-run";
		if ([
			"js",
			"javascript",
			"ts",
			"typescript"
		].includes(lang)) {
			for (const [, , specifier] of code.matchAll(/\s+from\s+(["'])([/.\w@-]+)\1/g)) if (specifier) {
				if (!"./".includes(specifier)) types.add(specifier);
				if (isDep) deps.add(specifier);
			}
		}
		return "";
	});
	return {
		types: Array.from(types),
		deps: Array.from(deps)
	};
}
function hash(str) {
	let hash$1 = 0;
	for (let i = 0; i < str.length; i++) {
		hash$1 = (hash$1 << 5) - hash$1 + str.charCodeAt(i);
		hash$1 |= 0;
	}
	return hash$1.toString(36).slice(0, 12);
}

//#endregion
export { detectFeatures, extractImagesUsage, getDefaultConfig, parse, parseAspectRatio, parseRangeString, parseSlide, parseSync, parseTimeString, parseTimesplits, prettify, prettifySlide, resolveConfig, resolveFonts, stringify, stringifySlide, verifyConfig };