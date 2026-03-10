import { a as resolveImportPath, c as toAtFS, i as resolveEntry, n as getRoots, o as resolveImportUrl, r as isInstalledGlobally, s as resolveSourceFiles, t as createResolver } from "./resolver-B4CxEjJF.mjs";
import { builtinModules } from "node:module";
import path, { basename, dirname, join, relative, resolve } from "node:path";
import { loadConfigFromFile, mergeConfig } from "vite";
import MarkdownExit from "markdown-exit";
import fs, { existsSync } from "node:fs";
import fs$1, { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { isString, isTruthy, notNullish, objectEntries, objectMap, range, slash, uniq } from "@antfu/utils";
import { bold, gray, red, white, yellow } from "ansis";
import { createResolve } from "mlly";
import { findDepPkgJsonPath } from "vitefu";
import { createJiti } from "jiti";
import YAML from "yaml";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import * as parser from "@slidev/parser/fs";
import equal from "fast-deep-equal";
import fg from "fast-glob";
import { createDebug } from "obug";
import pm from "picomatch";
import { satisfies } from "semver";
import { createHead, extractUnheadInputFromHtml, transformHtmlTemplate } from "unhead/server";
import { createBundledHighlighter, createSingletonShorthands } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { bundledLanguages, bundledThemes } from "shiki";
import katex from "katex";
import MagicString from "magic-string-stack";
import Markdown from "unplugin-vue-markdown/vite";
import MarkdownItComark from "@comark/markdown-it";
import MarkdownItFootnote from "markdown-it-footnote";
import { fromAsyncCodeToHtml } from "@shikijs/markdown-it/async";
import { SourceMapConsumer } from "source-map-js";
import lz from "lz-string";
import { toKeyedTokens } from "shiki-magic-move/core";
import { encode } from "plantuml-encoder";
import ServerRef from "vite-plugin-vue-server-ref";
import UnoCSS from "unocss/vite";
import { mergeConfigs, presetIcons } from "unocss";
import Vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";

//#region node/syntax/markdown-it/markdown-it-link.ts
function MarkdownItLink(md) {
	const defaultRender = md.renderer.rules.link_open ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
	md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
		const token = tokens[idx];
		const hrefIndex = token.attrIndex("href");
		const attr = token.attrs?.[hrefIndex];
		const href = attr?.[1] ?? "";
		if ("./#".includes(href[0]) || /^\d+$/.test(href)) {
			token.tag = "Link";
			attr[0] = "to";
			for (let i = idx + 1; i < tokens.length; i++) if (tokens[i].type === "link_close") {
				tokens[i].tag = "Link";
				break;
			}
		} else if (token.attrGet("target") == null) token.attrPush(["target", "_blank"]);
		return defaultRender(tokens, idx, options, env, self);
	};
}

//#endregion
//#region node/utils.ts
let jiti;
function loadModule(absolutePath) {
	jiti ??= createJiti(fileURLToPath(import.meta.url), { moduleCache: false });
	return jiti.import(absolutePath);
}
function stringifyMarkdownTokens(tokens) {
	return tokens.map((token) => token.children?.filter((t) => ["text", "code_inline"].includes(t.type) && !t.content.match(/^\s*$/)).map((t) => t.content.trim()).join(" ")).filter(Boolean).join(" ");
}
function generateFontParams(options) {
	const weights = options.weights.flatMap((i) => options.italic ? [`0,${i}`, `1,${i}`] : [`${i}`]).sort().join(";");
	return options.webfonts.map((i) => `family=${i.replace(/^(['"])(.*)\1$/, "$1").replace(/\s+/g, "+")}:${options.italic ? "ital," : ""}wght@${weights}`).join("&");
}
function generateGoogleFontsUrl(options) {
	return `https://fonts.googleapis.com/css2?${generateFontParams(options)}&display=swap`;
}
function generateCoollabsFontsUrl(options) {
	return `https://api.fonts.coollabs.io/fonts?${generateFontParams(options)}&display=swap`;
}
/**
* Update frontmatter patch and preserve the comments
*/
function updateFrontmatterPatch(source, frontmatter) {
	let doc = source.frontmatterDoc;
	if (!doc) {
		source.frontmatterStyle = "frontmatter";
		source.frontmatterDoc = doc = new YAML.Document({});
	}
	for (const [key, value] of Object.entries(frontmatter)) {
		source.frontmatter[key] = value;
		if (value == null) doc.delete(key);
		else {
			const valueNode = doc.createNode(value);
			let found = false;
			YAML.visit(doc.contents, { Pair(_key, node, path$1) {
				if (path$1.length === 1 && YAML.isScalar(node.key) && node.key.value === key) {
					node.value = valueNode;
					found = true;
					return YAML.visit.BREAK;
				}
			} });
			if (!found) {
				if (!YAML.isMap(doc.contents)) doc.contents = doc.createNode({});
				doc.contents.add(doc.createPair(key, valueNode));
			}
		}
	}
}
function getBodyJson(req) {
	return new Promise((resolve$2, reject) => {
		let body = "";
		req.on("data", (chunk) => body += chunk);
		req.on("error", reject);
		req.on("end", () => {
			try {
				resolve$2(JSON.parse(body) || {});
			} catch (e) {
				reject(e);
			}
		});
	});
}
function makeAbsoluteImportGlob(userRoot, globs, options = {}) {
	const relativeGlobs = globs.map((glob) => `./${slash(relative(userRoot, glob))}`);
	const opts = {
		eager: true,
		exhaustive: true,
		base: "/",
		...options
	};
	return `import.meta.glob(${JSON.stringify(relativeGlobs)}, ${JSON.stringify(opts)})`;
}

//#endregion
//#region node/setups/load.ts
async function loadSetups(roots, filename, args, extraLoader) {
	return await Promise.all(roots.flatMap((root) => {
		const tasks = [];
		const path$1 = resolve(root, "setup", filename);
		if (existsSync(path$1)) tasks.push(loadModule(path$1).then((mod) => mod.default(...args)));
		if (extraLoader) tasks.push(...extraLoader(root));
		return tasks;
	}));
}

//#endregion
//#region node/setups/vite-plugins.ts
async function setupVitePlugins(options) {
	return await loadSetups(options.roots, "vite-plugins.ts", [options]);
}

//#endregion
//#region node/vite/compilerFlagsVue.ts
/**
* Replace compiler flags like `__DEV__` in Vue SFC
*/
function createVueCompilerFlagsPlugin(options) {
	const define = objectEntries(options.utils.define);
	return {
		name: "slidev:flags",
		enforce: "pre",
		transform: { handler(code, id) {
			if (!id.match(/\.vue($|\?)/) && !id.includes("?vue&")) return;
			const original = code;
			define.forEach(([from, to]) => {
				code = code.replaceAll(from, to);
			});
			if (original !== code) return code;
		} }
	};
}

//#endregion
//#region node/vite/components.ts
function createComponentsPlugin({ clientRoot, roots }, pluginOptions) {
	return Components({
		extensions: [
			"vue",
			"md",
			"js",
			"ts",
			"jsx",
			"tsx"
		],
		dirs: [join(clientRoot, "builtin"), ...roots.map((i) => join(i, "components"))],
		globsExclude: [],
		include: [
			/\.vue$/,
			/\.vue\?vue/,
			/\.vue\?v=/,
			/\.md$/,
			/\.md\?vue/
		],
		exclude: [],
		resolvers: [IconsResolver({
			prefix: "",
			customCollections: Object.keys(pluginOptions.icons?.customCollections || [])
		})],
		dts: false,
		...pluginOptions.components
	});
}

//#endregion
//#region node/vite/common.ts
const regexSlideReqPath = /^\/__slidev\/slides\/(\d+)\.json$/;
const regexSlideFacadeId = /^\/@slidev\/slides\/(\d+)\/(md|frontmatter)($|\?)/;
const regexSlideSourceId = /__slidev_(\d+)\.(md|frontmatter)$/;
const templateInjectionMarker = "/* @slidev-injection */";
const templateImportContextUtils = `import { useSlideContext as _useSlideContext, frontmatterToProps as _frontmatterToProps } from "@slidev/client/context.ts"`;
const templateInitContext = `const { $slidev, $nav, $clicksContext, $clicks, $page, $renderContext, $frontmatter } = _useSlideContext()`;

//#endregion
//#region node/vite/contextInjection.ts
/**
* Inject `$slidev` into the script block of a Vue component
*/
function createContextInjectionPlugin() {
	return {
		name: "slidev:context-injection",
		transform: { async handler(code, id) {
			if (!id.endsWith(".vue") || id.includes("/@slidev/client/") || id.includes("/packages/client/")) return;
			if (code.includes(templateInjectionMarker) || code.includes("useSlideContext()")) return code;
			const imports = [
				templateImportContextUtils,
				templateInitContext,
				templateInjectionMarker
			];
			const matchScripts = [...code.matchAll(/<script([^>]*)>/g)];
			const setupScriptMatch = [...code.matchAll(/<script([^>]*)setup([^>]*)>/g)].at(0);
			if (setupScriptMatch) {
				const setupTag = setupScriptMatch[0];
				const setupTagEnd = (setupScriptMatch.index || 0) + setupTag.length;
				return `${code.slice(0, setupTagEnd)}\n${imports.join("\n")}\n${code.slice(setupTagEnd)}`;
			} else if (!setupScriptMatch && matchScripts.length === 1) {
				const matchExport = code.match(/export\s+default\s+\{/);
				if (matchExport) {
					const exportIndex = (matchExport.index || 0) + matchExport[0].length;
					let component = code.slice(exportIndex);
					component = component.slice(0, component.indexOf("<\/script>"));
					const scriptIndex = (matchScripts[0].index || 0) + matchScripts[0][0].length;
					code = `${code.slice(0, scriptIndex)}
import { injectionSlidevContext } from "@slidev/client/constants.ts"
${code.slice(scriptIndex)}`;
					let injectIndex = exportIndex + 70;
					let injectObject = "$slidev: { from: injectionSlidevContext },";
					const matchInject = component.match(/.*inject\s*:\s*([[{])/);
					if (matchInject) {
						injectIndex += (matchInject.index || 0) + matchInject[0].length;
						if (matchInject[1] === "[") {
							let injects = component.slice((matchInject.index || 0) + matchInject[0].length);
							const injectEndIndex = injects.indexOf("]");
							injects = injects.slice(0, injectEndIndex);
							injectObject += injects.split(",").map((inject) => `${inject}: {from: ${inject}}`).join(",");
							return `${code.slice(0, injectIndex - 1)}{\n${injectObject}\n}${code.slice(injectIndex + injectEndIndex + 1)}`;
						} else return `${code.slice(0, injectIndex)}\n${injectObject}\n${code.slice(injectIndex)}`;
					}
					return `${code.slice(0, injectIndex)}\ninject: { ${injectObject} },\n${code.slice(injectIndex)}`;
				}
			}
			return `<script setup>\n${imports.join("\n")}\n<\/script>\n${code}`;
		} }
	};
}

//#endregion
//#region node/vite/extendConfig.ts
const INCLUDE_GLOBAL = [
	"@typescript/ata",
	"file-saver",
	"lz-string",
	"recordrtc",
	"typescript",
	"yaml",
	"pptxgenjs",
	"ansis"
];
const INCLUDE_LOCAL = INCLUDE_GLOBAL.map((i) => `@slidev/cli > @slidev/client > ${i}`);
const EXCLUDE_GLOBAL = [
	"@antfu/utils",
	"@shikijs/monaco",
	"@shikijs/vitepress-twoslash/client",
	"@slidev/client",
	"@slidev/client/constants",
	"@slidev/client/context",
	"@slidev/client/logic/dark",
	"@slidev/parser",
	"@slidev/parser/core",
	"@slidev/rough-notation",
	"@slidev/types",
	"@unhead/vue",
	"@unocss/reset",
	"@vueuse/core",
	"@vueuse/math",
	"@vueuse/motion",
	"@vueuse/shared",
	"drauu",
	"floating-vue",
	"fuse.js",
	"mermaid",
	"monaco-editor",
	"shiki-magic-move/vue",
	"shiki",
	"shiki/core",
	"vue-demi",
	"vue-router",
	"vue"
];
const EXCLUDE_LOCAL = EXCLUDE_GLOBAL;
const ASYNC_MODULES = [
	"file-saver",
	"vue",
	"@vue"
];
function createConfigPlugin(options) {
	const resolveClientDep = createResolve({
		conditions: [
			"import",
			"module",
			"browser",
			"default",
			options.mode === "build" ? "production" : "development"
		],
		url: pathToFileURL(options.clientRoot)
	});
	return {
		name: "slidev:config",
		async config(config) {
			const injection = {
				define: options.utils.define,
				resolve: {
					alias: [
						{
							find: /^@slidev\/client$/,
							replacement: `${toAtFS(options.clientRoot)}/index.ts`
						},
						{
							find: /^@slidev\/client\/(.*)/,
							replacement: `${toAtFS(options.clientRoot)}/$1`
						},
						{
							find: /^#slidev\/(.*)/,
							replacement: "/@slidev/$1"
						},
						{
							find: "vue",
							replacement: await resolveImportPath("vue/dist/vue.esm-bundler.js", true)
						},
						...isInstalledGlobally.value ? await Promise.all(INCLUDE_GLOBAL.map(async (dep) => ({
							find: dep,
							replacement: fileURLToPath(await resolveClientDep(dep))
						}))) : []
					],
					dedupe: ["vue"]
				},
				optimizeDeps: isInstalledGlobally.value ? {
					exclude: EXCLUDE_GLOBAL,
					include: INCLUDE_GLOBAL
				} : {
					exclude: EXCLUDE_LOCAL,
					include: INCLUDE_LOCAL
				},
				css: { postcss: { plugins: [await import("postcss-nested").then((r) => (r.default || r)())] } },
				server: { fs: {
					strict: true,
					allow: uniq([
						options.userWorkspaceRoot,
						options.clientRoot,
						isInstalledGlobally.value ? slash(options.cliRoot).replace(/\/\.pnpm\/.*$/gi, "") : options.cliRoot,
						...options.roots
					])
				} },
				publicDir: join(options.userRoot, "public"),
				build: { rollupOptions: { output: {
					chunkFileNames(chunkInfo) {
						const DEFAULT = "assets/[name]-[hash].js";
						if (chunkInfo.name.includes("/")) return DEFAULT;
						if (chunkInfo.moduleIds.filter((i) => isSlidevClient(i)).length > chunkInfo.moduleIds.length * .6) return "assets/slidev/[name]-[hash].js";
						if (chunkInfo.moduleIds.filter((i) => i.match(/\/monaco-editor(-core)?\//)).length > chunkInfo.moduleIds.length * .6) return "assets/monaco/[name]-[hash].js";
						return DEFAULT;
					},
					manualChunks(id) {
						if (id.startsWith("/@slidev-monaco-types/") || id.includes("/@slidev/monaco-types") || id.endsWith("?monaco-types&raw")) return "monaco/bundled-types";
						if (id.includes("/shiki/") || id.includes("/@shikijs/")) return `modules/shiki`;
						if (id.startsWith("~icons/")) return "modules/unplugin-icons";
						const matchedAsyncModule = ASYNC_MODULES.find((i) => id.includes(`/node_modules/${i}`));
						if (matchedAsyncModule) return `modules/${matchedAsyncModule.replace("@", "").replace("/", "-")}`;
					}
				} } },
				cacheDir: isInstalledGlobally.value ? join(options.cliRoot, "node_modules/.vite") : void 0
			};
			function isSlidevClient(id) {
				return id.includes("/@slidev/") || id.includes("/slidev/packages/client/") || id.includes("/@vueuse/");
			}
			return mergeConfig(injection, config);
		},
		configureServer(server) {
			return () => {
				server.middlewares.use(async (req, res, next) => {
					if (req.url === "/index.html") {
						const headers = server.config.server.headers ?? {};
						for (const header in headers) res.setHeader(header, headers[header]);
						res.setHeader("Content-Type", "text/html");
						res.statusCode = 200;
						res.end(options.utils.indexHtml);
						return;
					}
					next();
				});
			};
		}
	};
}

//#endregion
//#region node/vite/hmrPatch.ts
/**
* force reload slide component to ensure v-click resolves correctly
*/
function createHmrPatchPlugin() {
	return {
		name: "slidev:hmr-patch",
		transform: {
			filter: { id: { include: regexSlideSourceId } },
			handler(code, id) {
				if (!id.match(regexSlideSourceId)) return;
				return code.replace("if (_rerender_only)", "if (false)");
			}
		}
	};
}

//#endregion
//#region node/vite/icons.ts
function createIconsPlugin(options, pluginOptions) {
	return Icons({
		defaultClass: "slidev-icon",
		collectionsNodeResolvePath: options.utils.iconsResolvePath,
		...pluginOptions.icons
	});
}

//#endregion
//#region node/vite/inspect.ts
async function createInspectPlugin(options, pluginOptions) {
	if (!options.inspect) return;
	const { default: PluginInspect } = await import("vite-plugin-inspect");
	return PluginInspect({
		dev: true,
		build: true,
		...pluginOptions.inspect
	});
}

//#endregion
//#region node/vite/layoutWrapper.ts
function createLayoutWrapperPlugin({ data, utils }) {
	return {
		name: "slidev:layout-wrapper",
		transform: {
			filter: { id: { include: regexSlideSourceId } },
			async handler(code, id) {
				const match = id.match(regexSlideSourceId);
				if (!match) return;
				const [, no, type] = match;
				if (type !== "md") return;
				const index = +no - 1;
				const layouts = await utils.getLayouts();
				let layoutName = (data.slides[index]?.frontmatter?.layout ?? data.slides[0]?.frontmatter?.defaults?.layout) || (index === 0 ? "cover" : "default");
				if (!layouts[layoutName]) {
					console.error(red(`\nUnknown layout "${bold(layoutName)}".${yellow(" Available layouts are:")}`) + Object.keys(layouts).map((i, idx) => (idx % 3 === 0 ? "\n    " : "") + gray(i.padEnd(15, " "))).join("  "));
					console.error();
					layoutName = "default";
				}
				const setupTag = code.match(/^<script setup.*>/m);
				if (!setupTag) throw new Error(`[Slidev] Internal error: <script setup> block not found in slide ${index + 1}.`);
				const templatePart = code.slice(0, setupTag.index);
				const scriptPart = code.slice(setupTag.index);
				const bodyStart = templatePart.indexOf("<template>") + 10;
				const bodyEnd = templatePart.lastIndexOf("</template>");
				let body = code.slice(bodyStart, bodyEnd).trim();
				if (body.startsWith("<div>") && body.endsWith("</div>")) body = body.slice(5, -6);
				return [
					templatePart.slice(0, bodyStart),
					`<InjectedLayout v-bind="_frontmatterToProps($frontmatter,${index})">\n${body}\n</InjectedLayout>`,
					templatePart.slice(bodyEnd),
					scriptPart.slice(0, setupTag[0].length),
					`import InjectedLayout from "${toAtFS(layouts[layoutName])}"`,
					templateImportContextUtils,
					templateInitContext,
					"$clicksContext.setup()",
					templateInjectionMarker,
					scriptPart.slice(setupTag[0].length)
				].join("\n");
			}
		}
	};
}

//#endregion
//#region package.json
var version = "52.14.1";

//#endregion
//#region node/integrations/addons.ts
async function resolveAddons(addonsInConfig) {
	const { userRoot, userPkgJson } = await getRoots();
	const resolved = [];
	const resolveAddonNameAndRoot = createResolver("addon", {});
	async function resolveAddon(name, parent) {
		const [, pkgRoot] = await resolveAddonNameAndRoot(name, parent);
		if (!pkgRoot) return;
		resolved.push(pkgRoot);
		const { slidev = {}, engines = {} } = JSON.parse(await fs$1.readFile(resolve(pkgRoot, "package.json"), "utf-8"));
		if (engines.slidev && !satisfies(version, engines.slidev, { includePrerelease: true })) throw new Error(`[slidev] addon "${name}" requires Slidev version range "${engines.slidev}" but found "${version}"`);
		if (Array.isArray(slidev.addons)) await Promise.all(slidev.addons.map((addon) => resolveAddon(addon, pkgRoot)));
	}
	if (Array.isArray(addonsInConfig)) await Promise.all(addonsInConfig.map((addon) => resolveAddon(addon, userRoot)));
	if (Array.isArray(userPkgJson.slidev?.addons)) await Promise.all(userPkgJson.slidev.addons.map((addon) => resolveAddon(addon, userRoot)));
	return resolved;
}

//#endregion
//#region node/integrations/themes.ts
const officialThemes = {
	"none": "",
	"default": "@slidev/theme-default",
	"seriph": "@slidev/theme-seriph",
	"apple-basic": "@slidev/theme-apple-basic",
	"shibainu": "@slidev/theme-shibainu",
	"bricks": "@slidev/theme-bricks"
};
const resolveTheme = createResolver("theme", officialThemes);
async function getThemeMeta(name, root) {
	const path$1 = join(root, "package.json");
	if (!existsSync(path$1)) return {};
	const { slidev = {}, engines = {} } = JSON.parse(await fs$1.readFile(path$1, "utf-8"));
	if (engines.slidev && !satisfies(version, engines.slidev, { includePrerelease: true })) throw new Error(`[slidev] theme "${name}" requires Slidev version range "${engines.slidev}" but found "${version}"`);
	return slidev;
}

//#endregion
//#region node/setups/indexHtml.ts
function escapeHtml(str) {
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function toAttrValue(unsafe) {
	return JSON.stringify(escapeHtml(String(unsafe)));
}
function collectPreloadImages(data, base) {
	if (data.config.preloadImages === false) return [];
	const seen = /* @__PURE__ */ new Set();
	const links = [];
	const basePrefix = base ? base.replace(/\/$/, "") : "";
	for (const slide of data.slides) {
		const images = slide.images || slide.source?.images;
		if (!images?.length) continue;
		for (const url of images) {
			if (seen.has(url)) continue;
			seen.add(url);
			const href = url.startsWith("http") || url.startsWith("//") ? url : `${basePrefix}${url.startsWith("/") ? url : `/${url}`}`;
			links.push({
				rel: "preload",
				as: "image",
				href
			});
		}
	}
	return links;
}
async function setupIndexHtml({ mode, entry, clientRoot, userRoot, roots, data, base }) {
	let main = await readFile(join(clientRoot, "index.html"), "utf-8");
	let body = "";
	const inputs = [];
	for (const root of roots) {
		const path$1 = join(root, "index.html");
		if (!existsSync(path$1)) continue;
		const html = await readFile(path$1, "utf-8");
		if (root === userRoot && html.includes("<!DOCTYPE")) {
			console.error(yellow(`[Slidev] Ignored provided index.html with doctype declaration. (${white(path$1)})`));
			console.error(yellow("This file may be generated by Slidev, please remove it from your project."));
			continue;
		}
		inputs.push(extractUnheadInputFromHtml(html).input);
		body += `\n${(html.match(/<body>([\s\S]*?)<\/body>/i)?.[1] || "").trim()}`;
	}
	if (data.features.tweet) body += "\n<script async src=\"https://platform.twitter.com/widgets.js\"><\/script>";
	const webFontsLink = [];
	if (data.config.fonts.webfonts.length) {
		const { provider } = data.config.fonts;
		if (provider === "google") webFontsLink.push({
			rel: "stylesheet",
			href: generateGoogleFontsUrl(data.config.fonts),
			type: "text/css"
		});
		else if (provider === "coollabs") webFontsLink.push({
			rel: "stylesheet",
			href: generateCoollabsFontsUrl(data.config.fonts),
			type: "text/css"
		});
	}
	const { info, author, keywords } = data.headmatter;
	const seoMeta = data.headmatter.seoMeta ?? {};
	const ogImage = seoMeta.ogImage === "auto" ? "./og-image.png" : seoMeta.ogImage ? seoMeta.ogImage : existsSync(join(userRoot, "og-image.png")) ? "./og-image.png" : void 0;
	const title = getSlideTitle(data);
	const description = info ? toAttrValue(info) : null;
	const unhead = createHead({ init: [{
		htmlAttrs: data.headmatter.lang ? { lang: data.headmatter.lang } : void 0,
		title,
		link: [
			data.config.favicon ? {
				rel: "icon",
				href: data.config.favicon
			} : null,
			...webFontsLink,
			...collectPreloadImages(data, base)
		].filter((x) => x),
		meta: [
			{
				"http-equiv": "Content-Type",
				"content": "text/html; charset=UTF-8"
			},
			{
				property: "slidev:version",
				content: version
			},
			{
				property: "slidev:entry",
				content: mode === "dev" && slash(entry)
			},
			{
				name: "description",
				content: description
			},
			{
				name: "author",
				content: author ? toAttrValue(author) : null
			},
			{
				name: "keywords",
				content: keywords ? toAttrValue(Array.isArray(keywords) ? keywords.join(", ") : keywords) : null
			},
			{
				property: "og:title",
				content: seoMeta.ogTitle || title
			},
			{
				property: "og:description",
				content: seoMeta.ogDescription || description
			},
			{
				property: "og:image",
				content: ogImage
			},
			{
				property: "og:url",
				content: seoMeta.ogUrl
			},
			{
				property: "twitter:card",
				content: seoMeta.twitterCard
			},
			{
				property: "twitter:site",
				content: seoMeta.twitterSite
			},
			{
				property: "twitter:title",
				content: seoMeta.twitterTitle
			},
			{
				property: "twitter:description",
				content: seoMeta.twitterDescription
			},
			{
				property: "twitter:image",
				content: seoMeta.twitterImage
			},
			{
				property: "twitter:url",
				content: seoMeta.twitterUrl
			}
		].filter((x) => x.content)
	}, ...inputs] });
	const mainUrl = toAtFS(join(clientRoot, "main.ts"));
	if (mode === "build") main = main.replace("__ENTRY__", mainUrl);
	else {
		const basePrefix = base ? base.slice(0, -1) : "";
		main = main.replace("__ENTRY__", encodeURI(basePrefix + mainUrl));
	}
	main = main.replace("<!-- body -->", body);
	return await transformHtmlTemplate(unhead, main);
}

//#endregion
//#region node/setups/katex.ts
async function setupKatex(roots) {
	const options = await loadSetups(roots, "katex.ts", []);
	return Object.assign({ strict: false }, ...options);
}

//#endregion
//#region ../client/setup/shiki-options.ts
function resolveShikiOptions(options) {
	const mergedOptions = Object.assign({}, ...options);
	if ("theme" in mergedOptions && "themes" in mergedOptions) delete mergedOptions.theme;
	if (mergedOptions.theme && typeof mergedOptions.theme !== "string" && !mergedOptions.theme.name && !mergedOptions.theme.tokenColors) {
		mergedOptions.themes = mergedOptions.theme;
		delete mergedOptions.theme;
	}
	if (!mergedOptions.theme && !mergedOptions.themes) mergedOptions.themes = {
		dark: "vitesse-dark",
		light: "vitesse-light"
	};
	if (mergedOptions.themes) mergedOptions.defaultColor = false;
	const themeOption = extractThemeName(mergedOptions.theme) || extractThemeNames(mergedOptions.themes || {});
	const themeNames = typeof themeOption === "string" ? [themeOption] : Object.values(themeOption);
	const themeInput = Object.assign({}, bundledThemes);
	if (typeof mergedOptions.theme === "object" && mergedOptions.theme?.name) themeInput[mergedOptions.theme.name] = mergedOptions.theme;
	if (mergedOptions.themes) {
		for (const theme of Object.values(mergedOptions.themes)) if (typeof theme === "object" && theme?.name) themeInput[theme.name] = theme;
	}
	const languageNames = new Set([
		"markdown",
		"vue",
		"javascript",
		"typescript",
		"html",
		"css"
	]);
	const languageInput = Object.assign({}, bundledLanguages);
	for (const option of options) {
		const langs = option?.langs;
		if (langs == null) continue;
		if (Array.isArray(langs)) for (const lang of langs.flat()) if (typeof lang === "function") console.error(red("[slidev] `langs` option returned by setup/shiki.ts cannot be an array containing functions. Please use the record format (`{ [name]: () => {...} }`) instead."));
		else if (typeof lang === "string") languageNames.add(lang);
		else if (lang.name) {
			languageNames.add(lang.name);
			languageInput[lang.name] = lang;
			for (const alias of lang.aliases || []) {
				languageNames.add(alias);
				languageInput[alias] = lang;
			}
		} else console.error(red("[slidev] Invalid lang option in shiki setup:"), lang);
		else if (typeof langs === "object") {
			for (const name of Object.keys(langs)) languageNames.add(name);
			Object.assign(languageInput, langs);
		} else console.error(red("[slidev] Invalid langs option in shiki setup:"), langs);
	}
	return {
		options: mergedOptions,
		themeOption,
		themeNames,
		themeInput,
		languageNames,
		languageInput
	};
}
function extractThemeName(theme) {
	if (!theme) return void 0;
	if (typeof theme === "string") return theme;
	if (!theme.name) console.warn(yellow("[slidev] Theme"), theme, yellow("does not have a name, which may cause issues."));
	return theme.name;
}
function extractThemeNames(themes) {
	if (!themes) return {};
	return objectMap(themes, (key, theme) => {
		const name = extractThemeName(theme);
		if (!name) return void 0;
		return [key, name];
	});
}

//#endregion
//#region node/setups/shiki.ts
let cachedRoots;
let cachedShiki;
async function setupShiki(roots) {
	if (cachedRoots === roots) return cachedShiki;
	const { options, languageInput, themeInput } = resolveShikiOptions(await loadSetups(roots, "shiki.ts", [{ async loadTheme(path$1) {
		console.warn("[slidev] `loadTheme` in `setup/shiki.ts` is deprecated. Pass directly the theme name it's supported by Shiki. For custom themes, load it manually via `JSON.parse(fs.readFileSync(path, 'utf-8'))` and pass the raw JSON object instead.");
		return JSON.parse(await fs$1.readFile(path$1, "utf-8"));
	} }]));
	const createHighlighter = createBundledHighlighter({
		engine: createJavaScriptRegexEngine,
		langs: languageInput,
		themes: themeInput
	});
	cachedRoots = roots;
	return cachedShiki = {
		shiki: createSingletonShorthands(createHighlighter),
		shikiOptions: options
	};
}

//#endregion
//#region node/options.ts
const debug = createDebug("slidev:options");
async function resolveOptions(entryOptions, mode) {
	const entry = await resolveEntry(entryOptions.entry);
	const rootsInfo = await getRoots(entry);
	const loaded = await parser.load(rootsInfo.userRoot, entry, void 0, mode);
	let themeRaw = entryOptions.theme || loaded.headmatter.theme;
	themeRaw = themeRaw === null ? "none" : themeRaw || "default";
	const [theme, themeRoot] = await resolveTheme(themeRaw, entry);
	const themeRoots = themeRoot ? [themeRoot] : [];
	const themeMeta = themeRoot ? await getThemeMeta(theme, themeRoot) : void 0;
	const config = parser.resolveConfig(loaded.headmatter, themeMeta, entryOptions.entry);
	const addonRoots = await resolveAddons(config.addons);
	const roots = uniq([
		...themeRoots,
		...addonRoots,
		rootsInfo.userRoot
	]);
	if (entryOptions.download) config.download ||= entryOptions.download;
	debug({
		...rootsInfo,
		...entryOptions,
		config,
		mode,
		entry,
		themeRaw,
		theme,
		themeRoots,
		addonRoots,
		roots
	});
	const data = {
		...loaded,
		config,
		themeMeta
	};
	const resolved = {
		...rootsInfo,
		...entryOptions,
		data,
		mode,
		entry,
		themeRaw,
		theme,
		themeRoots,
		addonRoots,
		roots
	};
	return {
		...resolved,
		utils: await createDataUtils(resolved)
	};
}
async function createDataUtils(resolved) {
	const monacoTypesIgnorePackagesMatches = (resolved.data.config.monacoTypesIgnorePackages || []).map((i) => pm.makeRe(i));
	let _layouts_cache_time = 0;
	let _layouts_cache = null;
	return {
		...await setupShiki(resolved.roots),
		katexOptions: await setupKatex(resolved.roots),
		indexHtml: await setupIndexHtml(resolved),
		define: getDefine(resolved),
		iconsResolvePath: [resolved.clientRoot, ...resolved.roots].reverse(),
		isMonacoTypesIgnored: (pkg) => monacoTypesIgnorePackagesMatches.some((i) => i.test(pkg)),
		getLayouts: () => {
			const now = Date.now();
			if (_layouts_cache && now - _layouts_cache_time < 2e3) return _layouts_cache;
			_layouts_cache_time = now;
			return _layouts_cache = worker();
			async function worker() {
				const layouts = {};
				const layoutPaths = await Promise.all([resolved.clientRoot, ...resolved.roots].map((root) => fg("layouts/**/*.{vue,js,mjs,ts,mts}", {
					cwd: root,
					absolute: true,
					suppressErrors: true
				})));
				for (const layoutPath of layoutPaths.flat(1)) {
					const layoutName = path.basename(layoutPath).replace(/\.\w+$/, "");
					layouts[layoutName] = layoutPath;
				}
				return layouts;
			}
		}
	};
}
function getDefine(options) {
	const matchMode = (mode) => mode === true || mode === options.mode;
	return objectMap({
		__DEV__: options.mode === "dev",
		__SLIDEV_CLIENT_ROOT__: toAtFS(options.clientRoot),
		__SLIDEV_HASH_ROUTE__: options.data.config.routerMode === "hash",
		__SLIDEV_FEATURE_DRAWINGS__: matchMode(options.data.config.drawings.enabled),
		__SLIDEV_FEATURE_EDITOR__: options.mode === "dev" && options.data.config.editor !== false,
		__SLIDEV_FEATURE_DRAWINGS_PERSIST__: !!options.data.config.drawings.persist,
		__SLIDEV_FEATURE_RECORD__: matchMode(options.data.config.record),
		__SLIDEV_FEATURE_PRESENTER__: matchMode(options.data.config.presenter),
		__SLIDEV_FEATURE_PRINT__: options.mode === "export" || options.mode === "build" && [
			true,
			"true",
			"auto"
		].includes(options.data.config.download),
		__SLIDEV_FEATURE_BROWSER_EXPORTER__: matchMode(options.data.config.browserExporter),
		__SLIDEV_FEATURE_WAKE_LOCK__: matchMode(options.data.config.wakeLock),
		__SLIDEV_HAS_SERVER__: options.mode !== "build"
	}, (v, k) => [v, JSON.stringify(k)]);
}

//#endregion
//#region node/syntax/transform/utils.ts
function normalizeRangeStr(rangeStr = "") {
	return !rangeStr.trim() ? [] : rangeStr.trim().split(/\|/g).map((i) => i.trim());
}
function getCodeBlocks(md) {
	const codeblocks = Array.from(md.matchAll(/^```[\s\S]*?^```/gm)).map((m) => {
		const start = m.index;
		const end = m.index + m[0].length;
		return [
			start,
			end,
			md.slice(0, start).match(/\n/g)?.length || 0,
			md.slice(0, end).match(/\n/g)?.length || 0
		];
	});
	return {
		codeblocks,
		isInsideCodeblocks(idx) {
			return codeblocks.some(([s, e]) => s <= idx && idx <= e);
		},
		isLineInsideCodeblocks(line) {
			return codeblocks.some(([, , s, e]) => s <= line && line <= e);
		}
	};
}
function getCommentBlocks(md) {
	const commentBlocks = Array.from(md.matchAll(/<!--[\s\S]*?-->/g)).map((m) => {
		const start = m.index;
		const end = m.index + m[0].length;
		return [
			start,
			end,
			md.slice(0, start).match(/\n/g)?.length || 0,
			md.slice(0, end).match(/\n/g)?.length || 0
		];
	});
	return {
		commentBlocks,
		isInsideCommentBlocks(idx) {
			return commentBlocks.some(([s, e]) => s <= idx && idx <= e);
		},
		isLineInsideCommentBlocks(line) {
			return commentBlocks.some(([, , s, e]) => s <= line && line <= e);
		}
	};
}
/**
* Escape `{{` in code block to prevent Vue interpret it, #99, #1316
*/
function escapeVueInCode(md) {
	return md.replace(/\{\{/g, "&lbrace;&lbrace;");
}

//#endregion
//#region node/syntax/markdown-it/markdown-it-katex.ts
function isValidDelim(state, pos) {
	const max = state.posMax;
	let can_open = true;
	let can_close = true;
	const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1;
	const nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1;
	if (prevChar === 32 || prevChar === 9 || nextChar >= 48 && nextChar <= 57) can_close = false;
	if (nextChar === 32 || nextChar === 9) can_open = false;
	return {
		can_open,
		can_close
	};
}
function math_inline(state, silent) {
	let match, token, res, pos;
	if (state.src[state.pos] !== "$") return false;
	res = isValidDelim(state, state.pos);
	if (!res.can_open) {
		if (!silent) state.pending += "$";
		state.pos += 1;
		return true;
	}
	const start = state.pos + 1;
	match = start;
	while ((match = state.src.indexOf("$", match)) !== -1) {
		pos = match - 1;
		while (state.src[pos] === "\\") pos -= 1;
		if ((match - pos) % 2 === 1) break;
		match += 1;
	}
	if (match === -1) {
		if (!silent) state.pending += "$";
		state.pos = start;
		return true;
	}
	if (match - start === 0) {
		if (!silent) state.pending += "$$";
		state.pos = start + 1;
		return true;
	}
	res = isValidDelim(state, match);
	if (!res.can_close) {
		if (!silent) state.pending += "$";
		state.pos = start;
		return true;
	}
	if (!silent) {
		token = state.push("math_inline", "math", 0);
		token.markup = "$";
		token.content = state.src.slice(start, match);
	}
	state.pos = match + 1;
	return true;
}
function math_block(state, start, end, silent) {
	let firstLine;
	let lastLine;
	let next;
	let lastPos;
	let found = false;
	let pos = state.bMarks[start] + state.tShift[start];
	let max = state.eMarks[start];
	if (pos + 2 > max) return false;
	if (state.src.slice(pos, pos + 2) !== "$$") return false;
	pos += 2;
	firstLine = state.src.slice(pos, max);
	if (silent) return true;
	if (firstLine.trim().slice(-2) === "$$") {
		firstLine = firstLine.trim().slice(0, -2);
		found = true;
	}
	for (next = start; !found;) {
		next++;
		if (next >= end) break;
		pos = state.bMarks[next] + state.tShift[next];
		max = state.eMarks[next];
		if (pos < max && state.tShift[next] < state.blkIndent) break;
		if (state.src.slice(pos, max).trim().slice(-2) === "$$") {
			lastPos = state.src.slice(0, max).lastIndexOf("$$");
			lastLine = state.src.slice(pos, lastPos);
			found = true;
		}
	}
	state.line = next + 1;
	const token = state.push("math_block", "math", 0);
	token.block = true;
	token.content = (firstLine && firstLine.trim() ? `${firstLine}\n` : "") + state.getLines(start + 1, next, state.tShift[start], true) + (lastLine && lastLine.trim() ? lastLine : "");
	token.map = [start, state.line];
	token.markup = "$$";
	return true;
}
function MarkdownItKatex(md, options) {
	const katexInline = function(latex) {
		options.displayMode = false;
		try {
			return escapeVueInCode(katex.renderToString(latex, options));
		} catch (error) {
			if (options.throwOnError) console.warn(error);
			return latex;
		}
	};
	const inlineRenderer = function(tokens, idx) {
		return katexInline(tokens[idx].content);
	};
	const katexBlock = function(latex) {
		options.displayMode = true;
		try {
			return `<p>${escapeVueInCode(katex.renderToString(latex, options))}</p>`;
		} catch (error) {
			if (options.throwOnError) console.warn(error);
			return latex;
		}
	};
	const blockRenderer = function(tokens, idx) {
		return `${katexBlock(tokens[idx].content)}\n`;
	};
	md.inline.ruler.after("escape", "math_inline", math_inline);
	md.block.ruler.after("blockquote", "math_block", math_block, { alt: [
		"paragraph",
		"reference",
		"blockquote",
		"list"
	] });
	md.renderer.rules.math_inline = inlineRenderer;
	md.renderer.rules.math_block = blockRenderer;
}

//#endregion
//#region node/virtual/configs.ts
const templateConfigs = {
	id: "/@slidev/configs",
	getContent({ data, remote }) {
		const config = {
			...data.config,
			remote,
			slidesTitle: getSlideTitle(data)
		};
		if (isString(config.info)) config.info = sharedMd.render(config.info);
		return `export default ${JSON.stringify(config)}`;
	}
};

//#endregion
//#region node/virtual/deprecated.ts
/**
* Kept for backward compatibility, use #slidev/slides instead
*
* @deprecated
*/
const templateLegacyRoutes = {
	id: "/@slidev/routes",
	getContent() {
		return [`export { slides } from '#slidev/slides'`, `console.warn('[slidev] #slidev/routes is deprecated, use #slidev/slides instead')`].join("\n");
	}
};
/**
* Kept for backward compatibility, use #slidev/title-renderer instead
*
* @deprecated
*/
const templateLegacyTitles = {
	id: "/@slidev/titles.md",
	getContent() {
		return `
<script setup lang="ts">
import TitleRenderer from '#slidev/title-renderer'
defineProps<{ no: number | string }>()
console.warn('/@slidev/titles.md is deprecated, import from #slidev/title-renderer instead')
<\/script>

<TitleRenderer :no="no" />
`;
	}
};

//#endregion
//#region node/virtual/global-layers.ts
const templateGlobalLayers = {
	id: `/@slidev/global-layers`,
	getContent({ userRoot, roots }) {
		function* getComponent(name, names) {
			yield `const ${name}Components = [\n`;
			for (const root of roots) {
				const globs = names.map((name$1) => join(root, `${name$1}.{ts,js,vue}`));
				yield "  Object.values(";
				yield makeAbsoluteImportGlob(userRoot, globs, { import: "default" });
				yield ")[0],\n";
			}
			yield `].filter(Boolean)\n`;
			yield `export const ${name} = { render: () => ${name}Components.map(comp => h(comp)) }\n\n`;
		}
		return [
			`import { h } from 'vue'\n\n`,
			...getComponent("GlobalTop", [
				"global",
				"global-top",
				"GlobalTop"
			]),
			...getComponent("GlobalBottom", ["global-bottom", "GlobalBottom"]),
			...getComponent("SlideTop", ["slide-top", "SlideTop"]),
			...getComponent("SlideBottom", ["slide-bottom", "SlideBottom"])
		].join("");
	}
};

//#endregion
//#region node/virtual/layouts.ts
const templateLayouts = {
	id: "/@slidev/layouts",
	async getContent({ utils }) {
		const imports = [];
		const layouts = objectMap(await utils.getLayouts(), (k, v) => {
			imports.push(`import __layout_${k} from "${toAtFS(v)}"`);
			return [k, `__layout_${k}`];
		});
		return [imports.join("\n"), `export default {\n${Object.entries(layouts).map(([k, v]) => `"${k}": ${v}`).join(",\n")}\n}`].join("\n\n");
	}
};

//#endregion
//#region node/virtual/monaco-deps.ts
const templateMonacoRunDeps = {
	id: "/@slidev/monaco-run-deps",
	async getContent({ userRoot, data }) {
		if (!data.features.monaco) return "";
		const deps = uniq([
			...data.features.monaco.deps,
			...data.config.monacoTypesAdditionalPackages || [],
			...data.config.monacoRunAdditionalDeps || []
		]);
		const importerPath = resolve(userRoot, "./snippets/__importer__.ts");
		let result = "";
		for (let i = 0; i < deps.length; i++) {
			const specifier = deps[i];
			const resolved = await this.resolve(specifier, importerPath);
			if (!resolved) continue;
			result += `import * as vendored${i} from ${JSON.stringify(resolved.id)}\n`;
		}
		result += "export default {\n";
		for (let i = 0; i < deps.length; i++) result += `${JSON.stringify(deps[i])}: vendored${i},\n`;
		result += "}\n";
		return result;
	}
};

//#endregion
//#region node/virtual/monaco-types.ts
const templateMonacoTypes = {
	id: "/@slidev/monaco-types",
	getContent: async ({ userRoot, data, utils }) => {
		if (!data.features.monaco) return "";
		const typesRoot = join(userRoot, "snippets");
		const files = await fg([
			"**/*.ts",
			"**/*.mts",
			"**/*.cts"
		], { cwd: typesRoot });
		let result = "import { addFile } from \"@slidev/client/setup/monaco.ts\"\n";
		for (const file of files) {
			const url = `${toAtFS(resolve(typesRoot, file))}?monaco-types&raw`;
			result += `addFile(() => import(${JSON.stringify(url)}), ${JSON.stringify(file)})\n`;
		}
		function mapModuleNameToModule(moduleSpecifier) {
			if (moduleSpecifier.startsWith("node:")) return "node";
			if (builtinModules.includes(moduleSpecifier)) return "node";
			const mainPackageName = moduleSpecifier.split("/")[0];
			if (builtinModules.includes(mainPackageName) && !mainPackageName.startsWith("@")) return "node";
			const [a = "", b = ""] = moduleSpecifier.split("/");
			return a.startsWith("@") ? `${a}/${b}` : a;
		}
		let deps = [...data.config.monacoTypesAdditionalPackages];
		if (data.config.monacoTypesSource === "local") deps.push(...data.features.monaco.types);
		deps = uniq(deps.map((specifier) => {
			if (specifier[0] === ".") return "";
			return mapModuleNameToModule(specifier);
		}).filter(Boolean));
		deps = deps.filter((pkg) => !utils.isMonacoTypesIgnored(pkg));
		for (const pkg of deps) result += `import(${JSON.stringify(`/@slidev-monaco-types/resolve?${new URLSearchParams({ pkg })}`)})\n`;
		return result;
	}
};

//#endregion
//#region node/virtual/nav-controls.ts
const templateNavControls = {
	id: "/@slidev/custom-nav-controls",
	getContent({ roots }) {
		const components = roots.flatMap((root) => {
			return [join(root, "custom-nav-controls.vue"), join(root, "CustomNavControls.vue")];
		}).filter((i) => existsSync(i));
		return `${components.map((i, idx) => `import __n${idx} from '${toAtFS(i)}'`).join("\n")}
import { h } from 'vue'
export default {
  render: () => [${components.map((i, idx) => `h(__n${idx})`).join(",")}],
}`;
	}
};

//#endregion
//#region node/virtual/setups.ts
function createSetupTemplate(name) {
	return {
		id: `/@slidev/setups/${name}`,
		getContent({ userRoot, roots }) {
			return `export default [${roots.map((root) => {
				return `Object.values(${makeAbsoluteImportGlob(userRoot, [join(root, `setup/${name}.{ts,js,mts,mjs}`)], { import: "default" })})[0]`;
			}).join(", ")}].filter(Boolean)`;
		}
	};
}
const setupModules = [
	"shiki",
	"code-runners",
	"monaco",
	"mermaid",
	"mermaid-renderer",
	"main",
	"root",
	"routes",
	"shortcuts",
	"context-menu"
];
const templateSetups = setupModules.map(createSetupTemplate);

//#endregion
//#region node/virtual/slides.ts
const VIRTUAL_SLIDE_PREFIX = "/@slidev/slides/";
const templateSlides = {
	id: "/@slidev/slides",
	async getContent({ data, utils }) {
		const statements = [
			`import { defineAsyncComponent, shallowRef } from 'vue'`,
			`import SlideError from '${(await utils.getLayouts()).error}'`,
			`import SlideLoading from '@slidev/client/internals/SlideLoading.vue'`,
			`const componentsCache = new Array(${data.slides.length})`,
			`const getAsyncComponent = (idx, loader) => defineAsyncComponent({`,
			`  loader,`,
			`  delay: 300,`,
			`  loadingComponent: SlideLoading,`,
			`  errorComponent: SlideError,`,
			`  onError: e => console.error('Failed to load slide ' + (idx + 1), e) `,
			`})`
		];
		const slides = data.slides.map((_, idx) => {
			const no = idx + 1;
			statements.push(`import { meta as f${no} } from '${VIRTUAL_SLIDE_PREFIX}${no}/frontmatter'`, `const load${no} = async () => {`, `  try { return componentsCache[${idx}] ??= await import('${VIRTUAL_SLIDE_PREFIX}${no}/md') }`, `  catch (e) { console.error('slide failed to load', e); return SlideError }`, `}`);
			return `{ no: ${no}, meta: f${no}, load: load${no}, component: getAsyncComponent(${idx}, load${no}) }`;
		});
		return [
			...statements,
			`const data = [\n${slides.join(",\n")}\n]`,
			`if (import.meta.hot) {`,
			`  import.meta.hot.data.slides ??= shallowRef()`,
			`  import.meta.hot.data.slides.value = data`,
			`  import.meta.hot.dispose(() => componentsCache.length = 0)`,
			`  import.meta.hot.accept()`,
			`}`,
			`export const slides = import.meta.hot ? import.meta.hot.data.slides : shallowRef(data)`
		].join("\n");
	}
};

//#endregion
//#region node/virtual/styles.ts
const templateStyle = {
	id: "/@slidev/styles",
	async getContent({ data, clientRoot, userRoot, roots }) {
		function resolveUrlOfClient(name) {
			return toAtFS(join(clientRoot, name));
		}
		const imports = [
			"styles/vars.css",
			"styles/index.css",
			"styles/code.css",
			"styles/katex.css",
			"styles/transitions.css"
		].map((path$1) => makeAbsoluteImportGlob(userRoot, [join(clientRoot, path$1)]));
		for (const root of roots) imports.push(makeAbsoluteImportGlob(userRoot, [
			join(root, "styles/index.{ts,js,css}"),
			join(root, "styles.{ts,js,css}"),
			join(root, "style.{ts,js,css}")
		]));
		if (data.features.katex) imports.push(`import "${await resolveImportUrl("katex/dist/katex.min.css")}"`);
		if (data.config.highlighter === "shiki") imports.push(`import "${await resolveImportUrl("@shikijs/vitepress-twoslash/style.css")}"`, `import "${resolveUrlOfClient("styles/shiki-twoslash.css")}"`, `import "${await resolveImportUrl("shiki-magic-move/style.css")}"`);
		imports.unshift(`import "${await resolveImportUrl("@unocss/reset/tailwind.css")}"`, "import \"uno:preflights.css\"", "import \"uno:typography.css\"", "import \"uno:shortcuts.css\"");
		imports.push("import \"uno.css\"");
		return imports.join("\n");
	}
};

//#endregion
//#region node/virtual/titles.ts
const templateTitleRendererMd = {
	id: "/@slidev/title-renderer.md",
	getContent({ data }) {
		const lines = data.slides.map(({ title }, i) => `<template ${i === 0 ? "v-if" : "v-else-if"}="no === ${i + 1}">\n\n${title}\n\n</template>`);
		lines.push(`<script setup lang="ts">`, `import { useSlideContext } from '@slidev/client/context.ts'`, `import { computed } from 'vue'`, `const props = defineProps<{ no?: number | string }>()`, `const { $page } = useSlideContext()`, `const no = computed(() => +(props.no ?? $page.value))`, `<\/script>`);
		return lines.join("\n");
	}
};
const templateTitleRenderer = {
	id: "/@slidev/title-renderer",
	async getContent() {
		return "export { default } from \"/@slidev/title-renderer.md\"";
	}
};

//#endregion
//#region node/virtual/index.ts
const templates = [
	templateMonacoTypes,
	templateMonacoRunDeps,
	templateConfigs,
	templateStyle,
	templateGlobalLayers,
	templateNavControls,
	templateSlides,
	templateLayouts,
	templateTitleRenderer,
	templateTitleRendererMd,
	...templateSetups,
	templateLegacyRoutes,
	templateLegacyTitles
];

//#endregion
//#region node/vite/loaders.ts
function createSlidesLoader(options, serverOptions) {
	const { data, mode, utils, withoutNotes } = options;
	const notesMd = MarkdownExit({ html: true });
	notesMd.use(MarkdownItLink);
	if (data.features.katex) notesMd.use(MarkdownItKatex, utils.katexOptions);
	const hmrSlidesIndexes = /* @__PURE__ */ new Set();
	let server;
	let skipHmr = null;
	let sourceIds = resolveSourceIds(data);
	function resolveSourceIds(data$1) {
		const ids = {
			md: [],
			frontmatter: []
		};
		for (const type of ["md", "frontmatter"]) for (let i = 0; i < data$1.slides.length; i++) ids[type].push(`${data$1.slides[i].source.filepath}__slidev_${i + 1}.${type}`);
		return ids;
	}
	function updateServerWatcher() {
		if (!server) return;
		server.watcher.add(Object.keys(data.watchFiles));
	}
	function getFrontmatter(pageNo) {
		return {
			...data.headmatter?.defaults || {},
			...data.slides[pageNo]?.frontmatter || {}
		};
	}
	return {
		name: "slidev:loader",
		enforce: "pre",
		configureServer(_server) {
			server = _server;
			updateServerWatcher();
			server.middlewares.use(async (req, res, next) => {
				const match = req.url?.match(regexSlideReqPath);
				if (!match) return next();
				const [, no] = match;
				const idx = Number.parseInt(no) - 1;
				if (req.method === "GET") {
					res.write(JSON.stringify(withRenderedNote(data.slides[idx])));
					return res.end();
				} else if (req.method === "POST") {
					const body = await getBodyJson(req);
					const slide = data.slides[idx];
					if (body.content && body.content !== slide.source.content) hmrSlidesIndexes.add(idx);
					if (body.content) slide.content = slide.source.content = body.content;
					if (body.frontmatterRaw != null) if (body.frontmatterRaw.trim() === "") slide.source.frontmatterDoc = slide.source.frontmatterStyle = void 0;
					else {
						const parsed = YAML.parseDocument(body.frontmatterRaw);
						if (parsed.errors.length) console.error("ERROR when saving frontmatter", parsed.errors);
						else slide.source.frontmatterDoc = parsed;
					}
					if (body.note) slide.note = slide.source.note = body.note;
					if (body.frontmatter) {
						updateFrontmatterPatch(slide.source, body.frontmatter);
						Object.assign(slide.frontmatter, body.frontmatter);
					}
					parser.prettifySlide(slide.source);
					const fileContent = await parser.save(data.markdownFiles[slide.source.filepath]);
					if (body.skipHmr) {
						skipHmr = {
							filePath: slide.source.filepath,
							fileContent
						};
						server?.moduleGraph.invalidateModule(server.moduleGraph.getModuleById(sourceIds.md[idx]));
						if (body.frontmatter) server?.moduleGraph.invalidateModule(server.moduleGraph.getModuleById(sourceIds.frontmatter[idx]));
					}
					res.statusCode = 200;
					res.write(JSON.stringify(withRenderedNote(slide)));
					return res.end();
				}
				next();
			});
		},
		async handleHotUpdate(ctx) {
			const forceChangedSlides = data.watchFiles[ctx.file];
			if (!forceChangedSlides) return;
			for (const index of forceChangedSlides) hmrSlidesIndexes.add(index);
			const newData = await serverOptions.loadData?.({ [ctx.file]: await ctx.read() });
			if (!newData) return [];
			if (skipHmr && newData.markdownFiles[skipHmr.filePath]?.raw === skipHmr.fileContent) {
				skipHmr = null;
				return [];
			}
			const moduleIds = /* @__PURE__ */ new Set();
			const newSourceIds = resolveSourceIds(newData);
			for (const type of ["md", "frontmatter"]) {
				const old = sourceIds[type];
				const newIds = newSourceIds[type];
				for (let i = 0; i < newIds.length; i++) if (old[i] !== newIds[i]) moduleIds.add(`${VIRTUAL_SLIDE_PREFIX}${i + 1}/${type}`);
			}
			sourceIds = newSourceIds;
			if (data.slides.length !== newData.slides.length) moduleIds.add(templateSlides.id);
			if (!equal(data.headmatter.defaults, newData.headmatter.defaults)) {
				moduleIds.add(templateSlides.id);
				range(data.slides.length).map((i) => hmrSlidesIndexes.add(i));
			}
			if (!equal(data.config, newData.config)) moduleIds.add(templateConfigs.id);
			if (!equal(data.features, newData.features)) setTimeout(() => {
				ctx.server.hot.send({ type: "full-reload" });
			}, 1);
			const length = Math.min(data.slides.length, newData.slides.length);
			for (let i = 0; i < length; i++) {
				const a = data.slides[i];
				const b = newData.slides[i];
				if (!hmrSlidesIndexes.has(i) && a.content.trim() === b.content.trim() && a.title?.trim() === b.title?.trim() && equal(a.frontmatter, b.frontmatter)) {
					if (a.note !== b.note) ctx.server.hot.send("slidev:update-note", {
						no: i + 1,
						note: b.note || "",
						noteHTML: renderNote(b.note || "")
					});
					continue;
				}
				ctx.server.hot.send("slidev:update-slide", {
					no: i + 1,
					data: withRenderedNote(newData.slides[i])
				});
				hmrSlidesIndexes.add(i);
			}
			Object.assign(data, newData);
			Object.assign(utils, createDataUtils(options));
			if (hmrSlidesIndexes.size > 0) moduleIds.add(templateTitleRendererMd.id);
			for (const idx of hmrSlidesIndexes) moduleIds.add(sourceIds.frontmatter[idx]);
			const reloadBeforeOthers = [];
			const vueModules = [];
			for (const idx of hmrSlidesIndexes) {
				const main = ctx.server.moduleGraph.getModuleById(sourceIds.md[idx]);
				if (main) {
					const styles = [...main.clientImportedModules].filter((m) => m.id?.includes(`&type=style`));
					if (styles.length) {
						reloadBeforeOthers.push(main);
						vueModules.push(...styles);
					} else vueModules.push(main);
				}
			}
			hmrSlidesIndexes.clear();
			await Promise.all(reloadBeforeOthers.map((m) => ctx.server.reloadModule(m)));
			const moduleEntries = [
				...ctx.modules.filter((i) => i.id === templateMonacoRunDeps.id || i.id === templateMonacoTypes.id),
				...vueModules,
				...Array.from(moduleIds).map((id) => ctx.server.moduleGraph.getModuleById(id))
			].filter(notNullish).filter((i) => !i.id?.startsWith("/@id/@vite-icons"));
			updateServerWatcher();
			return moduleEntries;
		},
		resolveId: {
			order: "pre",
			handler(id) {
				if (id.startsWith("/@slidev/") || id.includes("__slidev_")) return id;
				return null;
			}
		},
		async load(id) {
			const template = templates.find((i) => i.id === id);
			if (template) return {
				code: await template.getContent.call(this, options),
				map: { mappings: "" }
			};
			const matchFacade = id.match(regexSlideFacadeId);
			if (matchFacade) {
				const [, no, type] = matchFacade;
				const idx = +no - 1;
				const sourceId = JSON.stringify(sourceIds[type][idx]);
				return [`export * from ${sourceId}`, `export { default } from ${sourceId}`].join("\n");
			}
			const matchSource = id.match(regexSlideSourceId);
			if (matchSource) {
				const [, no, type] = matchSource;
				const idx = +no - 1;
				const slide = data.slides[idx];
				if (!slide) return;
				if (type === "md") return {
					code: slide.content,
					map: { mappings: "" }
				};
				else if (type === "frontmatter") {
					const slideBase = {
						...withRenderedNote(slide),
						frontmatter: void 0,
						source: void 0,
						importChain: void 0,
						...mode === "build" ? {
							raw: "",
							content: "",
							note: ""
						} : {}
					};
					const fontmatter = getFrontmatter(idx);
					return {
						code: [
							"// @unocss-include",
							"import { computed, reactive, shallowReactive } from \"vue\"",
							`export const frontmatterData = ${JSON.stringify(fontmatter)}`,
							"if (import.meta.hot) {",
							"  import.meta.hot.data.frontmatter ??= reactive(frontmatterData)",
							"  import.meta.hot.accept(({ frontmatterData: update }) => {",
							"    const frontmatter = import.meta.hot.data.frontmatter",
							"    Object.keys(frontmatter).forEach(key => {",
							"      if (!(key in update)) delete frontmatter[key]",
							"    })",
							"    Object.assign(frontmatter, update)",
							"  })",
							"}",
							"export const frontmatter = import.meta.hot ? import.meta.hot.data.frontmatter : reactive(frontmatterData)",
							"export default frontmatter",
							"export const meta = shallowReactive({",
							"  get layout(){ return frontmatter.layout },",
							"  get transition(){ return frontmatter.transition },",
							"  get class(){ return frontmatter.class },",
							"  get clicks(){ return frontmatter.clicks },",
							"  get name(){ return frontmatter.name },",
							"  get preload(){ return frontmatter.preload },",
							"  slide: {",
							`    ...(${JSON.stringify(slideBase)}),`,
							`    frontmatter,`,
							`    filepath: ${JSON.stringify(mode === "dev" ? slide.source.filepath : "")},`,
							`    start: ${JSON.stringify(slide.source.start)},`,
							`    id: ${idx},`,
							`    no: ${no},`,
							"  },",
							"  __clicksContext: null,",
							"  __preloaded: false,",
							"})"
						].join("\n"),
						map: { mappings: "" }
					};
				}
			}
			if (data.markdownFiles[id]) return "";
		}
	};
	function renderNote(text = "") {
		if (withoutNotes) return "";
		let clickCount = 0;
		const notesAutoRuby = data.headmatter.notesAutoRuby || {};
		let md = text.replace(/\[click(?::(\d+))?\]/gi, (_, count = 1) => {
			clickCount += Number(count);
			return `<span class="slidev-note-click-mark" data-clicks="${clickCount}"></span>`;
		});
		const keys = Object.keys(notesAutoRuby).sort((b, a) => b.length - a.length).map((i) => /^[\w-]+$/.test(i) ? `\\b${i}\\b` : i);
		if (keys.length) {
			const regex = new RegExp(`(${keys.join("|")})`, "g");
			md = md.replace(regex, (match) => {
				if (notesAutoRuby[match]) return `<ruby>${match}<rt>${notesAutoRuby[match]}</rt></ruby>`;
				return match;
			});
		}
		return notesMd.render(md);
	}
	function withRenderedNote(data$1) {
		return {
			...data$1,
			...withoutNotes && { note: "" },
			noteHTML: renderNote(data$1?.note)
		};
	}
}

//#endregion
//#region ../../node_modules/.pnpm/@hedgedoc+markdown-it-plugins@2.1.4_patch_hash=49e14003b6caa0b7d164cbe71da573809d375bab_0dce998d26f79c06311f476731d22630/node_modules/@hedgedoc/markdown-it-plugins/dist/esm/image-size/specialCharacters.js
var SpecialCharacters;
(function(SpecialCharacters$1) {
	SpecialCharacters$1[SpecialCharacters$1["EXCLAMATION_MARK"] = 33] = "EXCLAMATION_MARK";
	SpecialCharacters$1[SpecialCharacters$1["OPENING_BRACKET"] = 91] = "OPENING_BRACKET";
	SpecialCharacters$1[SpecialCharacters$1["OPENING_PARENTHESIS"] = 40] = "OPENING_PARENTHESIS";
	SpecialCharacters$1[SpecialCharacters$1["WHITESPACE"] = 32] = "WHITESPACE";
	SpecialCharacters$1[SpecialCharacters$1["NEW_LINE"] = 10] = "NEW_LINE";
	SpecialCharacters$1[SpecialCharacters$1["EQUALS"] = 61] = "EQUALS";
	SpecialCharacters$1[SpecialCharacters$1["LOWER_CASE_X"] = 120] = "LOWER_CASE_X";
	SpecialCharacters$1[SpecialCharacters$1["NUMBER_ZERO"] = 48] = "NUMBER_ZERO";
	SpecialCharacters$1[SpecialCharacters$1["NUMBER_NINE"] = 57] = "NUMBER_NINE";
	SpecialCharacters$1[SpecialCharacters$1["PERCENTAGE"] = 37] = "PERCENTAGE";
	SpecialCharacters$1[SpecialCharacters$1["CLOSING_PARENTHESIS"] = 41] = "CLOSING_PARENTHESIS";
})(SpecialCharacters || (SpecialCharacters = {}));

//#endregion
//#region ../../node_modules/.pnpm/markdown-it@14.1.1/node_modules/markdown-it/lib/token.mjs
/**
* class Token
**/
/**
* new Token(type, tag, nesting)
*
* Create new token and fill passed properties.
**/
function Token(type, tag, nesting) {
	/**
	* Token#type -> String
	*
	* Type of the token (string, e.g. "paragraph_open")
	**/
	this.type = type;
	/**
	* Token#tag -> String
	*
	* html tag name, e.g. "p"
	**/
	this.tag = tag;
	/**
	* Token#attrs -> Array
	*
	* Html attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
	**/
	this.attrs = null;
	/**
	* Token#map -> Array
	*
	* Source map info. Format: `[ line_begin, line_end ]`
	**/
	this.map = null;
	/**
	* Token#nesting -> Number
	*
	* Level change (number in {-1, 0, 1} set), where:
	*
	* -  `1` means the tag is opening
	* -  `0` means the tag is self-closing
	* - `-1` means the tag is closing
	**/
	this.nesting = nesting;
	/**
	* Token#level -> Number
	*
	* nesting level, the same as `state.level`
	**/
	this.level = 0;
	/**
	* Token#children -> Array
	*
	* An array of child nodes (inline and img tokens)
	**/
	this.children = null;
	/**
	* Token#content -> String
	*
	* In a case of self-closing tag (code, html, fence, etc.),
	* it has contents of this tag.
	**/
	this.content = "";
	/**
	* Token#markup -> String
	*
	* '*' or '_' for emphasis, fence string for fence, etc.
	**/
	this.markup = "";
	/**
	* Token#info -> String
	*
	* Additional information:
	*
	* - Info string for "fence" tokens
	* - The value "auto" for autolink "link_open" and "link_close" tokens
	* - The string value of the item marker for ordered-list "list_item_open" tokens
	**/
	this.info = "";
	/**
	* Token#meta -> Object
	*
	* A place for plugins to store an arbitrary data
	**/
	this.meta = null;
	/**
	* Token#block -> Boolean
	*
	* True for block-level tokens, false for inline tokens.
	* Used in renderer to calculate line breaks
	**/
	this.block = false;
	/**
	* Token#hidden -> Boolean
	*
	* If it's true, ignore this element when rendering. Used for tight lists
	* to hide paragraphs.
	**/
	this.hidden = false;
}
/**
* Token.attrIndex(name) -> Number
*
* Search attribute index by name.
**/
Token.prototype.attrIndex = function attrIndex(name) {
	if (!this.attrs) return -1;
	const attrs = this.attrs;
	for (let i = 0, len = attrs.length; i < len; i++) if (attrs[i][0] === name) return i;
	return -1;
};
/**
* Token.attrPush(attrData)
*
* Add `[ name, value ]` attribute to list. Init attrs if necessary
**/
Token.prototype.attrPush = function attrPush(attrData) {
	if (this.attrs) this.attrs.push(attrData);
	else this.attrs = [attrData];
};
/**
* Token.attrSet(name, value)
*
* Set `name` attribute to `value`. Override old value if exists.
**/
Token.prototype.attrSet = function attrSet(name, value) {
	const idx = this.attrIndex(name);
	const attrData = [name, value];
	if (idx < 0) this.attrPush(attrData);
	else this.attrs[idx] = attrData;
};
/**
* Token.attrGet(name)
*
* Get the value of attribute `name`, or null if it does not exist.
**/
Token.prototype.attrGet = function attrGet(name) {
	const idx = this.attrIndex(name);
	let value = null;
	if (idx >= 0) value = this.attrs[idx][1];
	return value;
};
/**
* Token.attrJoin(name, value)
*
* Join value to existing attribute via space. Or create new attribute if not
* exists. Useful to operate with token classes.
**/
Token.prototype.attrJoin = function attrJoin(name, value) {
	const idx = this.attrIndex(name);
	if (idx < 0) this.attrPush([name, value]);
	else this.attrs[idx][1] = this.attrs[idx][1] + " " + value;
};
var token_default = Token;

//#endregion
//#region ../../node_modules/.pnpm/@hedgedoc+markdown-it-plugins@2.1.4_patch_hash=49e14003b6caa0b7d164cbe71da573809d375bab_0dce998d26f79c06311f476731d22630/node_modules/@hedgedoc/markdown-it-plugins/dist/esm/task-lists/index.js
const checkboxRegex = /^ *\[([\sx])] /i;
function taskLists(md, options = {
	enabled: false,
	label: false,
	lineNumber: false
}) {
	md.core.ruler.after("inline", "task-lists", (state) => processToken(state, options));
	md.renderer.rules.taskListItemCheckbox = (tokens) => {
		const token = tokens[0];
		const checkedAttribute = token.attrGet("checked") ? "checked=\"\" " : "";
		const disabledAttribute = token.attrGet("disabled") ? "disabled=\"\" " : "";
		const line = token.attrGet("line");
		const idAttribute = `id="${token.attrGet("id")}" `;
		return `<input class="task-list-item-checkbox" type="checkbox" ${checkedAttribute}${disabledAttribute}${line && options.lineNumber ? `data-line="${line}" ` : ""}${idAttribute}/>`;
	};
	md.renderer.rules.taskListItemLabel_close = () => {
		return "</label>";
	};
	md.renderer.rules.taskListItemLabel_open = (tokens) => {
		return `<label for="${tokens[0].attrGet("id")}">`;
	};
}
function processToken(state, options) {
	const allTokens = state.tokens;
	for (let i = 2; i < allTokens.length; i++) {
		if (!isTodoItem(allTokens, i)) continue;
		todoify(allTokens[i], options);
		allTokens[i - 2].attrJoin("class", `task-list-item ${options.enabled ? " enabled" : ""}`);
		const parentToken = findParentToken(allTokens, i - 2);
		if (parentToken) {
			if (!(parentToken.attrGet("class") ?? "").match(/(^| )contains-task-list/)) parentToken.attrJoin("class", "contains-task-list");
		}
	}
	return false;
}
function findParentToken(tokens, index) {
	const targetLevel = tokens[index].level - 1;
	for (let currentTokenIndex = index - 1; currentTokenIndex >= 0; currentTokenIndex--) if (tokens[currentTokenIndex].level === targetLevel) return tokens[currentTokenIndex];
}
function isTodoItem(tokens, index) {
	return isInline(tokens[index]) && isParagraph(tokens[index - 1]) && isListItem(tokens[index - 2]) && startsWithTodoMarkdown(tokens[index]);
}
function todoify(token, options) {
	if (token.children == null) return;
	const id = generateIdForToken(token);
	token.children.splice(0, 0, createCheckboxToken(token, options.enabled, id));
	token.children[1].content = token.children[1].content.replace(checkboxRegex, "");
	if (options.label) {
		token.children.splice(1, 0, createLabelBeginToken(id));
		token.children.push(createLabelEndToken());
	}
}
function generateIdForToken(token) {
	if (token.map) return `task-item-${token.map[0]}`;
	else return `task-item-${Math.ceil(Math.random() * (1e4 * 1e3) - 1e3)}`;
}
function createCheckboxToken(token, enabled, id) {
	const checkbox = new token_default("taskListItemCheckbox", "", 0);
	if (!enabled) checkbox.attrSet("disabled", "true");
	if (token.map) checkbox.attrSet("line", token.map[0].toString());
	checkbox.attrSet("id", id);
	if (checkboxRegex.exec(token.content)?.[1].toLowerCase() === "x") checkbox.attrSet("checked", "true");
	return checkbox;
}
function createLabelBeginToken(id) {
	const labelBeginToken = new token_default("taskListItemLabel_open", "", 1);
	labelBeginToken.attrSet("id", id);
	return labelBeginToken;
}
function createLabelEndToken() {
	return new token_default("taskListItemLabel_close", "", -1);
}
function isInline(token) {
	return token.type === "inline";
}
function isParagraph(token) {
	return token.type === "paragraph_open";
}
function isListItem(token) {
	return token.type === "list_item_open";
}
function startsWithTodoMarkdown(token) {
	return checkboxRegex.test(token.content);
}

//#endregion
//#region node/syntax/markdown-it/markdown-it-escape-code.ts
function MarkdownItEscapeInlineCode(md) {
	const codeInline = md.renderer.rules.code_inline;
	md.renderer.rules.code_inline = async (tokens, idx, options, env, self) => {
		return (await codeInline(tokens, idx, options, env, self)).replace(/^<code/, "<code v-pre");
	};
}

//#endregion
//#region node/syntax/markdown-it/markdown-it-shiki.ts
async function MarkdownItShiki({ data: { config }, mode, utils: { shiki, shikiOptions } }) {
	async function getTwoslashTransformer() {
		const [, , { transformerTwoslash }] = await Promise.all([
			shiki.codeToHast("", {
				lang: "js",
				...shikiOptions
			}),
			shiki.codeToHast("", {
				lang: "ts",
				...shikiOptions
			}),
			import("@shikijs/vitepress-twoslash")
		]);
		return transformerTwoslash({
			explicitTrigger: true,
			twoslashOptions: { handbookOptions: { noErrorValidation: true } }
		});
	}
	const transformers = [
		...shikiOptions.transformers || [],
		(config.twoslash === true || config.twoslash === mode) && await getTwoslashTransformer(),
		{
			pre(pre) {
				this.addClassToHast(pre, "slidev-code");
				delete pre.properties.tabindex;
			},
			postprocess(code) {
				return escapeVueInCode(code);
			}
		}
	].filter(isTruthy);
	return fromAsyncCodeToHtml(shiki.codeToHtml, {
		...shikiOptions,
		transformers
	});
}

//#endregion
//#region node/syntax/markdown-it/markdown-it-v-drag.ts
const dragComponentRegex = /<(v-?drag-?\w*)([\s>])/i;
const dragDirectiveRegex = /(?<![</\w])v-drag(=".*?")?/i;
function MarkdownItVDrag(md, markdownTransformMap) {
	const visited = /* @__PURE__ */ new WeakSet();
	const sourceMapConsumers = /* @__PURE__ */ new WeakMap();
	function getSourceMapConsumer(id) {
		const s = markdownTransformMap.get(id);
		if (!s) return void 0;
		let smc = sourceMapConsumers.get(s);
		if (smc) return smc;
		const sourceMap = s.generateMap();
		smc = new SourceMapConsumer({
			...sourceMap,
			version: sourceMap.version.toString()
		});
		sourceMapConsumers.set(s, smc);
		return smc;
	}
	const _parse = md.parse;
	md.parse = function(src, env) {
		const smc = getSourceMapConsumer(env.id);
		const toOriginalPos = smc ? (line) => smc.originalPositionFor({
			line: line + 1,
			column: 0
		}).line - 1 : (line) => line;
		function toMarkdownSource(map, idx) {
			const start = toOriginalPos(map[0]);
			const end = toOriginalPos(map[1]);
			return `[${start},${Math.max(start + 1, end)},${idx}]`;
		}
		function replaceChildren(token, regex, replacement) {
			for (const child of token.children ?? []) {
				if (child.type === "html_block" || child.type === "html_inline") child.content = child.content.replace(regex, replacement);
				replaceChildren(child, regex, replacement);
			}
		}
		return _parse.call(this, src, env).map((token) => {
			if (![
				"html_block",
				"html_inline",
				"inline"
			].includes(token.type) || !token.content.includes("drag") || visited.has(token)) return token;
			token.content = token.content.replace(dragComponentRegex, (_, tag, space, idx) => {
				const replacement = `<${tag} :markdownSource="${toMarkdownSource(token.map, idx)}"${space}`;
				replaceChildren(token, dragComponentRegex, replacement);
				return replacement;
			}).replace(dragDirectiveRegex, (_, value, idx) => {
				const replacement = `v-drag${value ?? ""} :markdownSource="${toMarkdownSource(token.map, idx)}"`;
				replaceChildren(token, dragDirectiveRegex, replacement);
				return replacement;
			});
			visited.add(token);
			return token;
		});
	};
}

//#endregion
//#region node/syntax/markdown-it/index.ts
async function useMarkdownItPlugins(md, options, markdownTransformMap) {
	const { data: { features, config }, utils: { katexOptions } } = options;
	if (config.highlighter === "shiki") md.use(await MarkdownItShiki(options));
	md.use(MarkdownItLink);
	md.use(MarkdownItEscapeInlineCode);
	md.use(MarkdownItFootnote);
	md.use(taskLists, {
		enabled: true,
		lineNumber: true,
		label: true
	});
	if (features.katex) md.use(MarkdownItKatex, katexOptions);
	md.use(MarkdownItVDrag, markdownTransformMap);
	if (config.comark || config.mdc) md.use(MarkdownItComark);
}

//#endregion
//#region node/setups/transformers.ts
async function setupTransformers(roots) {
	const returns = await loadSetups(roots, "transformers.ts", []);
	const result = {
		pre: [],
		preCodeblock: [],
		postCodeblock: [],
		post: []
	};
	for (const r of [...returns].reverse()) {
		if (r.pre) result.pre.push(...r.pre);
		if (r.preCodeblock) result.preCodeblock.push(...r.preCodeblock);
	}
	for (const r of returns) {
		if (r.postCodeblock) result.postCodeblock.push(...r.postCodeblock);
		if (r.post) result.post.push(...r.post);
	}
	return result;
}

//#endregion
//#region node/syntax/transform/code-wrapper.ts
const reCodeBlock = /^```([\w'-]+)?(?:[ \t]*|[ \t][ \w\t'-]*)(?:\[([^\]]*)\])?[ \t]*(?:\{([\w*,|-]+)\}[ \t]*(\{[^}]*\})?([^\r\n]*))?\r?\n((?:(?!^```)[\s\S])*?)^```$/gm;
/**
* Transform code block with wrapper
*/
function transformCodeWrapper(ctx) {
	ctx.s.replace(reCodeBlock, (full, lang = "", title = "", rangeStr = "", options = "", attrs = "", code) => {
		const ranges = normalizeRangeStr(rangeStr);
		code = code.trimEnd();
		options = options.trim() || "{}";
		return `\n<CodeBlockWrapper v-bind="${options}" :title='${JSON.stringify(title)}' :ranges='${JSON.stringify(ranges)}'>\n\n\`\`\`${lang}${title ? ` [${title}]` : ""}${attrs ? ` ${attrs.trim()}` : ""}\n${code}\n\`\`\`\n\n</CodeBlockWrapper>`;
	});
}

//#endregion
//#region node/syntax/transform/in-page-css.ts
/**
* Transform <style> in markdown to scoped style with page selector
*/
function transformPageCSS(ctx) {
	const codeBlocks = getCodeBlocks(ctx.s.original);
	const commentBlocks = getCommentBlocks(ctx.s.original);
	ctx.s.replace(/(\n<style[^>]*>)([\s\S]+?)(<\/style>)/g, (full, start, css, end, index) => {
		if (codeBlocks.isInsideCodeblocks(index)) return full;
		if (commentBlocks.isInsideCommentBlocks(index)) return ``;
		if (!start.includes("scoped")) start = start.replace("<style", "<style scoped");
		return `${start}\n${css}${end}`;
	});
}

//#endregion
//#region node/syntax/transform/katex-wrapper.ts
/**
* Wrapper KaTex syntax `$$...$$` for highlighting
*/
function transformKaTexWrapper(ctx) {
	ctx.s.replace(/^\$\$(?:\s*\{([\w*,|-]+)\}\s*?(?:(\{[^}]*\})\s*?)?)?\n(\S[\s\S]*?)^\$\$/gm, (full, rangeStr = "", options = "", code) => {
		const ranges = !rangeStr.trim() ? [] : rangeStr.trim().split(/\|/g).map((i) => i.trim());
		code = code.trimEnd();
		options = options.trim() || "{}";
		return `<KaTexBlockWrapper v-bind="${options}" :ranges='${JSON.stringify(ranges)}'>\n\n\$\$\n${code}\n\$\$\n</KaTexBlockWrapper>\n`;
	});
}

//#endregion
//#region node/syntax/transform/magic-move.ts
const reMagicMoveBlock = /^````(?:md|markdown) magic-move(?: *\[([^\]]*)\])?(?: *(\{[^}]*\}))? *([^\n]*)\n([\s\S]+?)^````\s*?$/gm;
function parseLineNumbersOption(options) {
	return /lines: *true/.test(options) ? true : /lines: *false/.test(options) ? false : void 0;
}
/**
* Transform magic-move code blocks
*/
async function transformMagicMove(ctx) {
	const { codeToTokens } = ctx.options.utils.shiki;
	const replacements = [];
	ctx.s.replace(reMagicMoveBlock, (full, title = "", options = "{}", _attrs = "", body, start) => {
		const end = start + full.length;
		replacements.push([
			start,
			end,
			worker()
		]);
		return "";
		async function worker() {
			const matches = Array.from(body.matchAll(reCodeBlock));
			if (!matches.length) throw new Error("Magic Move block must contain at least one code block");
			const defaultLineNumbers = parseLineNumbersOption(options) ?? ctx.options.data.config.lineNumbers;
			const ranges = matches.map((i) => normalizeRangeStr(i[3]));
			const steps = await Promise.all(matches.map(async (i) => {
				const lang = i[1];
				const lineNumbers = parseLineNumbersOption(i[4]) ?? defaultLineNumbers;
				const code = i[6].trimEnd();
				const options$1 = {
					...ctx.options.utils.shikiOptions,
					lang
				};
				const { tokens, bg, fg: fg$1, rootStyle, themeName } = await codeToTokens(code, options$1);
				return {
					...toKeyedTokens(code, tokens, JSON.stringify([lang, "themes" in options$1 ? options$1.themes : options$1.theme]), lineNumbers),
					bg,
					fg: fg$1,
					rootStyle,
					themeName,
					lang
				};
			}));
			return `<ShikiMagicMove v-bind="${options}" steps-lz="${lz.compressToBase64(JSON.stringify(steps))}" :title='${JSON.stringify(title)}' :step-ranges='${JSON.stringify(ranges)}' />`;
		}
	});
	for (const [start, end, content] of replacements) ctx.s.overwrite(start, end, await content);
}

//#endregion
//#region node/syntax/transform/mermaid.ts
/**
* Transform Mermaid code blocks (render done on client side)
*/
function transformMermaid(ctx) {
	ctx.s.replace(/^```mermaid *(\{[^\n]*\})?\n([\s\S]+?)\n```/gm, (full, options = "", code = "") => {
		code = code.trim();
		options = options.trim() || "{}";
		return `<Mermaid code-lz="${lz.compressToBase64(code)}" v-bind="${options}" />`;
	});
}

//#endregion
//#region node/syntax/transform/monaco.ts
function transformMonaco(ctx) {
	if (!(ctx.options.data.config.monaco === true || ctx.options.data.config.monaco === ctx.options.mode)) {
		ctx.s.replace(/\{monaco([\w:,-]*)\}/g, "");
		return;
	}
	ctx.s.replace(/^```(\w+) *\{monaco-diff\} *(?:(\{[^\n]*\}) *)?\n([\s\S]+?)^~~~ *\n([\s\S]+?)^```/gm, (full, lang = "ts", options = "{}", code, diff) => {
		lang = lang.trim();
		options = options.trim() || "{}";
		return `<Monaco code-lz="${lz.compressToBase64(code)}" diff-lz="${lz.compressToBase64(diff)}" lang="${lang}" v-bind="${options}" />`;
	});
	ctx.s.replace(/^```(\w+) *\{monaco\} *(?:(\{[^\n]*\}) *)?\n([\s\S]+?)^```/gm, (full, lang = "ts", options = "{}", code) => {
		lang = lang.trim();
		options = options.trim() || "{}";
		return `<Monaco code-lz="${lz.compressToBase64(code)}" lang="${lang}" v-bind="${options}" />`;
	});
	ctx.s.replace(/^```(\w+) *\{monaco-run\} *(?:(\{[^\n]*\}) *)?\n([\s\S]+?)^```/gm, (full, lang = "ts", options = "{}", code) => {
		lang = lang.trim();
		options = options.trim() || "{}";
		return `<Monaco runnable code-lz="${lz.compressToBase64(code)}" lang="${lang}" v-bind="${options}" />`;
	});
}

//#endregion
//#region node/syntax/transform/plant-uml.ts
function transformPlantUml(ctx) {
	const server = ctx.options.data.config.plantUmlServer;
	ctx.s.replace(/^```plantuml[^\n{}]*(\{[^}\n]*\})?\n([\s\S]+?)\n```/gm, (full, options = "", content = "") => {
		const code = encode(content.trim());
		options = options.trim() || "{}";
		return `<PlantUml :code="'${code}'" :server="'${server}'" v-bind="${options}" />`;
	});
}

//#endregion
//#region node/syntax/transform/slot-sugar.ts
function transformSlotSugar(ctx) {
	const linesWithNewline = ctx.s.original.split(/(\r?\n)/g);
	const codeBlocks = getCodeBlocks(ctx.s.original);
	const commentBlocks = getCommentBlocks(ctx.s.original);
	const lines = [];
	for (let i = 0; i < linesWithNewline.length; i += 2) {
		const line = linesWithNewline[i];
		const newline = linesWithNewline[i + 1] || "";
		lines.push(line + newline);
	}
	let prevSlot = false;
	let offset = 0;
	lines.forEach((line) => {
		const start = offset;
		offset += line.length;
		if (codeBlocks.isInsideCodeblocks(offset) || commentBlocks.isInsideCommentBlocks(offset)) return;
		const match = line.match(/^::\s*([\w.\-:]+)\s*::(\s*)$/);
		if (match) {
			ctx.s.overwrite(start, offset - match[2].length, `${prevSlot ? "\n\n</template>\n" : "\n"}<template v-slot:${match[1]}="slotProps">\n`);
			prevSlot = true;
		}
	});
	if (prevSlot) ctx.s.append("\n\n</template>");
}

//#endregion
//#region node/vite/monacoWrite.ts
const monacoWriterWhitelist = /* @__PURE__ */ new Set();
function createMonacoWriterPlugin({ userRoot }) {
	return {
		name: "slidev:monaco-write",
		apply: "serve",
		configureServer(server) {
			server.ws.on("connection", (socket) => {
				socket.on("message", async (data) => {
					let json;
					try {
						json = JSON.parse(data.toString());
					} catch {
						return;
					}
					if (json.type === "custom" && json.event === "slidev:monaco-write") {
						const { file, content } = json.data;
						if (!monacoWriterWhitelist.has(file)) {
							console.error(`[Slidev] Unauthorized file write: ${file}`);
							return;
						}
						const filepath = path.join(userRoot, file);
						console.log("[Slidev] Writing file:", filepath);
						await fs$1.writeFile(filepath, content, "utf-8");
					}
				});
			});
		}
	};
}

//#endregion
//#region node/syntax/transform/snippet.ts
function dedent(text) {
	const lines = text.split("\n");
	const minIndentLength = lines.reduce((acc, line) => {
		for (let i = 0; i < line.length; i++) if (line[i] !== " " && line[i] !== "	") return Math.min(i, acc);
		return acc;
	}, Number.POSITIVE_INFINITY);
	if (minIndentLength < Number.POSITIVE_INFINITY) return lines.map((x) => x.slice(minIndentLength)).join("\n");
	return text;
}
const markers = [
	{
		start: /^\s*\/\/\s*#?region\b\s*(.*?)\s*$/,
		end: /^\s*\/\/\s*#?endregion\b\s*(.*?)\s*$/
	},
	{
		start: /^\s*<!--\s*#?region\b\s*(.*?)\s*-->/,
		end: /^\s*<!--\s*#?endregion\b\s*(.*?)\s*-->/
	},
	{
		start: /^\s*\/\*\s*#region\b\s*(.*?)\s*\*\//,
		end: /^\s*\/\*\s*#endregion\b\s*(.*?)\s*\*\//
	},
	{
		start: /^\s*#[rR]egion\b\s*(.*?)\s*$/,
		end: /^\s*#[eE]nd ?[rR]egion\b\s*(.*?)\s*$/
	},
	{
		start: /^\s*#\s*#?region\b\s*(.*?)\s*$/,
		end: /^\s*#\s*#?endregion\b\s*(.*?)\s*$/
	},
	{
		start: /^\s*(?:--|::|@?REM)\s*#region\b\s*(.*?)\s*$/,
		end: /^\s*(?:--|::|@?REM)\s*#endregion\b\s*(.*?)\s*$/
	},
	{
		start: /^\s*#pragma\s+region\b\s*(.*?)\s*$/,
		end: /^\s*#pragma\s+endregion\b\s*(.*?)\s*$/
	},
	{
		start: /^\s*\(\*\s*#region\b\s*(.*?)\s*\*\)/,
		end: /^\s*\(\*\s*#endregion\b\s*(.*?)\s*\*\)/
	}
];
function findRegion(lines, regionName) {
	let chosen = null;
	for (let i = 0; i < lines.length; i++) {
		for (const re of markers) if (re.start.exec(lines[i])?.[1] === regionName) {
			chosen = {
				re,
				start: i + 1
			};
			break;
		}
		if (chosen) break;
	}
	if (!chosen) return null;
	let counter = 1;
	for (let i = chosen.start; i < lines.length; i++) {
		if (chosen.re.start.exec(lines[i])?.[1] === regionName) {
			counter++;
			continue;
		}
		const endRegion = chosen.re.end.exec(lines[i])?.[1];
		if (endRegion === regionName || endRegion === "") {
			if (--counter === 0) return {
				...chosen,
				end: i
			};
		}
	}
	return null;
}
const reMonacoWrite = /^\{monaco-write\}/;
/**
* format: ">>> /path/to/file.extension#region language meta..."
*    where #region, language and meta are optional
*    meta should starts with {
*    lang can contain special characters like C++, C#, F#, etc.
*    path can be relative to the current file or absolute
*    file extension is optional
*    path can contain spaces and dots
*
* captures: ['/path/to/file.extension', '#region', 'language', '{meta}']
*/
function transformSnippet({ s, slide, options }) {
	const watchFiles = options.data.watchFiles;
	const dir = path.dirname(slide.source?.filepath ?? options.entry ?? options.userRoot);
	s.replace(/^<<<[ \t]*(\S.*?)(#[\w-]+)?[ \t]*(?:[ \t](\S+?))?[ \t]*(\{.*)?$/gm, (full, filepath = "", regionName = "", lang = "", meta = "") => {
		const src = slash(/^@\//.test(filepath) ? path.resolve(options.userRoot, filepath.slice(2)) : path.resolve(dir, filepath));
		meta = meta.trim();
		lang = lang.trim();
		lang = lang || path.extname(filepath).slice(1);
		const isAFile = fs.statSync(src).isFile();
		if (!fs.existsSync(src) || !isAFile) throw new Error(isAFile ? `Code snippet path not found: ${src}` : `Invalid code snippet option`);
		let content = fs.readFileSync(src, "utf8");
		if (regionName) {
			const lines = content.split(/\r?\n/);
			const region = findRegion(lines, regionName.slice(1));
			if (region) content = dedent(lines.slice(region.start, region.end).filter((l) => !(region.re.start.test(l) || region.re.end.test(l))).join("\n"));
		}
		if (meta.match(reMonacoWrite)) {
			monacoWriterWhitelist.add(filepath);
			lang = lang.trim();
			meta = meta.replace(reMonacoWrite, "").trim() || "{}";
			const encoded = lz.compressToBase64(content);
			return `<Monaco writable=${JSON.stringify(filepath)} code-lz="${encoded}" lang="${lang}" v-bind="${meta}" />`;
		} else {
			watchFiles[src] ??= /* @__PURE__ */ new Set();
			watchFiles[src].add(slide.index);
		}
		return `\`\`\`${lang} ${meta}\n${content}\n\`\`\``;
	});
}

//#endregion
//#region node/syntax/transform/index.ts
async function getMarkdownTransformers(options) {
	const extras = await setupTransformers(options.roots);
	return [
		...extras.pre,
		transformSnippet,
		options.data.config.highlighter === "shiki" && transformMagicMove,
		...extras.preCodeblock,
		transformMermaid,
		transformPlantUml,
		options.data.features.monaco && transformMonaco,
		...extras.postCodeblock,
		transformCodeWrapper,
		options.data.features.katex && transformKaTexWrapper,
		transformPageCSS,
		transformSlotSugar,
		...extras.post
	];
}

//#endregion
//#region node/vite/markdown.ts
async function createMarkdownPlugin(options, { markdown: mdOptions }) {
	const markdownTransformMap = /* @__PURE__ */ new Map();
	const transformers = await getMarkdownTransformers(options);
	return Markdown({
		include: [/\.md$/],
		wrapperClasses: "",
		headEnabled: false,
		frontmatter: false,
		escapeCodeTagInterpolation: false,
		markdownOptions: {
			quotes: "\"\"''",
			html: true,
			xhtmlOut: true,
			linkify: true,
			...mdOptions?.markdownOptions
		},
		...mdOptions,
		async markdownSetup(md) {
			await useMarkdownItPlugins(md, options, markdownTransformMap);
			await mdOptions?.markdownSetup?.(md);
		},
		transforms: {
			...mdOptions?.transforms,
			async before(code, id) {
				if (options.data.markdownFiles[id]) return "";
				code = await mdOptions?.transforms?.before?.(code, id) ?? code;
				const match = id.match(regexSlideSourceId);
				if (!match) return code;
				const s = new MagicString(code);
				markdownTransformMap.set(id, s);
				const ctx = {
					s,
					slide: options.data.slides[+match[1] - 1],
					options
				};
				for (const transformer of transformers) {
					if (!transformer) continue;
					await transformer(ctx);
					if (!ctx.s.isEmpty()) ctx.s.commit();
				}
				return s.toString();
			}
		}
	});
}

//#endregion
//#region node/vite/monacoTypes.ts
function createMonacoTypesLoader({ userRoot, utils }) {
	return {
		name: "slidev:monaco-types-loader",
		resolveId(id) {
			if (id.startsWith("/@slidev-monaco-types/")) return id;
			return null;
		},
		async load(id) {
			if (!id.startsWith("/@slidev-monaco-types/")) return null;
			const url = new URL(id, "http://localhost");
			if (url.pathname === "/@slidev-monaco-types/resolve") {
				const query = new URLSearchParams(url.search);
				const pkg = query.get("pkg");
				const importer = query.get("importer") ?? userRoot;
				const pkgJsonPath = await findDepPkgJsonPath(pkg, importer);
				if (!pkgJsonPath) throw new Error(`Package "${pkg}" not found in "${importer}"`);
				const root = slash(dirname(pkgJsonPath));
				const pkgJson = JSON.parse(await fs$1.readFile(pkgJsonPath, "utf-8"));
				let deps = Object.keys(pkgJson.dependencies ?? {});
				deps = deps.filter((pkg$1) => !utils.isMonacoTypesIgnored(pkg$1));
				return [`import "/@slidev-monaco-types/load?${new URLSearchParams({
					root,
					name: pkgJson.name
				})}"`, ...deps.map((dep) => `import "/@slidev-monaco-types/resolve?${new URLSearchParams({
					pkg: dep,
					importer: root
				})}"`)].join("\n");
			}
			if (url.pathname === "/@slidev-monaco-types/load") {
				const query = new URLSearchParams(url.search);
				const root = query.get("root");
				const name = query.get("name");
				const files = await fg([
					"**/*.ts",
					"**/*.mts",
					"**/*.cts",
					"package.json"
				], {
					cwd: root,
					followSymbolicLinks: true,
					ignore: ["**/node_modules/**"]
				});
				if (!files.length) return "/** No files found **/";
				return ["import { addFile } from \"@slidev/client/setup/monaco.ts\"", ...files.map((file) => `addFile(() => import(${JSON.stringify(`${toAtFS(resolve(root, file))}?monaco-types&raw`)}), ${JSON.stringify(`node_modules/${name}/${file}`)})`)].join("\n");
			}
		}
	};
}

//#endregion
//#region node/vite/patchMonacoSourceMap.ts
const postfixRE = /[?#].*$/;
function cleanUrl(url) {
	return url.replace(postfixRE, "");
}
/**
* Temporary workaround for https://github.com/microsoft/monaco-editor/issues/4712
*/
function createPatchMonacoSourceMapPlugin() {
	return {
		name: "slidev:patch-monaco-sourcemap",
		enforce: "pre",
		load(id) {
			if (!id.includes("node_modules/monaco-editor/esm/vs/base")) return;
			return readFile(cleanUrl(id), "utf-8");
		}
	};
}

//#endregion
//#region node/vite/remoteAssets.ts
async function createRemoteAssetsPlugin({ data: { config }, mode }, pluginOptions) {
	if (!(config.remoteAssets === true || config.remoteAssets === mode)) return;
	const { VitePluginRemoteAssets, DefaultRules } = await import("vite-plugin-remote-assets");
	return VitePluginRemoteAssets({
		resolveMode: (id) => id.endsWith("index.html") ? "relative" : "@fs",
		awaitDownload: mode === "build",
		...pluginOptions.remoteAssets,
		rules: [
			...DefaultRules,
			{
				match: /\b(https?:\/\/image.unsplash\.com.*?)(?=[`'")\]])/gi,
				ext: ".png"
			},
			...pluginOptions.remoteAssets?.rules ?? []
		]
	});
}

//#endregion
//#region node/integrations/drawings.ts
function resolveDrawingsDir(options) {
	return options.data.config.drawings.persist ? resolve(dirname(options.entry), options.data.config.drawings.persist) : void 0;
}
async function loadDrawings(options) {
	const dir = resolveDrawingsDir(options);
	if (!dir || !existsSync(dir)) return {};
	const files = await fg("*.svg", {
		onlyFiles: true,
		cwd: dir,
		absolute: true,
		suppressErrors: true
	});
	const obj = {};
	await Promise.all(files.map(async (path$1) => {
		const num = +basename(path$1, ".svg");
		if (Number.isNaN(num)) return;
		const lines = (await fs$1.readFile(path$1, "utf8")).split(/\n/g);
		obj[num.toString()] = lines.slice(1, -1).join("\n");
	}));
	return obj;
}
async function writeDrawings(options, drawing) {
	const dir = resolveDrawingsDir(options);
	if (!dir) return;
	const width = options.data.config.canvasWidth;
	const SVG_HEAD = `<svg width="${width}" height="${Math.round(width / options.data.config.aspectRatio)}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`;
	await fs$1.mkdir(dir, { recursive: true });
	return Promise.all(Object.entries(drawing).map(async ([key, value]) => {
		if (!value) return;
		const svg = `${SVG_HEAD}\n${value}\n</svg>`;
		await fs$1.writeFile(join(dir, `${key}.svg`), svg, "utf-8");
	}));
}

//#endregion
//#region node/integrations/snapshots.ts
function resolveSnapshotsDir(options) {
	return resolve(dirname(options.entry), ".slidev/snapshots");
}
async function loadSnapshots(options) {
	const dir = resolveSnapshotsDir(options);
	const file = join(dir, "snapshots.json");
	if (!dir || !existsSync(file)) return {};
	return JSON.parse(await fs$1.readFile(file, "utf8"));
}
async function writeSnapshots(options, data) {
	const dir = resolveSnapshotsDir(options);
	if (!dir) return;
	await fs$1.mkdir(dir, { recursive: true });
	await fs$1.writeFile(join(dir, "snapshots.json"), JSON.stringify(data, null, 2), "utf-8");
}

//#endregion
//#region node/vite/serverRef.ts
async function createServerRefPlugin(options, pluginOptions) {
	return ServerRef({
		debug: false,
		state: {
			sync: false,
			nav: {
				page: 0,
				clicks: 0,
				timer: {
					status: "stopped",
					slides: {},
					startedAt: 0,
					pausedAt: 0
				}
			},
			drawings: await loadDrawings(options),
			snapshots: await loadSnapshots(options),
			...pluginOptions.serverRef?.state
		},
		onChanged(key, data, patch, timestamp) {
			pluginOptions.serverRef?.onChanged?.(key, data, patch, timestamp);
			if (options.data.config.drawings.persist && key === "drawings") writeDrawings(options, patch ?? data);
			if (key === "snapshots") writeSnapshots(options, data);
		}
	});
}

//#endregion
//#region node/vite/staticCopy.ts
async function createStaticCopyPlugin({ themeRoots, addonRoots }, pluginOptions) {
	const publicDirs = [...themeRoots, ...addonRoots].map((i) => join(i, "public")).filter(existsSync);
	if (!publicDirs.length) return;
	const { viteStaticCopy } = await import("vite-plugin-static-copy");
	return viteStaticCopy({
		silent: true,
		targets: publicDirs.map((dir) => ({
			src: `${dir}/*`,
			dest: "theme"
		})),
		...pluginOptions.staticCopy
	});
}

//#endregion
//#region node/setups/unocss.ts
async function setupUnocss({ clientRoot, roots, data, utils }) {
	function loadFileConfigs(root) {
		return [resolve(root, "uno.config.ts"), resolve(root, "unocss.config.ts")].map(async (i) => {
			if (!existsSync(i)) return void 0;
			const loaded = await loadModule(i);
			return "default" in loaded ? loaded.default : loaded;
		});
	}
	const config = mergeConfigs([
		{
			presets: [presetIcons({
				collectionsNodeResolvePath: utils.iconsResolvePath,
				collections: { slidev: { logo: () => readFile(resolve(clientRoot, "assets/logo.svg"), "utf-8") } }
			})],
			safelist: await loadModule(resolve(clientRoot, ".generated/unocss-tokens.ts"))
		},
		(await loadModule(resolve(clientRoot, "uno.config.ts"))).default,
		...await loadSetups(roots, "unocss.ts", [], loadFileConfigs)
	].filter(Boolean));
	config.theme ||= {};
	config.theme.fontFamily ||= {};
	config.theme.fontFamily.sans ||= data.config.fonts.sans.join(",");
	config.theme.fontFamily.mono ||= data.config.fonts.mono.join(",");
	config.theme.fontFamily.serif ||= data.config.fonts.serif.join(",");
	return config;
}

//#endregion
//#region node/vite/unocss.ts
async function createUnocssPlugin(options, pluginOptions) {
	return UnoCSS({
		configFile: false,
		...await setupUnocss(options),
		...pluginOptions.unocss
	});
}

//#endregion
//#region node/vite/vue.ts
const customElements = new Set([
	"annotation",
	"math",
	"menclose",
	"mfrac",
	"mglyph",
	"mi",
	"mlabeledtr",
	"mn",
	"mo",
	"mover",
	"mpadded",
	"mphantom",
	"mroot",
	"mrow",
	"mspace",
	"msqrt",
	"mstyle",
	"msub",
	"msubsup",
	"msup",
	"mtable",
	"mtd",
	"mtext",
	"mtr",
	"munder",
	"munderover",
	"semantics"
]);
async function createVuePlugin(_options, pluginOptions) {
	const { vue: vueOptions = {}, vuejsx: vuejsxOptions = {} } = pluginOptions;
	const VuePlugin = Vue({
		include: [
			/\.vue$/,
			/\.vue\?vue/,
			/\.vue\?v=/,
			/\.md$/,
			/\.md\?vue/
		],
		exclude: [],
		...vueOptions,
		template: {
			...vueOptions?.template,
			compilerOptions: {
				...vueOptions?.template?.compilerOptions,
				isCustomElement(tag) {
					return customElements.has(tag) || vueOptions?.template?.compilerOptions?.isCustomElement?.(tag);
				}
			}
		}
	});
	return [VueJsx(vuejsxOptions), VuePlugin];
}

//#endregion
//#region node/vite/index.ts
function ViteSlidevPlugin(options, pluginOptions = {}, serverOptions = {}) {
	return Promise.all([
		createSlidesLoader(options, serverOptions),
		createMarkdownPlugin(options, pluginOptions),
		createLayoutWrapperPlugin(options),
		createContextInjectionPlugin(),
		createVuePlugin(options, pluginOptions),
		createHmrPatchPlugin(),
		createComponentsPlugin(options, pluginOptions),
		createIconsPlugin(options, pluginOptions),
		createRemoteAssetsPlugin(options, pluginOptions),
		createServerRefPlugin(options, pluginOptions),
		createConfigPlugin(options),
		createMonacoTypesLoader(options),
		createMonacoWriterPlugin(options),
		createVueCompilerFlagsPlugin(options),
		createUnocssPlugin(options, pluginOptions),
		createStaticCopyPlugin(options, pluginOptions),
		createInspectPlugin(options, pluginOptions),
		createPatchMonacoSourceMapPlugin(),
		setupVitePlugins(options)
	]);
}

//#endregion
//#region node/commands/shared.ts
const sharedMd = MarkdownExit({ html: true });
sharedMd.use(MarkdownItLink);
function getSlideTitle(data) {
	const title = stringifyMarkdownTokens(sharedMd.parseInline(data.config.title, {}));
	const slideTitle = data.config.titleTemplate.replace("%s", title);
	return slideTitle === "Slidev - Slidev" ? "Slidev" : slideTitle;
}
async function resolveViteConfigs(options, baseConfig, overrideConfigs, command, serverOptions) {
	const configEnv = {
		mode: command === "build" ? "production" : "development",
		command
	};
	const files = resolveSourceFiles(options.roots, "vite.config");
	const configs = await Promise.all(files.map((file) => loadConfigFromFile(configEnv, file)));
	for (const config of configs) {
		if (!config?.config) continue;
		baseConfig = mergeConfig(baseConfig, config.config);
	}
	baseConfig = mergeConfig(baseConfig, overrideConfigs);
	baseConfig = mergeConfig(baseConfig, {
		configFile: false,
		root: options.userRoot,
		plugins: await ViteSlidevPlugin(options, baseConfig.slidev, serverOptions),
		define: { __VUE_PROD_DEVTOOLS__: false }
	});
	return baseConfig;
}

//#endregion
export { parser as a, resolveAddons as c, updateFrontmatterPatch as d, resolveOptions as i, version as l, ViteSlidevPlugin as n, getThemeMeta as o, createDataUtils as r, resolveTheme as s, resolveViteConfigs as t, loadSetups as u };