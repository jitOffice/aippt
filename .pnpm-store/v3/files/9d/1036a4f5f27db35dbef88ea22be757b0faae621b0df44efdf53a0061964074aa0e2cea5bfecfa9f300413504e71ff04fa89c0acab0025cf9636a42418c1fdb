import { t as src_default } from "./src-B190jY78.mjs";

//#region src/nuxt.ts
function nuxt_default(options = {}, nuxt) {
	const nuxtApp = this?.nuxt || nuxt;
	if (nuxtApp?._version?.startsWith("3.") || nuxtApp?._version?.startsWith("4.")) {
		options.compiler = "vue3";
		nuxtApp.options.typescript ||= {};
		nuxtApp.options.typescript.tsConfig ||= {};
		nuxtApp.options.typescript.tsConfig.compilerOptions ||= {};
		nuxtApp.options.typescript.tsConfig.compilerOptions.types ||= [];
		nuxtApp.options.typescript.tsConfig.compilerOptions.types.push("unplugin-icons/types/vue");
	}
	nuxtApp.hook("webpack:config", (configs) => {
		configs.forEach((config) => {
			config.plugins = config.plugins || [];
			config.plugins.unshift(src_default.webpack(options));
		});
	});
	nuxtApp.hook("vite:extend", async (vite) => {
		vite.config.plugins = vite.config.plugins || [];
		vite.config.plugins.push(src_default.vite(options));
	});
}

//#endregion
export { nuxt_default as default };