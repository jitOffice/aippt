import { a as defaultCustomTagIcons, c as ShikiTwoslashError, i as defaultCompletionIcons, n as rendererRich, r as rendererClassic, t as defaultHoverInfoProcessor } from "./renderer-rich-DEkszi0Z.mjs";
import { createTransformerFactory, defaultTwoslashOptions } from "./core.mjs";
import { createTwoslasher } from "twoslash";

//#region src/index.ts
/**
* Factory function to create a Shiki transformer for twoslash integrations.
*/
function transformerTwoslash(options = {}) {
	return createTransformerFactory(createTwoslasher({
		cache: options?.cache,
		compilerOptions: { moduleResolution: 100 }
	}), rendererRich(options.rendererRich))(options);
}

//#endregion
export { ShikiTwoslashError, createTransformerFactory, defaultCompletionIcons, defaultCustomTagIcons, defaultHoverInfoProcessor, defaultTwoslashOptions, rendererClassic, rendererRich, transformerTwoslash };