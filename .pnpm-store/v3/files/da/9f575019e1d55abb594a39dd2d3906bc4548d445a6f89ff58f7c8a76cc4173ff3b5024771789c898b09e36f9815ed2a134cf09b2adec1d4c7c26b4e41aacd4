import FloatingVue from "floating-vue";
import { App } from "vue";

//#region src/client.d.ts
type FloatingVueConfig = Parameters<(typeof FloatingVue)['install']>[1];
/**
 * Vue plugin to install FloatingVue with styles.
 *
 * Import this function in `.vitepress/theme/index.ts` and use `app.use(TwoslashFloatingVue)` inside the `enhanceApp` hook.
 */
declare const TwoslashFloatingVue: {
  install: (app: App, options?: FloatingVueConfig) => void;
};
//#endregion
export { FloatingVueConfig, TwoslashFloatingVue as default };