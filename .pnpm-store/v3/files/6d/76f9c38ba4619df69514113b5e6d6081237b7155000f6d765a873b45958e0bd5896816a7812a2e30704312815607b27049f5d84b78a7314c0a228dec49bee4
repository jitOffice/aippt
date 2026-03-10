import { TransformerTwoslashOptions } from "@shikijs/twoslash/core";
import { VueSpecificOptions } from "twoslash-vue";
import { RendererRichOptions, TwoslashRenderer, defaultHoverInfoProcessor } from "@shikijs/twoslash";

//#region src/renderer-floating-vue.d.ts
interface TwoslashFloatingVueOptions {
  classCopyIgnore?: string;
  classFloatingPanel?: string;
  classMarkdown?: string;
  floatingVueTheme?: string;
  floatingVueThemeQuery?: string;
  floatingVueThemeCompletion?: string;
}
interface TwoslashFloatingVueRendererOptions extends RendererRichOptions {
  /**
   * Class and themes for floating-vue specific nodes
   */
  floatingVue?: TwoslashFloatingVueOptions;
}
declare function rendererFloatingVue(options?: TwoslashFloatingVueRendererOptions): TwoslashRenderer;
//#endregion
//#region src/types.d.ts
interface TransformerTwoslashVueOptions extends TransformerTwoslashOptions {
  twoslashOptions?: TransformerTwoslashOptions['twoslashOptions'] & VueSpecificOptions;
}
interface VitePressPluginTwoslashOptions extends TransformerTwoslashVueOptions, TwoslashFloatingVueRendererOptions {
  /**
   * Requires adding `twoslash` to the code block explicitly to run twoslash
   * @default true
   */
  explicitTrigger?: TransformerTwoslashOptions['explicitTrigger'];
}
//#endregion
export { rendererFloatingVue as a, defaultHoverInfoProcessor as i, TwoslashFloatingVueOptions as n, TwoslashFloatingVueRendererOptions as r, VitePressPluginTwoslashOptions as t };