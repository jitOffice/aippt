import { a as TimesplitOutput, i as TimesplitInput, n as parseRangeString, o as parseTimesplits, r as parseTimeString, t as parseAspectRatio } from "./utils-BwHfBd2q.mjs";
import { FontOptions, ResolvedFontOptions, SlidevConfig, SlidevDetectedFeatures, SlidevMarkdown, SlidevPreparserExtension, SlidevThemeMeta, SourceSlideInfo } from "@slidev/types";

//#region src/config.d.ts
declare function getDefaultConfig(): SlidevConfig;
declare function resolveConfig(headmatter: any, themeMeta?: SlidevThemeMeta, filepath?: string, verify?: boolean): SlidevConfig;
declare function verifyConfig(config: SlidevConfig, themeMeta?: SlidevThemeMeta, warn?: (v: string) => void): void;
declare function resolveFonts(fonts?: FontOptions): ResolvedFontOptions;
//#endregion
//#region src/core.d.ts
interface SlidevParserOptions {
  noParseYAML?: boolean;
  preserveCR?: boolean;
}
declare function stringify(data: SlidevMarkdown): string;
declare function stringifySlide(data: SourceSlideInfo, idx?: number): string;
declare function prettifySlide(data: SourceSlideInfo): SourceSlideInfo;
declare function prettify(data: SlidevMarkdown): SlidevMarkdown;
/**
 * Extract image URLs from slide content and frontmatter.
 * Strips code blocks first to avoid false positives.
 */
declare function extractImagesUsage(content: string, frontmatter: Record<string, any>): string[];
declare function detectFeatures(code: string): SlidevDetectedFeatures;
declare function parseSlide(raw: string, options?: SlidevParserOptions): Omit<SourceSlideInfo, 'filepath' | 'index' | 'start' | 'contentStart' | 'end'>;
declare function parse(markdown: string, filepath: string, extensions?: SlidevPreparserExtension[], options?: SlidevParserOptions): Promise<SlidevMarkdown>;
declare function parseSync(markdown: string, filepath: string, options?: SlidevParserOptions): SlidevMarkdown;
//#endregion
export { SlidevParserOptions, TimesplitInput, TimesplitOutput, detectFeatures, extractImagesUsage, getDefaultConfig, parse, parseAspectRatio, parseRangeString, parseSlide, parseSync, parseTimeString, parseTimesplits, prettify, prettifySlide, resolveConfig, resolveFonts, stringify, stringifySlide, verifyConfig };