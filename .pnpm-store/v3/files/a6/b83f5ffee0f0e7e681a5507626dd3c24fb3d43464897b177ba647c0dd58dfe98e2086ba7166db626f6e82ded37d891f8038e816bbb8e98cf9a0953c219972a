import { App, Component, ComputedRef, MaybeRefOrGetter, Ref } from "vue";
import { ArgumentsType, Arrayable, Awaitable } from "@antfu/utils";
import { BuiltinLanguage, BuiltinTheme, CodeOptionsMeta, CodeOptionsThemes, CodeToHastOptions, CodeToHastOptionsCommon, LanguageInput, LanguageRegistration, MaybeArray } from "shiki";
import { RouteComponent, RouteMeta, RouteRecordRaw, Router } from "vue-router";
import YAML from "yaml";
import { MarkdownItShikiOptions } from "@shikijs/markdown-it";
import { KatexOptions } from "katex";
import { CodeOptionsThemes as CodeOptionsThemes$1, ShorthandsBundle } from "shiki/core";
import { MermaidConfig } from "mermaid";
import * as monaco from "monaco-editor";
import { VitePluginConfig } from "unocss/vite";
import { PluginOption } from "vite";
import MagicString from "magic-string-stack";
import Vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";
import Markdown from "unplugin-vue-markdown/vite";
import { ViteInspectOptions } from "vite-plugin-inspect";
import RemoteAssets from "vite-plugin-remote-assets";
import { ViteStaticCopyOptions } from "vite-plugin-static-copy";
import ServerRef from "vite-plugin-vue-server-ref";

//#region src/cli.d.ts
interface CommonArgs {
  entry: string;
  theme?: string;
}
interface ExportArgs extends CommonArgs {
  'output'?: string;
  'format'?: string;
  'timeout'?: number;
  'wait'?: number;
  'wait-until'?: string;
  'range'?: string;
  'dark'?: boolean;
  'with-clicks'?: boolean;
  'executable-path'?: string;
  'with-toc'?: boolean;
  'per-slide'?: boolean;
  'scale'?: number;
  'omit-background'?: boolean;
}
interface BuildArgs extends ExportArgs {
  'out': string;
  'base'?: string;
  'download'?: boolean;
  'inspect': boolean;
  'without-notes'?: boolean;
}
//#endregion
//#region src/clicks.d.ts
type RawSingleAtValue = null | undefined | boolean | string | number;
type RawRangeAtValue = null | undefined | false | [string | number, string | number];
type RawAtValue = RawSingleAtValue | RawRangeAtValue;
type NormalizedSingleClickValue = number | string | null;
type NormalizedRangeClickValue = [number, number] | [number, string] | [string, number] | [string, string] | [string | number, string | number] | null;
type NormalizedAtValue = NormalizedSingleClickValue | NormalizedRangeClickValue;
type ClicksElement = Element | string;
interface ClicksInfo {
  /**
   * The absolute start click num
   */
  start: number;
  /**
   * The absolute end click num
   */
  end: number;
  /**
   * The required total click num
   */
  max: number;
  /**
   * The delta for relative clicks
   */
  delta: number;
  /**
   * currentClicks - start
   */
  currentOffset: ComputedRef<number>;
  /**
   * currentOffset === 0
   */
  isCurrent: ComputedRef<boolean>;
  /**
   * Computed ref of whether the click is active
   */
  isActive: ComputedRef<boolean>;
}
interface ClicksContext {
  current: number;
  readonly clicksStart: number;
  readonly relativeSizeMap: Map<ClicksElement, number>;
  readonly maxMap: Map<ClicksElement, number>;
  calculateSince: (at: RawSingleAtValue, size?: number) => ClicksInfo | null;
  calculateRange: (at: RawRangeAtValue) => ClicksInfo | null;
  calculate: (at: RawAtValue) => ClicksInfo | null;
  register: (el: ClicksElement, info: Pick<ClicksInfo, 'delta' | 'max'> | null) => void;
  unregister: (el: ClicksElement) => void;
  readonly isMounted: boolean;
  setup: () => void;
  readonly currentOffset: number;
  readonly total: number;
}
//#endregion
//#region src/code-runner.d.ts
interface CodeRunnerContext {
  /**
   * Options passed to runner via the `runnerOptions` prop.
   */
  options: Record<string, unknown>;
  /**
   * Highlight code with shiki.
   */
  highlight: (code: string, lang: string, options?: Partial<CodeToHastOptions>) => string;
  /**
   * Use (other) code runner to run code.
   */
  run: (code: string, lang: string) => Promise<CodeRunnerOutputs>;
}
interface CodeRunnerOutputHtml {
  /**
   * The HTML to be rendered.
   *
   * Slidev does NOT sanitize the HTML for you - make sure it's from trusted sources or sanitize it before passing it in
   */
  html: string;
}
interface CodeRunnerOutputDom {
  /**
   * The DOM element to be rendered.
   */
  element: HTMLElement;
}
interface CodeRunnerOutputError {
  /**
   * The error message to be displayed.
   */
  error: string;
}
interface CodeRunnerOutputText {
  /**
   * The text to be displayed.
   */
  text: string;
  /**
   * The class to be applied to the text.
   */
  class?: string;
  /**
   * The language to be highlighted.
   */
  highlightLang?: string;
}
type CodeRunnerOutputTextArray = CodeRunnerOutputText[];
type CodeRunnerOutput = CodeRunnerOutputHtml | CodeRunnerOutputError | CodeRunnerOutputText | CodeRunnerOutputTextArray | CodeRunnerOutputDom;
type CodeRunnerOutputs = MaybeRefOrGetter<Arrayable<CodeRunnerOutput>>;
type CodeRunner = (code: string, ctx: CodeRunnerContext) => Awaitable<CodeRunnerOutputs>;
type CodeRunnerProviders = Record<string, CodeRunner>;
//#endregion
//#region src/builtin-layouts.d.ts
type BuiltinLayouts = '404' | 'center' | 'cover' | 'default' | 'end' | 'error' | 'fact' | 'full' | 'iframe-left' | 'iframe-right' | 'iframe' | 'image-left' | 'image-right' | 'image' | 'intro' | 'none' | 'quote' | 'section' | 'statement' | 'two-cols-header' | 'two-cols';
//#endregion
//#region src/types.d.ts
type FrontmatterStyle = 'frontmatter' | 'yaml';
interface SlideInfoBase {
  revision: string;
  frontmatter: Record<string, any>;
  content: string;
  frontmatterRaw?: string;
  note?: string;
  title?: string;
  level?: number;
  /**
   * Image URLs extracted from the slide content (frontmatter, markdown, Vue components, CSS).
   * Populated at parse time to survive build-mode content stripping.
   */
  images?: string[];
}
interface SourceSlideInfo extends SlideInfoBase {
  /**
   * The filepath of the markdown file
   */
  filepath: string;
  /**
   * The index of the slide in the markdown file
   */
  index: number;
  /**
   * The range of the slide in the markdown file
   */
  start: number;
  contentStart: number;
  end: number;
  raw: string;
  /**
   * Raw content before being processed by preparsers (if any)
   */
  contentRaw: string;
  /**
   * Slides imported by this slide.
   */
  imports?: SourceSlideInfo[];
  frontmatterDoc?: YAML.Document<YAML.Node, true>;
  frontmatterStyle?: FrontmatterStyle;
}
interface SlideInfo extends SlideInfoBase {
  /**
   * The index of the slide in the presentation
   */
  index: number;
  /**
   * The importers of this slide. `[]` if this slide is the entry markdown file
   */
  importChain?: SourceSlideInfo[];
  /**
   * The source slide where the content is from
   */
  source: SourceSlideInfo;
  noteHTML?: string;
}
/**
 * Editable fields for a slide
 */
type SlidePatch = Partial<Pick<SlideInfoBase, 'content' | 'note' | 'frontmatterRaw'>> & {
  skipHmr?: boolean;
  /**
   * The frontmatter patch (only the changed fields)
   * `null` to remove a field
   */
  frontmatter?: Record<string, any>;
};
/**
 * Metadata for "slidev" field in themes' package.json
 */
interface SlidevThemeMeta {
  defaults?: Partial<SlidevConfig>;
  colorSchema?: 'dark' | 'light' | 'both';
  highlighter?: 'shiki';
}
type SlidevThemeConfig = Record<string, string | number>;
interface SlidevDetectedFeatures {
  katex: boolean;
  /**
   * `false` or referenced module specifiers
   */
  monaco: false | {
    types: string[];
    deps: string[];
  };
  tweet: boolean;
  mermaid: boolean;
}
interface SlidevMarkdown {
  filepath: string;
  raw: string;
  /**
   * All slides in this markdown file
   */
  slides: SourceSlideInfo[];
  errors?: {
    row: number;
    message: string;
  }[];
}
interface SlidevData {
  /**
   * Slides that should be rendered (disabled slides excluded)
   */
  slides: SlideInfo[];
  entry: SlidevMarkdown;
  config: SlidevConfig;
  headmatter: Record<string, unknown>;
  features: SlidevDetectedFeatures;
  themeMeta?: SlidevThemeMeta;
  markdownFiles: Record<string, SlidevMarkdown>;
  /**
   * From watched files to indexes of slides that must be reloaded regardless of the loaded content
   */
  watchFiles: Record<string, Set<number>>;
}
interface SlidevPreparserExtension {
  name?: string;
  transformRawLines?: (lines: string[]) => Promise<void> | void;
  transformSlide?: (content: string, frontmatter: any) => Promise<string | undefined>;
  transformNote?: (note: string | undefined, frontmatter: any) => Promise<string | undefined>;
}
type PreparserExtensionLoader = (headmatter: Record<string, unknown>, filepath: string, mode?: string) => Promise<SlidevPreparserExtension[]>;
type RenderContext = 'none' | 'slide' | 'overview' | 'presenter' | 'previewNext';
interface SlideRoute {
  no: number;
  meta: RouteMeta & Required<Pick<RouteMeta, 'slide'>>;
  /**
   * load the slide component itself
   */
  load: () => Promise<{
    default: RouteComponent;
  }>;
  /**
   * Wrapped async component
   */
  component: Component;
}
//#endregion
//#region src/frontmatter.d.ts
interface Headmatter extends HeadmatterConfig, Omit<Frontmatter, 'title'> {
  /**
   * Default frontmatter options applied to all slides
   */
  defaults?: Frontmatter;
}
interface HeadmatterConfig extends TransitionOptions {
  /**
   * Title of the slides
   */
  title?: string;
  /**
   * String template to compose title
   *
   * @example "%s - Slidev" - to suffix " - Slidev" to all pages
   * @default '%s - Slidev'
   */
  titleTemplate?: string;
  /**
   * Theme to use for the slides
   *
   * See https://sli.dev/guide/theme-addon#use-theme
   * @default 'default'
   */
  theme?: string;
  /**
   * List of Slidev addons
   *
   * @default []
   */
  addons?: string[];
  /**
   * Download remote assets in local using vite-plugin-remote-assets
   *
   * @default false
   */
  remoteAssets?: boolean | 'dev' | 'build';
  /**
   * Show a download button in the SPA build,
   * could also be a link to custom pdf
   *
   * @default false
   */
  download?: boolean | string;
  /**
   * Show a copy button in code blocks
   *
   * @default true
   */
  codeCopy?: boolean;
  /**
   * Show copy button in magic move code blocks
   *
   * `'final'` for only show copy button on the final step
   * `'always'` or `true` for show copy button on all steps
   *
   * @default true
   */
  magicMoveCopy?: boolean | 'final' | 'always';
  /**
   * The author of the slides
   */
  author?: string;
  /**
   * Information shows on the built SPA
   * Can be a markdown string
   *
   * @default false
   */
  info?: string | boolean;
  /**
   * Prefer highlighter
   *
   * See https://sli.dev/custom/config-highlighter.html
   * @default shiki
   */
  highlighter?: 'shiki';
  /**
   * Enable Twoslash
   *
   * @default true
   */
  twoslash?: boolean | 'dev' | 'build';
  /**
   * Show line numbers in code blocks
   *
   * @default false
   */
  lineNumbers?: boolean;
  /**
   * Force slides color schema
   *
   * @default 'auto'
   */
  colorSchema?: 'dark' | 'light' | 'all' | 'auto';
  /**
   * Router mode for vue-router
   *
   * @default 'history'
   */
  routerMode?: 'hash' | 'history';
  /**
   * Aspect ratio for slides
   * should be like `16/9` or `1:1`
   *
   * @default '16/9'
   */
  aspectRatio?: number | string;
  /**
   * The actual width for slides canvas.
   * unit in px.
   *
   * @default '980'
   */
  canvasWidth?: number;
  /**
   * Controls whether texts in slides are selectable
   *
   * @default true
   */
  selectable?: boolean;
  /**
   * Configure for themes, will inject intro root styles as
   * `--slidev-theme-x` for attribute `x`
   *
   * This allows themes to have customization options in frontmatter
   * Refer to themes' document for options avaliable
   *
   * @default {}
   */
  themeConfig?: SlidevThemeConfig;
  /**
   * Configure fonts for the slides and app
   *
   * @default {}
   */
  fonts?: FontOptions;
  /**
   * Configure the icon for app
   *
   * @default 'https://cdn.jsdelivr.net/gh/slidevjs/slidev/assets/favicon.png'
   */
  favicon?: string;
  /**
   * Options for drawings
   *
   * @default {}
   */
  drawings?: DrawingsOptions;
  /**
   * URL of PlantUML server used to render diagrams
   *
   * @default https://www.plantuml.com/plantuml
   */
  plantUmlServer?: string;
  /**
   * Enable slides recording
   *
   * @default 'dev'
   */
  record?: boolean | 'dev' | 'build';
  /**
   * Expose the server to inbound requests (listen to `0.0.0.0`)
   *
   * Pass a string to set the password for accessing presenter mode.
   *
   * @default false
   */
  remote?: string | boolean;
  /**
   * Engine for Atomic CSS
   *
   * See https://unocss.dev/
   * @deprecated
   * @default 'unocss'
   */
  css?: 'unocss';
  /**
   * Enable presenter mode
   *
   * @default true
   */
  presenter?: boolean | 'dev' | 'build';
  /**
   * Enable browser exporter
   *
   * @default 'dev'
   */
  browserExporter?: boolean | 'dev' | 'build';
  /**
   * Attributes to apply to the HTML element
   *
   * @default {}
   */
  htmlAttrs?: Record<string, string>;
  /**
   * Suppport Comark syntax
   *
   * https://comark.dev/syntax/markdown
   *
   * @default false
   */
  comark?: boolean;
  /**
   * @deprecated MDC is now Comark. Use the `comark` option instead
   * @default false
   */
  mdc?: boolean;
  /**
   * Enable built-in editor
   *
   * @default true
   */
  editor?: boolean;
  /**
   * Enable context menu
   *
   * @default true
   */
  contextMenu?: boolean | 'dev' | 'build' | null;
  /**
   * Enable wake lock
   */
  wakeLock?: boolean | 'dev' | 'build';
  /**
   * Force the filename used when exporting the presentation.
   * The extension, e.g. .pdf, gets automatically added.
   *
   * @default ''
   */
  exportFilename?: string | null;
  /**
   * Enable Monaco
   *
   * See https://sli.dev/custom/config-monaco.html
   * @default true
   */
  monaco?: boolean | 'dev' | 'build';
  /**
   * Where to load monaco types from
   *
   * - `cdn` - load from CDN with `@typescript/ata`
   * - `local` - load from local node_modules
   *
   * @default 'local'
   */
  monacoTypesSource?: 'cdn' | 'local' | 'none';
  /**
   * Additional node packages to load as monaco types
   *
   * @default []
   */
  monacoTypesAdditionalPackages?: string[];
  /**
   * Packages to ignore when loading monaco types
   *
   * @default []
   */
  monacoTypesIgnorePackages?: string[];
  /**
   * Additional local modules to load as dependencies of monaco runnable
   *
   * @default []
   */
  monacoRunAdditionalDeps?: string[];
  /**
   * Whether to run monaco runnable code in strict mode
   *
   * @default true
   */
  monacoRunUseStrict?: boolean;
  /**
   * Seo meta tags settings
   *
   * @default {}
   */
  seoMeta?: SeoMeta;
  /**
   * Auto replace words with `<ruby>` tags in notes
   *
   * @default {}
   *
   * @example
   * ```yaml
   * notesAutoRuby:
   *   大丈夫: だいじょうぶ
   * ```
   */
  notesAutoRuby?: Record<string, string>;
  /**
   * The expected duration of the slide
   *
   * @example
   * ```yaml
   * duration: 35min
   * ```
   *
   * @default '30min'
   */
  duration?: string | number;
  /**
   * Timer mode
   *
   * @default 'stopwatch'
   */
  timer?: 'stopwatch' | 'countdown';
  /**
   * Duration for shiki magic move transitions in milliseconds
   *
   * @default 800
   */
  magicMoveDuration?: number;
  /**
   * Preload images extracted from slides for faster navigation.
   *
   * - `true` - enable with default look-ahead of 3 slides
   * - `false` - disable image preloading
   * - `{ ahead: number }` - enable with custom look-ahead window
   *
   * @default true
   */
  preloadImages?: boolean | {
    ahead?: number;
  };
}
interface Frontmatter extends TransitionOptions {
  /**
   * Slide layout to use
   *
   * Default to 'cover' for the first slide, 'default' for the rest
   */
  layout?: BuiltinLayouts | string;
  /**
   * Custom class added to the slide root element
   */
  class?: string | string[] | Record<string, unknown>;
  /**
   * Manually specified the total clicks needed to this slide
   *
   * When not specified, the clicks will be calculated by the usage of v-clicks
   *
   * See https://sli.dev/guide/animations
   */
  clicks?: number;
  /**
   * Manually specified the total clicks needed to this slide to start
   *
   * @default 0
   */
  clicksStart?: number;
  /**
   * Preload the slide when the previous slide is active
   * @default true
   */
  preload?: boolean;
  /**
   * Completely hide and disable the slide
   */
  hide?: boolean;
  /**
   * Same as `hide`, completely hide and disable the slide
   */
  disabled?: boolean;
  /**
   * Hide the slide for the `<Toc>` components
   *
   * See https://sli.dev/builtin/components#toc
   */
  hideInToc?: boolean;
  /**
   * Override the title for the `<TitleRenderer>` and `<Toc>` components
   * Only if `title` has also been declared
   */
  title?: string;
  /**
   * Override the title level for the `<TitleRenderer>` and `<Toc>` components
   * Only if `title` has also been declared
   */
  level?: number;
  /**
   * Create a route alias that can be used in the URL or with the `<Link>` component
   */
  routeAlias?: string;
  /**
   * Custom zoom level for the slide
   * @default 1
   */
  zoom?: number;
  /**
   * Store the positions of draggable elements
   * Normally you don't need to set this manually
   *
   * See https://sli.dev/features/draggable
   */
  dragPos?: Record<string, string>;
  /**
   * Includes a markdown file
   *
   * See https://sli.dev/guide/syntax.html#importing-slides
   */
  src?: string;
}
interface DrawingsOptions {
  /**
   * Persist the drawings to disk
   * Passing string to specify the directory (default to `.slidev/drawings`)
   *
   * @default false
   */
  persist?: boolean | string;
  /**
   * @default true
   */
  enabled?: boolean | 'dev' | 'build';
  /**
   * Only allow drawing from presenter mode
   *
   * @default false
   */
  presenterOnly?: boolean;
  /**
   * Sync drawing for all instances
   *
   * @default true
   */
  syncAll?: boolean;
}
interface FontOptions {
  /**
   * Sans serif fonts (default fonts for most text)
   */
  sans?: string | string[];
  /**
   * Serif fonts
   */
  serif?: string | string[];
  /**
   * Monospace fonts, for code blocks and etc.
   */
  mono?: string | string[];
  /**
   * Load webfonts for custom CSS (does not apply anywhere by default)
   */
  custom?: string | string[];
  /**
   * Weights for fonts
   *
   * @default [200, 400, 600]
   */
  weights?: string | (string | number)[];
  /**
   * Import italic fonts
   *
   * @default false
   */
  italic?: boolean;
  /**
   * @default 'google'
   */
  provider?: 'none' | 'google' | 'coollabs';
  /**
   * Specify web fonts names, will detect from `sans`, `mono`, `serif` if not provided
   */
  webfonts?: string[];
  /**
   * Specify local fonts names, be excluded from webfonts
   */
  local?: string[];
  /**
   * Use fonts fallback
   *
   * @default true
   */
  fallbacks?: boolean;
}
type BuiltinSlideTransition = 'fade' | 'fade-out' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'view-transition';
interface TransitionOptions {
  /**
   * Page transition, powered by Vue's `<TransitionGroup/>`
   *
   * Built-in transitions:
   * - fade
   * - fade-out
   * - slide-left
   * - slide-right
   * - slide-up
   * - slide-down
   * - view-transition
   *
   * See https://sli.dev/guide/animations.html#pages-transitions
   *
   * See https://vuejs.org/guide/built-ins/transition.html
   */
  transition?: BuiltinSlideTransition | string | TransitionGroupProps | null;
}
interface TransitionGroupProps {
  appear?: boolean;
  persisted?: boolean;
  tag?: string;
  moveClass?: string;
  css?: boolean;
  duration?: number | {
    enter: number;
    leave: number;
  };
  enterFromClass?: string;
  enterActiveClass?: string;
  enterToClass?: string;
  appearFromClass?: string;
  appearActiveClass?: string;
  appearToClass?: string;
  leaveFromClass?: string;
  leaveActiveClass?: string;
  leaveToClass?: string;
}
/**
 * The following type should map to unhead MataFlat type
 */
interface SeoMeta {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterUrl?: string;
}
//#endregion
//#region src/config.d.ts
interface ResolvedSlidevConfigSub {
  export: ResolvedExportOptions;
  drawings: ResolvedDrawingsOptions;
  fonts: ResolvedFontOptions;
  aspectRatio: number;
}
interface SlidevConfig extends Omit<Required<HeadmatterConfig>, keyof ResolvedSlidevConfigSub>, ResolvedSlidevConfigSub {}
interface ResolvedFontOptions {
  sans: string[];
  mono: string[];
  serif: string[];
  weights: string[];
  italic: boolean;
  provider: 'none' | 'google' | 'coollabs';
  webfonts: string[];
  local: string[];
}
interface ResolvedDrawingsOptions {
  persist: string | false;
  enabled: boolean | 'dev' | 'build';
  presenterOnly: boolean;
  syncAll: boolean;
}
interface ResolvedExportOptions extends Omit<ExportArgs, 'entry' | 'theme'> {
  withClicks?: boolean;
  executablePath?: string;
  withToc?: boolean;
}
//#endregion
//#region src/context-menu.d.ts
type ContextMenuOption = {
  action: () => void;
  disabled?: boolean;
  show?: boolean;
} & ({
  small?: false;
  icon?: Component | string;
  label: string | Component;
} | {
  small: true;
  icon: Component | string;
  label: string;
});
type ContextMenuItem = ContextMenuOption | 'separator';
//#endregion
//#region src/hmr.d.ts
declare module 'vite' {
  interface CustomEventMap {
    'slidev:update-slide': {
      no: number;
      data: SlideInfo;
    };
    'slidev:update-note': {
      no: number;
      note: string;
      noteHTML: string;
    };
  }
}
//#endregion
//#region src/options.d.ts
interface RootsInfo {
  cliRoot: string;
  clientRoot: string;
  userRoot: string;
  userPkgJson: Record<string, any>;
  userWorkspaceRoot: string;
}
interface SlidevEntryOptions {
  /**
   * Markdown entry
   */
  entry: string;
  /**
   * Theme id
   */
  theme?: string;
  /**
   * Remote password
   */
  remote?: string;
  /**
   * Enable inspect plugin
   */
  inspect?: boolean;
  /**
   * Build with --download option
   */
  download?: boolean;
  /**
   * Base URL in dev or build mode
   */
  base?: string;
  /**
   * Exclude speaker notes from the built output
   */
  withoutNotes?: boolean;
}
interface ResolvedSlidevOptions extends RootsInfo, SlidevEntryOptions {
  data: SlidevData;
  themeRaw: string;
  themeRoots: string[];
  addonRoots: string[];
  /**
   * =`[...themeRoots, ...addonRoots, userRoot]` (`clientRoot` excluded)
   */
  roots: string[];
  mode: 'dev' | 'build' | 'export';
  utils: ResolvedSlidevUtils;
}
interface ResolvedSlidevUtils {
  shiki: ShorthandsBundle<string, string>;
  shikiOptions: MarkdownItShikiOptions & CodeOptionsThemes$1;
  katexOptions: KatexOptions | null;
  indexHtml: string;
  define: Record<string, string>;
  iconsResolvePath: string[];
  isMonacoTypesIgnored: (pkg: string) => boolean;
  getLayouts: () => Promise<Record<string, string>>;
}
interface SlidevServerOptions {
  /**
   * @returns `false` if server should be restarted
   */
  loadData?: (loadedSource: Record<string, string>) => Promise<SlidevData | false>;
}
//#endregion
//#region src/transform.d.ts
interface MarkdownTransformContext {
  /**
   * The magic string instance for the current markdown content
   */
  s: MagicString;
  /**
   * The slide info of the current slide
   */
  slide: SlideInfo;
  /**
   * Resolved Slidev options
   */
  options: ResolvedSlidevOptions;
}
type MarkdownTransformer = (ctx: MarkdownTransformContext) => Awaitable<void>;
//#endregion
//#region src/setups.d.ts
interface AppContext {
  app: App;
  router: Router;
}
interface MonacoSetupReturn {
  editorOptions?: monaco.editor.IEditorOptions;
}
interface NavOperations {
  next: () => void;
  prev: () => Promise<void>;
  nextSlide: () => void;
  prevSlide: () => Promise<void>;
  go: (index: number) => void;
  goFirst: () => void;
  goLast: () => void;
  downloadPDF: () => Promise<void>;
  toggleDark: () => void;
  toggleOverview: () => void;
  toggleDrawing: () => void;
  escapeOverview: () => void;
  showGotoDialog: () => void;
}
interface ShortcutOptions {
  key: string | Ref<boolean>;
  fn?: () => void;
  autoRepeat?: boolean;
  name?: string;
}
interface ShikiContext {
  /**
   * @deprecated Pass directly the theme name it's supported by Shiki.
   * For custom themes, load it manually via `JSON.parse(fs.readFileSync(path, 'utf-8'))` and pass the raw JSON object instead.
   */
  loadTheme: (path: string) => Promise<any>;
}
type ShikiSetupReturn = Partial<Omit<CodeToHastOptionsCommon<BuiltinLanguage>, 'lang'> & CodeOptionsThemes<BuiltinTheme> & CodeOptionsMeta & {
  langs: (MaybeArray<LanguageRegistration> | BuiltinLanguage)[] | Record<string, LanguageInput>;
}>;
interface TransformersSetupReturn {
  pre: (MarkdownTransformer | false)[];
  preCodeblock: (MarkdownTransformer | false)[];
  postCodeblock: (MarkdownTransformer | false)[];
  post: (MarkdownTransformer | false)[];
}
type ShikiSetup = (shiki: ShikiContext) => Awaitable<ShikiSetupReturn | void>;
type KatexSetup = () => Awaitable<Partial<KatexOptions> | void>;
type UnoSetup = () => Awaitable<Partial<VitePluginConfig> | void>;
type TransformersSetup = () => Awaitable<Partial<TransformersSetupReturn>>;
type PreparserSetup = (context: {
  filepath: string;
  headmatter: Record<string, unknown>;
  mode?: string;
}) => Awaitable<SlidevPreparserExtension[]>;
type VitePluginsSetup = (options: ResolvedSlidevOptions) => PluginOption;
type MonacoSetup = (m: typeof monaco) => Awaitable<MonacoSetupReturn | void>;
type AppSetup = (context: AppContext) => Awaitable<void>;
type RootSetup = () => Awaitable<void>;
type RoutesSetup = (routes: RouteRecordRaw[]) => RouteRecordRaw[];
type MermaidSetup = () => Awaitable<Partial<MermaidConfig> | void>;
type MermaidRenderFn = (code: string, options: Record<string, any>) => Awaitable<string>;
type MermaidRendererSetup = () => Awaitable<MermaidRenderFn | void>;
type ShortcutsSetup = (nav: NavOperations, defaultShortcuts: ShortcutOptions[]) => Array<ShortcutOptions>;
type CodeRunnersSetup = (runners: CodeRunnerProviders) => Awaitable<CodeRunnerProviders | void>;
type ContextMenuSetup = (items: ComputedRef<ContextMenuItem[]>) => ComputedRef<ContextMenuItem[]>;
declare const defineShikiSetup: (fn: ShikiSetup) => ShikiSetup;
declare const defineUnoSetup: (fn: UnoSetup) => UnoSetup;
declare const defineMonacoSetup: (fn: MonacoSetup) => MonacoSetup;
declare const defineAppSetup: (fn: AppSetup) => AppSetup;
declare const defineRootSetup: (fn: RootSetup) => RootSetup;
declare const defineRoutesSetup: (fn: RoutesSetup) => RoutesSetup;
declare const defineMermaidSetup: (fn: MermaidSetup) => MermaidSetup;
declare const defineMermaidRendererSetup: (fn: MermaidRendererSetup) => MermaidRendererSetup;
declare const defineKatexSetup: (fn: KatexSetup) => KatexSetup;
declare const defineShortcutsSetup: (fn: ShortcutsSetup) => ShortcutsSetup;
declare const defineTransformersSetup: (fn: TransformersSetup) => TransformersSetup;
declare const definePreparserSetup: (fn: PreparserSetup) => PreparserSetup;
declare const defineVitePluginsSetup: (fn: VitePluginsSetup) => VitePluginsSetup;
declare const defineCodeRunnersSetup: (fn: CodeRunnersSetup) => CodeRunnersSetup;
declare const defineContextMenuSetup: (fn: ContextMenuSetup) => ContextMenuSetup;
//#endregion
//#region src/toc.d.ts
interface TocItem {
  no: number;
  active?: boolean;
  activeParent?: boolean;
  children: TocItem[];
  hasActiveParent?: boolean;
  level: number;
  titleLevel: number;
  path: string;
  hideInToc?: boolean;
  title?: string;
}
//#endregion
//#region src/vite.d.ts
interface SlidevPluginOptions {
  vue?: ArgumentsType<typeof Vue>[0];
  vuejsx?: ArgumentsType<typeof VueJsx>[0];
  markdown?: ArgumentsType<typeof Markdown>[0];
  components?: ArgumentsType<typeof Components>[0];
  icons?: ArgumentsType<typeof Icons>[0];
  remoteAssets?: ArgumentsType<typeof RemoteAssets>[0];
  serverRef?: ArgumentsType<typeof ServerRef>[0];
  unocss?: VitePluginConfig;
  staticCopy?: ViteStaticCopyOptions;
  inspect?: ViteInspectOptions;
}
declare module 'vite' {
  interface UserConfig {
    /**
     * Custom internal plugin options for Slidev (advanced)
     *
     * See https://github.com/slidevjs/slidev/blob/main/packages/slidev/node/options.ts#L50
     */
    slidev?: SlidevPluginOptions;
  }
}
//#endregion
export { AppContext, AppSetup, BuildArgs, BuiltinSlideTransition, ClicksContext, ClicksElement, ClicksInfo, CodeRunner, CodeRunnerContext, CodeRunnerOutput, CodeRunnerOutputDom, CodeRunnerOutputError, CodeRunnerOutputHtml, CodeRunnerOutputText, CodeRunnerOutputTextArray, CodeRunnerOutputs, CodeRunnerProviders, CodeRunnersSetup, CommonArgs, ContextMenuItem, ContextMenuSetup, DrawingsOptions, ExportArgs, FontOptions, Frontmatter, FrontmatterStyle, Headmatter, HeadmatterConfig, KatexSetup, MarkdownTransformContext, MarkdownTransformer, MermaidRenderFn, MermaidRendererSetup, MermaidSetup, MonacoSetup, MonacoSetupReturn, NavOperations, NormalizedAtValue, NormalizedRangeClickValue, NormalizedSingleClickValue, PreparserExtensionLoader, PreparserSetup, RawAtValue, RawRangeAtValue, RawSingleAtValue, RenderContext, ResolvedDrawingsOptions, ResolvedExportOptions, ResolvedFontOptions, ResolvedSlidevConfigSub, ResolvedSlidevOptions, ResolvedSlidevUtils, RootSetup, RootsInfo, RoutesSetup, SeoMeta, ShikiContext, ShikiSetup, ShikiSetupReturn, ShortcutOptions, ShortcutsSetup, SlideInfo, SlideInfoBase, SlidePatch, SlideRoute, SlidevConfig, SlidevData, SlidevDetectedFeatures, SlidevEntryOptions, SlidevMarkdown, SlidevPluginOptions, SlidevPreparserExtension, SlidevServerOptions, SlidevThemeConfig, SlidevThemeMeta, SourceSlideInfo, TocItem, TransformersSetup, TransformersSetupReturn, TransitionGroupProps, TransitionOptions, UnoSetup, VitePluginsSetup, defineAppSetup, defineCodeRunnersSetup, defineContextMenuSetup, defineKatexSetup, defineMermaidRendererSetup, defineMermaidSetup, defineMonacoSetup, definePreparserSetup, defineRootSetup, defineRoutesSetup, defineShikiSetup, defineShortcutsSetup, defineTransformersSetup, defineUnoSetup, defineVitePluginsSetup };