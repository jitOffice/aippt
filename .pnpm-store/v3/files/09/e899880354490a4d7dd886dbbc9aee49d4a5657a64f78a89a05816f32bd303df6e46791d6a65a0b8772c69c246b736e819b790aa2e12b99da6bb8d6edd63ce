import { t as VitePressPluginTwoslashOptions } from "../types-CKSDIC5E.mjs";
import { UserConfig } from "vitepress";

//#region src/cache-inline/markdown-fence.d.ts
interface MarkdownFenceSourceMap {
  path: string;
  from: number;
  to: number;
}
/**
 * Maps markdown code to its source map positions.
 * @param code markdown source
 * @param path markdown file path
 * @returns map of inject positions to source maps
 */
type MarkdownFencesSourceMapper = (code: string, path: string) => Map<number, MarkdownFenceSourceMap>;
interface MarkdownFenceSourceMapCodec {
  /**
   * Injects source map data into the markdown source.
   * @param code markdown source
   * @param path markdown file path
   * @returns markdown source with injected source maps
   */
  injectToMarkdown: (code: string, path: string) => string;
  /**
   * Extract source map from fence code snippet.
   * @param code fence code snippet
   * @returns extracted code and source map
   */
  extractFromFence: (code: string) => {
    code: string;
    sourceMap: MarkdownFenceSourceMap | null;
  };
}
//#endregion
//#region src/cache-inline/index.d.ts
interface TwoslashInlineCacheOptions {
  sourceMapper?: MarkdownFencesSourceMapper;
  sourceMapCodec?: MarkdownFenceSourceMapCodec;
}
/**
 * @experimental This API is experimental and may be changed in the future.
 */
declare function createTwoslashWithInlineCache(twoslashOptions?: VitePressPluginTwoslashOptions, {
  sourceMapper,
  sourceMapCodec
}?: TwoslashInlineCacheOptions): (config: UserConfig) => UserConfig;
//#endregion
export { TwoslashInlineCacheOptions, createTwoslashWithInlineCache };