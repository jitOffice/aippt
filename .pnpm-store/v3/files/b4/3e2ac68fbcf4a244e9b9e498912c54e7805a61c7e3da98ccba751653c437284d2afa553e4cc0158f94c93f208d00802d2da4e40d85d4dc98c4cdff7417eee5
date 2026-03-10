import { camelToKebab } from "@iconify/utils/lib/misc/strings";

//#region node_modules/.pnpm/@antfu+utils@9.3.0/node_modules/@antfu/utils/dist/index.mjs
function toArray(array) {
	array = array ?? [];
	return Array.isArray(array) ? array : [array];
}
function uniq(array) {
	return Array.from(new Set(array));
}

//#endregion
//#region src/core/icon-sets.json
var icon_sets_default = [
	"academicons",
	"akar-icons",
	"ant-design",
	"arcticons",
	"basil",
	"bi",
	"bitcoin-icons",
	"bpmn",
	"brandico",
	"bx",
	"bxl",
	"bxs",
	"bytesize",
	"carbon",
	"catppuccin",
	"cbi",
	"charm",
	"ci",
	"cib",
	"cif",
	"cil",
	"circle-flags",
	"circum",
	"clarity",
	"codex",
	"codicon",
	"covid",
	"cryptocurrency",
	"cryptocurrency-color",
	"cuida",
	"dashicons",
	"devicon",
	"devicon-plain",
	"dinkie-icons",
	"duo-icons",
	"ei",
	"el",
	"emojione",
	"emojione-monotone",
	"emojione-v1",
	"entypo",
	"entypo-social",
	"eos-icons",
	"ep",
	"et",
	"eva",
	"f7",
	"fa",
	"fa-brands",
	"fa-regular",
	"fa-solid",
	"fa6-brands",
	"fa6-regular",
	"fa6-solid",
	"fa7-brands",
	"fa7-regular",
	"fa7-solid",
	"fad",
	"famicons",
	"fe",
	"feather",
	"file-icons",
	"flag",
	"flagpack",
	"flat-color-icons",
	"flat-ui",
	"flowbite",
	"fluent",
	"fluent-color",
	"fluent-emoji",
	"fluent-emoji-flat",
	"fluent-emoji-high-contrast",
	"fluent-mdl2",
	"fontelico",
	"fontisto",
	"formkit",
	"foundation",
	"fxemoji",
	"gala",
	"game-icons",
	"garden",
	"geo",
	"gg",
	"gis",
	"gravity-ui",
	"gridicons",
	"grommet-icons",
	"guidance",
	"healthicons",
	"heroicons",
	"heroicons-outline",
	"heroicons-solid",
	"hugeicons",
	"humbleicons",
	"ic",
	"icomoon-free",
	"icon-park",
	"icon-park-outline",
	"icon-park-solid",
	"icon-park-twotone",
	"iconamoon",
	"iconoir",
	"icons8",
	"il",
	"ion",
	"iwwa",
	"ix",
	"jam",
	"la",
	"lets-icons",
	"line-md",
	"lineicons",
	"logos",
	"ls",
	"lsicon",
	"lucide",
	"lucide-lab",
	"mage",
	"majesticons",
	"maki",
	"map",
	"marketeq",
	"material-icon-theme",
	"material-symbols",
	"material-symbols-light",
	"mdi",
	"mdi-light",
	"medical-icon",
	"memory",
	"meteocons",
	"meteor-icons",
	"mi",
	"mingcute",
	"mono-icons",
	"mynaui",
	"nimbus",
	"nonicons",
	"noto",
	"noto-v1",
	"nrk",
	"octicon",
	"oi",
	"ooui",
	"openmoji",
	"oui",
	"pajamas",
	"pepicons",
	"pepicons-pencil",
	"pepicons-pop",
	"pepicons-print",
	"ph",
	"picon",
	"pixel",
	"pixelarticons",
	"prime",
	"proicons",
	"ps",
	"qlementine-icons",
	"quill",
	"radix-icons",
	"raphael",
	"ri",
	"rivet-icons",
	"roentgen",
	"si",
	"si-glyph",
	"sidekickicons",
	"simple-icons",
	"simple-line-icons",
	"skill-icons",
	"solar",
	"stash",
	"streamline",
	"streamline-block",
	"streamline-color",
	"streamline-cyber",
	"streamline-cyber-color",
	"streamline-emojis",
	"streamline-flex",
	"streamline-flex-color",
	"streamline-freehand",
	"streamline-freehand-color",
	"streamline-kameleon-color",
	"streamline-logos",
	"streamline-pixel",
	"streamline-plump",
	"streamline-plump-color",
	"streamline-sharp",
	"streamline-sharp-color",
	"streamline-stickies-color",
	"streamline-ultimate",
	"streamline-ultimate-color",
	"subway",
	"svg-spinners",
	"system-uicons",
	"tabler",
	"tdesign",
	"teenyicons",
	"temaki",
	"token",
	"token-branded",
	"topcoat",
	"twemoji",
	"typcn",
	"uil",
	"uim",
	"uis",
	"uit",
	"uiw",
	"unjs",
	"vaadin",
	"vs",
	"vscode-icons",
	"websymbol",
	"weui",
	"whh",
	"wi",
	"wpf",
	"zmdi",
	"zondicons"
];

//#endregion
//#region src/resolver.ts
/**
* Resolver for unplugin-vue-components and unplugin-auto-import
*
* @param options
*/
function ComponentsResolver(options = {}) {
	const { prefix: rawPrefix = options.componentPrefix ?? "i", enabledCollections = icon_sets_default, alias = {}, customCollections = [], extension, strict = false } = options;
	const prefix = rawPrefix ? `${camelToKebab(rawPrefix)}-` : "";
	const ext = extension ? extension.startsWith(".") ? extension : `.${extension}` : "";
	const collections = uniq([
		...toArray(enabledCollections),
		...toArray(customCollections),
		...toArray(Object.keys(alias))
	]);
	collections.sort((a, b) => b.length - a.length);
	return (name) => {
		let collection;
		let icon;
		if (name.includes(":")) {
			const [iconPrefix, iconSuffix] = name.split(":");
			collection = camelToKebab(iconPrefix);
			if (!collection.startsWith(prefix)) return;
			const slice = collection.slice(prefix.length);
			const resolvedCollection$1 = collections.find((i) => slice === i);
			if (!resolvedCollection$1) return;
			collection = resolvedCollection$1;
			icon = camelToKebab(iconSuffix);
		} else {
			const kebab = camelToKebab(name);
			if (!kebab.startsWith(prefix)) return;
			const slice = kebab.slice(prefix.length);
			const resolvedCollection$1 = collections.find((i) => slice.startsWith(`${i}-`)) || !strict && collections.find((i) => slice.startsWith(i));
			if (!resolvedCollection$1) return;
			collection = resolvedCollection$1;
			icon = slice.slice(resolvedCollection$1.length);
		}
		if (icon[0] === "-") icon = icon.slice(1);
		if (!icon) return;
		const resolvedCollection = alias[collection] || collection;
		if (collections.includes(resolvedCollection)) return `~icons/${resolvedCollection}/${icon}${ext}`;
	};
}

//#endregion
export { ComponentsResolver as default };