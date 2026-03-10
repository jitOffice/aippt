import { a as collections_default, i as parseIconWithLoader, n as createCDNFetchLoader, r as createPresetIcons, t as combineLoaders } from "./core-DbR55bSN.mjs";
import { t as createCDNLoader } from "./cdn-CH1oTUdH.mjs";
import { loadIcon } from "@iconify/utils";

//#region src/browser.ts
const presetIcons = createPresetIcons(async (options) => {
	const fetcher = options?.customFetch;
	const cdn = options?.cdn;
	if (fetcher && cdn) return createCDNFetchLoader(fetcher, cdn);
	if (cdn) return await createCDNLoader(cdn);
	return loadIcon;
});
var browser_default = presetIcons;

//#endregion
export { combineLoaders, createCDNFetchLoader, createPresetIcons, browser_default as default, collections_default as icons, parseIconWithLoader, presetIcons };