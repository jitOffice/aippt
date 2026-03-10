import { createUnplugin } from "unplugin";
import { loadNodeIcon } from "@iconify/utils/lib/loader/node-loader";
import { camelize } from "@iconify/utils/lib/misc/strings";
import { getPackageInfo, importModule, isPackageExists } from "local-pkg";
import process from "node:process";
import { createDebug } from "obug";

//#region src/core/compilers/astro.ts
const AstroCompiler = ((svg) => {
	return `---
  interface Props extends astroHTML.JSX.SVGAttributes {};
  const props = Astro.props;
---
${svg.replace("<svg", "<svg {...props}")}`;
});

//#endregion
//#region src/core/compilers/ember.ts
const EmberCompiler = ((svg) => {
	const svgWithProps = svg.replace("<svg", "<svg ...attributes");
	return `import { template } from "@ember/template-compiler";

const Icon = template(${JSON.stringify(svgWithProps)})
export default Icon;`;
});

//#endregion
//#region src/core/compilers/jsx.ts
const JSXCompiler = (async (svg, collection, icon, options) => {
	const svgrCore = await importModule("@svgr/core");
	let res = await (svgrCore.transform || (svgrCore.default ? svgrCore.default.transform ?? svgrCore.default : svgrCore.default) || svgrCore)(svg, {
		plugins: ["@svgr/plugin-jsx"],
		ref: options.jsx === "react",
		titleProp: options.jsx === "react"
	}, { componentName: camelize(`${collection}-${icon}`) });
	if (options.jsx !== "react") res = res.replace("import * as React from \"react\";", "");
	return res;
});

//#endregion
//#region src/core/compilers/marko.ts
const MarkoCompiler = ((svg) => {
	const openTagEnd = svg.indexOf(">", svg.indexOf("<svg "));
	const closeTagStart = svg.lastIndexOf("</svg");
	return `${`${svg.slice(0, openTagEnd)} ...input>`}${`$!{\`${escapeTemplateLiteral(svg.slice(openTagEnd + 1, closeTagStart))}\`}`}${svg.slice(closeTagStart)}`;
});
function escapeTemplateLiteral(str) {
	return str.replace(/\\.|[$`]/g, (m) => {
		switch (m) {
			case "$": return "&#36";
			case "`": return "&#96;";
			default: return m;
		}
	});
}

//#endregion
//#region src/core/compilers/none.ts
const NoneCompiler = ((svg) => {
	return svg;
});

//#endregion
//#region src/core/compilers/qwik.ts
const QwikCompiler = (async (svg, collection, icon, options) => {
	const defaultOptions = {
		importSource: "@builder.io/qwik",
		runtime: "automatic",
		componentName: camelize(`${collection}-${icon}`)
	};
	const mergedOptions = Object.assign({}, defaultOptions, options);
	const toJsxComponent = (await importModule("@svgx/core")).toJsxComponent;
	return toJsxComponent(svg, {
		...mergedOptions,
		defaultExport: true
	});
});

//#endregion
//#region src/core/compilers/raw.ts
const RawCompiler = ((svg) => {
	return `export default ${JSON.stringify(svg)}`;
});

//#endregion
//#region src/core/compilers/solid.ts
const SolidCompiler = ((svg) => {
	return `export default (props = {}) => ${svg.replace(/([{}])/g, "{'$1'}").replace(/(?<=<svg[\s\S]*?)(>)/i, "{...props}>")}`;
});

//#endregion
//#region src/core/compilers/svelte.ts
let svelteRunes;
const SvelteCompiler = (async (svg) => {
	if (svelteRunes == null) try {
		const { VERSION } = await import("svelte/compiler");
		svelteRunes = Number(VERSION.split(".")[0]) >= 5;
	} catch {
		svelteRunes = false;
	}
	const openTagEnd = svg.indexOf(">", svg.indexOf("<svg "));
	const closeTagStart = svg.lastIndexOf("</svg");
	let sfc = `${svg.slice(0, openTagEnd)} {...${svelteRunes ? "p" : "$$props"}}>`;
	if (svelteRunes) sfc += svg.slice(openTagEnd + 1, closeTagStart);
	else sfc += `{@html \`${escapeSvelte(svg.slice(openTagEnd + 1, closeTagStart))}\`}`;
	sfc += svg.slice(closeTagStart);
	return svelteRunes ? `<script>const{...p}=$props()<\/script>${sfc}` : sfc;
});
function escapeSvelte(str) {
	return str.replace(/\{/g, "&#123;").replace(/\}/g, "&#125;").replace(/`/g, "&#96;").replace(/\\([trn])/g, " ");
}

//#endregion
//#region src/core/svgId.ts
const randIdFn = "const __randId = () => Math.random().toString(36).substr(2, 10);";
function handleSVGId(svg) {
	const hasID = /="url\(#/.test(svg);
	const idMap = {};
	let injectScripts = "";
	if (hasID) {
		svg = svg.replace(/\b([\w-]+)="url\(#(.+?)\)"/g, (_, s, id) => {
			idMap[id] = `'${id}':'uicons-'+__randId()`;
			return `:${s}="'url(#'+idMap['${id}']+')'"`;
		}).replace(/\bid="(.+?)"/g, (full, id) => {
			if (idMap[id]) return `:id="idMap['${id}']"`;
			return full;
		});
		injectScripts = `${randIdFn}const idMap = {${Object.values(idMap).join(",")}};`;
	}
	return {
		hasID,
		svg,
		injectScripts
	};
}

//#endregion
//#region src/core/compilers/vue3.ts
const Vue3Compiler = (async (svg, collection, icon) => {
	const { compileTemplate } = await importModule("@vue/compiler-sfc");
	const { injectScripts, svg: handled } = handleSVGId(svg);
	let { code } = compileTemplate({
		source: handled,
		id: `${collection}:${icon}`,
		filename: `${collection}-${icon}.vue`
	});
	code = `import { markRaw } from 'vue'\n${code}`;
	code = code.replace(/^export /gm, "");
	code += `\n\nexport default markRaw({ name: '${collection}-${icon}', render${injectScripts ? `, setup() {${injectScripts};return { idMap }}` : ""} })`;
	code += "\n/* vite-plugin-components disabled */";
	return code;
});

//#endregion
//#region src/core/compilers/web-components.ts
const WebComponentsCompiler = ((svg, collection, icon, { webComponents: options }) => {
	let id = `${collection}-${icon}`;
	if (options.iconPrefix) id = `${options.iconPrefix}-${id}`;
	const name = camelize(id);
	let code = `export default class ${name} extends HTMLElement {`;
	if (options.shadow) code += `constructor() {
      super()
      this.attachShadow({ mode: 'open' }).innerHTML = ${JSON.stringify(svg)}
    }`;
	else code += `connectedCallback() { this.innerHTML = ${JSON.stringify(svg)} }`;
	code += "}";
	if (options.autoDefine) code += `\ncustomElements.define('${id}', ${name})`;
	return code;
});

//#endregion
//#region src/core/compilers/index.ts
const compilers = {
	"astro": AstroCompiler,
	"ember": EmberCompiler,
	"jsx": JSXCompiler,
	"marko": MarkoCompiler,
	"none": NoneCompiler,
	"raw": RawCompiler,
	"solid": SolidCompiler,
	"svelte": SvelteCompiler,
	"vue3": Vue3Compiler,
	"web-components": WebComponentsCompiler,
	"qwik": QwikCompiler
};

//#endregion
//#region src/core/loader.ts
const URL_PREFIXES = [
	"/~icons/",
	"~icons/",
	"virtual:icons/",
	"virtual/icons/"
];
const iconPathRE = /* @__PURE__ */ new RegExp(`${URL_PREFIXES.map((v) => `^${v}`).join("|")}`);
function isIconPath(path) {
	return iconPathRE.test(path);
}
function normalizeIconPath(path) {
	return path.replace(iconPathRE, URL_PREFIXES[0]);
}
function resolveIconsPath(path) {
	if (!isIconPath(path)) return null;
	path = path.replace(iconPathRE, "");
	const query = {};
	const queryIndex = path.indexOf("?");
	if (queryIndex !== -1) {
		const queryRaw = path.slice(queryIndex + 1);
		path = path.slice(0, queryIndex);
		new URLSearchParams(queryRaw).forEach((value, key) => {
			if (key === "raw") query.raw = value === "" || value === "true" ? "true" : "false";
			else query[key] = value;
		});
	}
	path = path.replace(/\.\w+$/, "");
	const [collection, icon] = path.split("/");
	return {
		collection,
		icon,
		query
	};
}
async function generateComponent({ collection, icon, query }, options) {
	const warn = `${collection}/${icon}`;
	const { scale, defaultStyle, defaultClass, customCollections, iconCustomizer: providedIconCustomizer, transform, autoInstall = false, collectionsNodeResolvePath } = options;
	const svg = await loadNodeIcon(collection, icon, {
		addXmlNs: false,
		scale,
		customCollections,
		autoInstall,
		defaultClass,
		defaultStyle,
		cwd: collectionsNodeResolvePath,
		warn: void 0,
		customizations: {
			transform,
			async iconCustomizer(collection$1, icon$1, props) {
				await providedIconCustomizer?.(collection$1, icon$1, props);
				Object.keys(query).forEach((p) => {
					const v = query[p];
					if (p !== "raw" && v !== void 0 && v !== null) props[p] = v;
				});
			}
		}
	});
	if (!svg) throw new Error(`Icon \`${warn}\` not found`);
	const _compiler = query.raw === "true" ? "raw" : options.compiler;
	if (_compiler) {
		const compiler = typeof _compiler === "string" ? compilers[_compiler] : await _compiler.compiler;
		if (compiler) return compiler(svg, collection, icon, options);
	}
	throw new Error(`Unknown compiler: ${_compiler}`);
}
async function generateComponentFromPath(path, options) {
	const resolved = resolveIconsPath(path);
	if (!resolved) return null;
	return generateComponent(resolved, options);
}

//#endregion
//#region src/core/options.ts
const debug = createDebug("unplugin-icons:options");
async function resolveOptions(options) {
	const { scale = 1.2, defaultStyle = "", defaultClass = "", compiler = await guessCompiler(), jsx = guessJSX(), customCollections = {}, iconCustomizer = () => {}, transform, autoInstall = false, collectionsNodeResolvePath = process.cwd() } = options;
	const webComponents = Object.assign({
		autoDefine: false,
		iconPrefix: "icon"
	}, options.webComponents);
	debug("compiler", compiler);
	return {
		scale,
		defaultStyle,
		defaultClass,
		customCollections,
		iconCustomizer,
		compiler,
		jsx,
		webComponents,
		transform,
		autoInstall,
		collectionsNodeResolvePath
	};
}
async function guessCompiler() {
	return await getVueVersion() || (isPackageExists("@svgr/core") ? "jsx" : "vue3");
}
function guessJSX() {
	if (isPackageExists("preact")) return "preact";
	return "react";
}
async function getVueVersion() {
	try {
		const result = await getPackageInfo("vue");
		if (!result || !result.version) return null;
		return result.version?.startsWith("3.") ? "vue3" : null;
	} catch {
		return null;
	}
}

//#endregion
//#region src/index.ts
const unplugin = createUnplugin((options = {}) => {
	const resolved = resolveOptions(options);
	return {
		name: "unplugin-icons",
		enforce: "pre",
		resolveId(id) {
			if (isIconPath(id)) {
				const normalizedId = normalizeIconPath(id);
				const queryIndex = normalizedId.indexOf("?");
				const res = `${(queryIndex > -1 ? normalizedId.slice(0, queryIndex) : normalizedId).replace(/\.\w+$/, "").replace(/^\//, "")}${queryIndex > -1 ? `?${normalizedId.slice(queryIndex + 1)}` : ""}`;
				const compiler = resolveIconsPath(res)?.query?.raw === "true" ? "raw" : options.compiler;
				if (compiler && typeof compiler !== "string") {
					const ext = compiler.extension;
					if (ext) return `${res}.${ext.startsWith(".") ? ext.slice(1) : ext}`;
				} else switch (compiler) {
					case "astro": return `${res}.astro`;
					case "jsx": return `${res}.jsx`;
					case "qwik": return `${res}.jsx`;
					case "marko": return `${res}.marko`;
					case "svelte": return `${res}.svelte`;
					case "solid": return `${res}.tsx`;
				}
				return res;
			}
			return null;
		},
		loadInclude(id) {
			return isIconPath(id);
		},
		async load(id) {
			const code = await generateComponentFromPath(id, await resolved) || null;
			if (code) return {
				code,
				map: {
					version: 3,
					mappings: "",
					sources: []
				}
			};
		},
		rollup: { api: { config: options } }
	};
});
var src_default = unplugin;

//#endregion
export { src_default as t };