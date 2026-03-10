import { CompletionItem, HastExtension, RendererRichOptions, ShikiTwoslashError, TransformerTwoslashOptions, TwoslashRenderer, TwoslashShikiFunction, TwoslashShikiReturn, TwoslashTypesCache, createTransformerFactory, defaultCompletionIcons, defaultCustomTagIcons, defaultHoverInfoProcessor, defaultTwoslashOptions, rendererClassic, rendererRich } from "./core.mjs";
import { CreateTwoslashOptions } from "twoslash";
import { ShikiTransformer } from "@shikijs/types";

//#region src/index.d.ts
interface TransformerTwoslashIndexOptions extends TransformerTwoslashOptions, Pick<CreateTwoslashOptions, 'cache'> {
  /**
   * Options for the default rich renderer.
   *
   * Available when no custom renderer is provided.
   */
  rendererRich?: RendererRichOptions;
}
/**
 * Factory function to create a Shiki transformer for twoslash integrations.
 */
declare function transformerTwoslash(options?: TransformerTwoslashIndexOptions): ShikiTransformer;
//#endregion
export { CompletionItem, HastExtension, RendererRichOptions, ShikiTwoslashError, TransformerTwoslashIndexOptions, TransformerTwoslashOptions, TwoslashRenderer, TwoslashShikiFunction, TwoslashShikiReturn, TwoslashTypesCache, createTransformerFactory, defaultCompletionIcons, defaultCustomTagIcons, defaultHoverInfoProcessor, defaultTwoslashOptions, rendererClassic, rendererRich, transformerTwoslash };