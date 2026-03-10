import { a as TimesplitOutput, i as TimesplitInput, n as parseRangeString, o as parseTimesplits, r as parseTimeString, t as parseAspectRatio } from "./utils-BwHfBd2q.mjs";
import { SlidevParserOptions, detectFeatures, extractImagesUsage, getDefaultConfig, parse, parseSlide, parseSync, prettify, prettifySlide, resolveConfig, resolveFonts, stringify, stringifySlide, verifyConfig } from "./core.mjs";
import { PreparserExtensionLoader, SlidevData, SlidevMarkdown } from "@slidev/types";

//#region src/fs.d.ts
declare function injectPreparserExtensionLoader(fn: PreparserExtensionLoader): void;
/**
 * Slidev data without config and themeMeta,
 * because config and themeMeta depends on the theme to be loaded.
 */
type LoadedSlidevData = Omit<SlidevData, 'config' | 'themeMeta'>;
declare function load(userRoot: string, filepath: string, sources?: Record<string, string> | ((path: string) => Promise<string>), mode?: string): Promise<LoadedSlidevData>;
declare function save(markdown: SlidevMarkdown): Promise<string>;
//#endregion
export { LoadedSlidevData, SlidevParserOptions, TimesplitInput, TimesplitOutput, detectFeatures, extractImagesUsage, getDefaultConfig, injectPreparserExtensionLoader, load, parse, parseAspectRatio, parseRangeString, parseSlide, parseSync, parseTimeString, parseTimesplits, prettify, prettifySlide, resolveConfig, resolveFonts, save, stringify, stringifySlide, verifyConfig };