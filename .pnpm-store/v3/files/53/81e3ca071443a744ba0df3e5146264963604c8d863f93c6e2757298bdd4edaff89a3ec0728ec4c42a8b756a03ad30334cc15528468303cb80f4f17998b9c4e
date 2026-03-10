import { i as parseTimeString, n as parseRangeString, r as parseTimesplits, t as parseAspectRatio } from "./utils-BiNCPCdQ.mjs";
import { detectFeatures, extractImagesUsage, getDefaultConfig, parse, parseSlide, parseSync, prettify, prettifySlide, resolveConfig, resolveFonts, stringify, stringifySlide, verifyConfig } from "./core.mjs";
import { slash } from "@antfu/utils";
import YAML from "yaml";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

//#region src/fs.ts
let preparserExtensionLoader = null;
function injectPreparserExtensionLoader(fn) {
	preparserExtensionLoader = fn;
}
async function load(userRoot, filepath, sources = {}, mode) {
	const loadSource = typeof sources === "function" ? sources : async (path) => sources[path] ?? readFile(path, "utf-8");
	const markdown = await loadSource(filepath);
	let extensions;
	if (preparserExtensionLoader) {
		const lines = markdown.split(/\r?\n/g);
		let hm = "";
		if (lines[0].match(/^---([^-].*)?$/) && !lines[1]?.match(/^\s*$/)) {
			let hEnd = 1;
			while (hEnd < lines.length && !lines[hEnd].trimEnd().match(/^---$/)) hEnd++;
			hm = lines.slice(1, hEnd).join("\n");
		}
		const o = YAML.parse(hm) ?? {};
		extensions = await preparserExtensionLoader(o, filepath, mode);
	}
	const markdownFiles = {};
	const watchFiles = {};
	const slides = [];
	async function loadMarkdown(path, range$1, frontmatterOverride, importers) {
		let md = markdownFiles[path];
		if (!md) {
			md = await parse(await loadSource(path), path, extensions);
			markdownFiles[path] = md;
			watchFiles[path] = /* @__PURE__ */ new Set();
		}
		const directImporter = importers?.at(-1);
		for (const index of parseRangeString(md.slides.length, range$1)) {
			const subSlide = md.slides[index - 1];
			try {
				await loadSlide(md, subSlide, frontmatterOverride, importers);
			} catch (e) {
				md.errors ??= [];
				md.errors.push({
					row: subSlide.start,
					message: `Error when loading slide: ${e}`
				});
				continue;
			}
			if (directImporter) (directImporter.imports ??= []).push(subSlide);
		}
		return md;
	}
	async function loadSlide(md, slide, frontmatterOverride, importChain) {
		if (slide.frontmatter.disabled || slide.frontmatter.hide) return;
		if (slide.frontmatter.src) {
			const [rawPath, rangeRaw] = slide.frontmatter.src.split("#");
			const path = slash(rawPath.startsWith("/") ? resolve(userRoot, rawPath.substring(1)) : resolve(dirname(slide.filepath), rawPath));
			frontmatterOverride = {
				...slide.frontmatter,
				...frontmatterOverride
			};
			delete frontmatterOverride.src;
			if (!existsSync(path)) {
				md.errors ??= [];
				md.errors.push({
					row: slide.start,
					message: `Imported markdown file not found: ${path}`
				});
			} else await loadMarkdown(path, rangeRaw, frontmatterOverride, importChain ? [...importChain, slide] : [slide]);
		} else slides.push({
			frontmatter: {
				...slide.frontmatter,
				...frontmatterOverride
			},
			content: slide.content,
			revision: slide.revision,
			frontmatterRaw: slide.frontmatterRaw,
			note: slide.note,
			title: slide.title,
			level: slide.level,
			index: slides.length,
			importChain,
			source: slide
		});
	}
	const entry = await loadMarkdown(slash(filepath));
	const headmatter = { ...entry.slides[0]?.frontmatter };
	if (slides[0]?.title) headmatter.title ??= slides[0].title;
	return {
		slides,
		entry,
		headmatter,
		features: detectFeatures(slides.map((s) => s.source.raw).join("")),
		markdownFiles,
		watchFiles
	};
}
async function save(markdown) {
	const fileContent = stringify(markdown);
	await writeFile(markdown.filepath, fileContent, "utf-8");
	return fileContent;
}

//#endregion
export { detectFeatures, extractImagesUsage, getDefaultConfig, injectPreparserExtensionLoader, load, parse, parseAspectRatio, parseRangeString, parseSlide, parseSync, parseTimeString, parseTimesplits, prettify, prettifySlide, resolveConfig, resolveFonts, save, stringify, stringifySlide, verifyConfig };