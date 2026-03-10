import * as mdurl from "mdurl";
import LinkifyIt from "linkify-it";

//#region src/token.d.ts
/**
 * -  `1` means the tag is opening
 * -  `0` means the tag is self-closing
 * - `-1` means the tag is closing
 */
type Nesting = 1 | 0 | -1;
type HTMLAttribute = [name: string, value: string];
type SourceMapLineRange = [line_begin: number, line_end: number];
declare class Token {
  /**
   * Type of the token, e.g. "paragraph_open"
   */
  type: string;
  /**
   * HTML tag name, e.g. "p"
   */
  tag: string;
  /**
   * HTML attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
   */
  attrs: HTMLAttribute[] | null;
  /**
   * Source map info. Format: `[ line_begin, line_end ]`
   */
  map: SourceMapLineRange | null;
  /**
   * Level change (number in {-1, 0, 1} set)
   */
  nesting: Nesting;
  /**
   * Nesting level, the same as `state.level`
   */
  level: number;
  /**
   * An array of child nodes (inline and img tokens)
   */
  children: Token[] | null;
  /**
   * In a case of self-closing tag (code, html, fence, etc.),
   * it has contents of this tag.
   */
  content: string;
  /**
   * '*' or '_' for emphasis, fence string for fence, etc.
   */
  markup: string;
  /**
   * - Info string for "fence" tokens
   * - The value "auto" for autolink "link_open" and "link_close" tokens
   * - The string value of the item marker for ordered-list "list_item_open" tokens
   * - Label string of "reference" tokens
   */
  info: string;
  /**
   * A place for plugins to store an arbitrary data
   */
  meta: any;
  /**
   * True for block-level tokens, false for inline tokens.
   * Used in renderer to calculate line breaks
   */
  block: boolean;
  /**
   * If it's true, ignore this element when rendering. Used for tight lists
   * to hide paragraphs.
   */
  hidden: boolean;
  /**
   * Create new token and fill passed properties.
   */
  constructor(type: string, tag: string, nesting: Nesting);
  /**
   * Search attribute index by name.
   */
  attrIndex(name: string): number;
  /**
   * Add `[ name, value ]` attribute to list. Init attrs if necessary
   */
  attrPush(attrData: HTMLAttribute): void;
  /**
   * Set `name` attribute to `value`. Override old value if exists.
   */
  attrSet(name: string, value: string): void;
  /**
   * Get the value of attribute `name`, or null if it does not exist.
   */
  attrGet(name: string): string | null;
  /**
   * Join value to existing attribute via space. Or create new attribute if not
   * exists. Useful to operate with token classes.
   */
  attrJoin(name: string, value: string): void;
}
//#endregion
//#region src/types/shared.d.ts
interface MarkdownExitEnv {
  references?: Record<string, {
    title: string;
    href: string;
  }>;
  [key: string]: any;
}
//#endregion
//#region src/parser/ruler.d.ts
interface RuleOptions {
  /**
   * array with names of "alternate" chains.
   */
  alt?: string[];
}
/**
 * Helper class, used by {@link MarkdownExit.core}, {@link MarkdownExit.block} and
 * {@link MarkdownExit.inline} to manage sequences of functions (rules):
 *
 * - keep rules in defined order
 * - assign the name to each rule
 * - enable/disable rules
 * - add/replace rules
 * - allow assign rules to additional named chains (in the same)
 * - caching lists of active rules
 *
 * You will not need use this class directly until write plugins. For simple
 * rules control use {@link MarkdownExit.disable}, {@link MarkdownExit.enable} and
 * {@link MarkdownExit.use}.
 */
declare class Ruler<T extends (...args: any[]) => any> {
  /**
   * List of added rules. Each element is:
   *
   * ```js
   * {
   *   name: XXX,
   *   enabled: Boolean,
   *   fn: Function(),
   *   alt: [ name2, name3 ]
   * }
   * ```
   */
  private __rules__;
  /**
   * Cached rule chains.
   *
   * First level - chain name, '' for default.
   * Second level - diginal anchor for fast filtering by charcodes.
   */
  private __cache__;
  /**
   * Helper methods, should not be used directly
   * Find rule index by name
   */
  private __find__;
  /**
   * Build rules lookup cache
   */
  private __compile__;
  /**
   * Ruler.at(name, fn [, options])
   * - name (String): rule name to replace.
   * - fn (Function): new rule function.
   * - options (Object): new rule options (not mandatory).
   *
   * Replace rule by name with new function & options. Throws error if name not
   * found.
   *
   * ##### Options:
   *
   * - __alt__ - array with names of "alternate" chains.
   *
   * ##### Example
   *
   * Replace existing typographer replacement rule with new one:
   *
   * ```javascript
   * md.core.ruler.at('replacements', function replace(state) {
   *   //...
   * });
   * ```
   */
  at(name: string, fn: T, options?: RuleOptions): void;
  /**
   * Ruler.before(beforeName, ruleName, fn [, options])
   * - beforeName (String): new rule will be added before this one.
   * - ruleName (String): name of added rule.
   * - fn (Function): rule function.
   * - options (Object): rule options (not mandatory).
   *
   * Add new rule to chain before one with given name. See also
   * [[Ruler.after]], [[Ruler.push]].
   *
   * ##### Options:
   *
   * - __alt__ - array with names of "alternate" chains.
   *
   * ##### Example
   *
   * ```javascript
   * md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
   *   //...
   * });
   * ```
   */
  before(beforeName: string, ruleName: string, fn: T, options?: RuleOptions): void;
  /**
   * Ruler.after(afterName, ruleName, fn [, options])
   * - afterName (String): new rule will be added after this one.
   * - ruleName (String): name of added rule.
   * - fn (Function): rule function.
   * - options (Object): rule options (not mandatory).
   *
   * Add new rule to chain after one with given name. See also
   * [[Ruler.before]], [[Ruler.push]].
   *
   * ##### Options:
   *
   * - __alt__ - array with names of "alternate" chains.
   *
   * ##### Example
   *
   * ```javascript
   * md.inline.ruler.after('text', 'my_rule', function replace(state) {
   *   //...
   * });
   * ```
   */
  after(afterName: string, ruleName: string, fn: T, options?: RuleOptions): void;
  /**
   * Ruler.push(ruleName, fn [, options])
   * - ruleName (String): name of added rule.
   * - fn (Function): rule function.
   * - options (Object): rule options (not mandatory).
   *
   * Push new rule to the end of chain. See also
   * [[Ruler.before]], [[Ruler.after]].
   *
   * ##### Options:
   *
   * - __alt__ - array with names of "alternate" chains.
   *
   * ##### Example
   *
   * ```javascript
   * md.core.ruler.push('my_rule', function replace(state) {
   *   //...
   * });
   * ```
   */
  push(ruleName: string, fn: T, options?: RuleOptions): void;
  /**
   * Ruler.enable(list [, ignoreInvalid]) -> Array
   * - list (String|Array): list of rule names to enable.
   * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
   *
   * Enable rules with given names. If any rule name not found - throw Error.
   * Errors can be disabled by second param.
   *
   * Returns list of found rule names (if no exception happened).
   *
   * See also [[Ruler.disable]], [[Ruler.enableOnly]].
   */
  enable(list: string | string[], ignoreInvalid?: boolean): string[];
  /**
   * Ruler.enableOnly(list [, ignoreInvalid])
   * - list (String|Array): list of rule names to enable (whitelist).
   * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
   *
   * Enable rules with given names, and disable everything else. If any rule name
   * not found - throw Error. Errors can be disabled by second param.
   *
   * See also [[Ruler.disable]], [[Ruler.enable]].
   */
  enableOnly(list: string | string[], ignoreInvalid?: boolean): void;
  /**
   * Ruler.disable(list [, ignoreInvalid]) -> Array
   * - list (String|Array): list of rule names to disable.
   * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
   *
   * Disable rules with given names. If any rule name not found - throw Error.
   * Errors can be disabled by second param.
   *
   * Returns list of found rule names (if no exception happened).
   *
   * See also [[Ruler.enable]], [[Ruler.enableOnly]].
   */
  disable(list: string | string[], ignoreInvalid?: boolean): string[];
  /**
   * Ruler.getRules(chainName) -> Array
   *
   * Return array of active functions (rules) for given chain name. It analyzes
   * rules configuration, compiles caches if not exists and returns result.
   *
   * Default chain name is `''` (empty string). It can't be skipped. That's
   * done intentionally, to keep signature monomorphic for high speed.
   */
  getRules(chainName: string): T[];
}
//#endregion
//#region src/parser/block/state_block.d.ts
declare class StateBlock<T extends Parser = Parser> {
  src: string;
  /**
   * link to parser instance
   */
  md: T;
  env: MarkdownExitEnv;
  tokens: Token[];
  /**
   * line begin offsets for fast jumps
   */
  bMarks: number[];
  /**
   * line end offsets for fast jumps
   */
  eMarks: number[];
  /**
   * offsets of the first non-space characters (tabs not expanded)
   */
  tShift: number[];
  /**
   * indents for each line (tabs expanded)
   */
  sCount: number[];
  /**
   * An amount of virtual spaces (tabs expanded) between beginning
   * of each line (bMarks) and real beginning of that line.
   *
   * It exists only as a hack because blockquotes override bMarks
   * losing information in the process.
   *
   * It's used only when expanding tabs, you can think about it as
   * an initial tab length, e.g. bsCount=21 applied to string `\t123`
   * means first tab should be expanded to 4-21%4 === 3 spaces.
   */
  bsCount: number[];
  /**
   * required block content indent (for example, if we are
   * inside a list, it would be positioned after list marker)
   */
  blkIndent: number;
  /**
   * line index in src
   */
  line: number;
  /**
   * lines count
   */
  lineMax: number;
  /**
   * loose/tight mode for lists
   */
  tight: boolean;
  /**
   * indent of the current dd block (-1 if there isn't any)
   */
  ddIndent: number;
  /**
   * indent of the current list block (-1 if there isn't any)
   */
  listIndent: number;
  /**
   * used in lists to determine if they interrupt a paragraph
   */
  parentType: BlockRule | 'root' | (string & {});
  level: number;
  /**
   * re-export Token class to use in block rules
   */
  Token: typeof Token;
  constructor(src: string, md: T, env: MarkdownExitEnv, tokens: Token[]);
  /**
   * Push new token to "stream".
   */
  push(type: string, tag: string, nesting: Nesting): Token;
  isEmpty(line: number): boolean;
  skipEmptyLines(from: number): number;
  /**
   * Skip spaces from given position.
   */
  skipSpaces(pos: number): number;
  /**
   * Skip spaces from given position in reverse.
   */
  skipSpacesBack(pos: number, min: number): number;
  /**
   * Skip char codes from given position
   */
  skipChars(pos: number, code: number): number;
  /**
   * Skip char codes reverse from given position - 1
   */
  skipCharsBack(pos: number, code: number, min: number): number;
  /**
   * cut lines range from source.
   */
  getLines(begin: number, end: number, indent: number, keepLastLF: boolean): string;
}
//#endregion
//#region src/parser/block/rules/blockquote.d.ts
declare function blockquote(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean;
//#endregion
//#region src/parser/block/rules/code.d.ts
declare function code(state: StateBlock, startLine: number, endLine: number): boolean;
//#endregion
//#region src/parser/block/rules/fence.d.ts
declare function fence(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean;
//#endregion
//#region src/parser/block/rules/heading.d.ts
declare function heading(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean;
//#endregion
//#region src/parser/block/rules/hr.d.ts
declare function hr(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean;
//#endregion
//#region src/parser/block/rules/html_block.d.ts
declare function html_block(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean;
//#endregion
//#region src/parser/block/rules/lheading.d.ts
declare function lheading(state: StateBlock, startLine: number, endLine: number): boolean;
//#endregion
//#region src/parser/block/rules/list.d.ts
declare function list(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean;
//#endregion
//#region src/parser/block/rules/paragraph.d.ts
declare function paragraph(state: StateBlock, startLine: number, endLine: number): boolean;
//#endregion
//#region src/parser/block/rules/reference.d.ts
declare function reference(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean;
//#endregion
//#region src/parser/block/rules/table.d.ts
declare function table(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean;
//#endregion
//#region src/parser/block/parser_block.d.ts
type RuleBlock = (state: StateBlock, startLine: number, endLine: number, silent: boolean) => boolean;
declare const _rules$2: [["table", typeof table, ["paragraph", "reference"]], ["code", typeof code], ["fence", typeof fence, ["paragraph", "reference", "blockquote", "list"]], ["blockquote", typeof blockquote, ["paragraph", "reference", "blockquote", "list"]], ["hr", typeof hr, ["paragraph", "reference", "blockquote", "list"]], ["list", typeof list, ["paragraph", "reference", "blockquote"]], ["reference", typeof reference], ["html_block", typeof html_block, ["paragraph", "reference", "blockquote"]], ["heading", typeof heading, ["paragraph", "reference", "blockquote"]], ["lheading", typeof lheading], ["paragraph", typeof paragraph]];
type BlockRule = typeof _rules$2[number][0];
declare class ParserBlock<T extends Parser = Parser> {
  /**
   * {@link Ruler} instance. Keep configuration of block rules.
   */
  ruler: Ruler<RuleBlock>;
  constructor();
  /**
   * Generate tokens for input range
   */
  tokenize(state: StateBlock, startLine: number, endLine: number, silent?: boolean): void;
  /**
   * Process input string and push block tokens into `outTokens`
   */
  parse(src: string, md: T, env: MarkdownExitEnv, outTokens: Token[]): void;
  State: {
    new (src: string, md: T, env: MarkdownExitEnv, tokens: Token[]): StateBlock<T>;
  };
}
//#endregion
//#region src/parser/core/state_core.d.ts
declare class StateCore<T extends Parser = Parser> {
  src: string;
  env: MarkdownExitEnv;
  tokens: Token[];
  inlineMode: boolean;
  /**
   * link to parser instance
   */
  md: T;
  constructor(src: string, md: T, env: MarkdownExitEnv);
  Token: typeof Token;
}
//#endregion
//#region src/parser/core/rules/block.d.ts
declare function block(state: StateCore): void;
//#endregion
//#region src/parser/core/rules/inline.d.ts
declare function inline(state: StateCore): void;
//#endregion
//#region src/parser/core/rules/linkify.d.ts
declare function linkify$1(state: StateCore): void;
//#endregion
//#region src/parser/core/rules/normalize.d.ts
declare function normalize(state: StateCore): void;
//#endregion
//#region src/parser/core/rules/replacements.d.ts
declare function replace(state: StateCore): void;
//#endregion
//#region src/parser/core/rules/smartquotes.d.ts
declare function smartquotes(state: StateCore): void;
//#endregion
//#region src/parser/core/rules/text_join.d.ts
declare function text_join(state: StateCore): void;
//#endregion
//#region src/parser/core/parser_core.d.ts
type RuleCore = (state: StateCore) => void;
declare const _rules$1: [["normalize", typeof normalize], ["block", typeof block], ["inline", typeof inline], ["linkify", typeof linkify$1], ["replacements", typeof replace], ["smartquotes", typeof smartquotes], ["text_join", typeof text_join]];
type CoreRule = typeof _rules$1[number][0];
declare class Core<T extends Parser = Parser> {
  /**
   * {@link Ruler} instance. Keep configuration of core rules.
   */
  ruler: Ruler<RuleCore>;
  constructor();
  /**
   * Executes core chain rules.
   */
  process(state: StateCore): void;
  State: {
    new (src: string, md: T, env: MarkdownExitEnv): StateCore<T>;
  };
}
//#endregion
//#region src/parser/helpers/parse_link_destination.d.ts
interface ParseLinkDestinationResult {
  ok: boolean;
  pos: number;
  str: string;
}
declare function parseLinkDestination(str: string, start: number, max: number): ParseLinkDestinationResult;
//#endregion
//#region src/parser/inline/state_inline.d.ts
interface Delimiter {
  marker: number;
  length: number;
  token: number;
  end: number;
  open: boolean;
  close: boolean;
}
interface TokenMeta {
  delimiters: Delimiter[];
}
declare class StateInline<T extends Parser = Parser> {
  src: string;
  env: MarkdownExitEnv;
  md: T;
  tokens: Token[];
  tokens_meta: Array<TokenMeta | null>;
  pos: number;
  posMax: number;
  level: number;
  pending: string;
  pendingLevel: number;
  /**
   * Stores { start: end } pairs. Useful for backtrack
   * optimization of pairs parse (emphasis, strikes).
   */
  cache: Record<string, number>;
  /**
   * List of emphasis-like delimiters for current tag
   */
  delimiters: Delimiter[];
  /**
   * Stack of delimiter lists for upper level tags
   */
  _prev_delimiters: Delimiter[][];
  /**
   * backtick length => last seen position
   */
  backticks: Record<string, number>;
  backticksScanned: boolean;
  /**
   * Counter used to disable inline linkify-it execution
   * inside <a> and markdown links
   */
  linkLevel: number;
  constructor(src: string, md: T, env: MarkdownExitEnv, outTokens: Token[]);
  /**
   * Flush pending text
   */
  pushPending(): Token;
  /**
   * Push new token to "stream".
   * If pending text exists - flush it as text token
   */
  push(type: string, tag: string, nesting: Nesting): Token;
  /**
   * Scan a sequence of emphasis-like markers, and determine whether
   * it can start an emphasis sequence or end an emphasis sequence.
   *
   *  - start - position to scan from (it should point at a valid marker);
   *  - canSplitWord - determine if these markers can be found inside a word
   */
  scanDelims(start: number, canSplitWord: boolean): {
    can_open: boolean;
    can_close: boolean;
    length: number;
  };
  Token: typeof Token;
}
//#endregion
//#region src/parser/helpers/parse_link_label.d.ts
declare function parseLinkLabel(state: StateInline, start: number, disableNested?: boolean): number;
//#endregion
//#region src/parser/helpers/parse_link_title.d.ts
interface ParseLinkTitleResult {
  /**
   * if `true`, this is a valid link title
   */
  ok: boolean;
  /**
   * if `true`, this link can be continued on the next line
   */
  can_continue: boolean;
  /**
   * if `ok`, it's the position of the first character after the closing marker
   */
  pos: number;
  /**
   * if `ok`, it's the unescaped title
   */
  str: string;
  /**
   * expected closing marker character code
   */
  marker: number;
}
declare function parseLinkTitle(str: string, start: number, max: number, prev_state?: ParseLinkTitleResult): ParseLinkTitleResult;
//#endregion
//#region src/parser/parser.d.ts
interface ParserOptions {
  /**
   * Set `true` to enable HTML tags in source. Be careful!
   * That's not safe! You may need external sanitizer to protect output from XSS.
   * It's better to extend features via plugins, instead of enabling HTML.
   * @default false
   */
  html?: boolean;
  /**
   * Set `true` to autoconvert URL-like text to links.
   * @default false
   */
  linkify?: boolean;
  /**
   * Set `true` to enable [some language-neutral replacement](https://github.com/serkodev/markdown-exit/blob/main/packages/markdown-exit/src/parser/core/rules/replacements.ts) +
   * quotes beautification (smartquotes).
   * @default false
   */
  typographer?: boolean;
  /**
   * Double + single quotes replacement
   * pairs, when typographer enabled and smartquotes on. For example, you can
   * use `'«»„“'` for Russian, `'„“‚‘'` for German, and
   * `['«\xA0', '\xA0»', '‹\xA0', '\xA0›']` for French (including nbsp).
   * @default '“”‘’'
   */
  quotes?: string | string[];
  /**
   * Internal protection, recursion limit
   */
  maxNesting?: number;
}
declare const defaultOptions: Required<ParserOptions>;
declare class Parser {
  /**
   * Instance of {@link ParserInline}. You may need it to add new rules when writing plugins.
   */
  inline: ParserInline<typeof this>;
  /**
   * Instance of {@link ParserBlock}. You may need it to add new rules when writing plugins.
   */
  block: ParserBlock<typeof this>;
  /**
   * Instance of {@link Core} chain executor. You may need it to add new rules when writing plugins.
   */
  core: Core<typeof this>;
  /**
   * [linkify-it](https://github.com/markdown-it/linkify-it) instance.
   * Used by [linkify](https://github.com/serkodev/markdown-exit/blob/main/packages/markdown-exit/src/parser/core/rules/linkify.ts)
   * rule.
   */
  linkify: LinkifyIt;
  /**
   * Link validation function. CommonMark allows too much in links. By default
   * we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
   * except some embedded image types.
   *
   * You can change this behaviour:
   *
   * ```javascript
   * // enable everything
   * md.validateLink = () => true
   * ```
   */
  validateLink: (url: string) => boolean;
  /**
   * Function used to encode link url to a machine-readable format,
   * which includes url-encoding, punycode, etc.
   */
  normalizeLink: (url: string) => string;
  /**
   * Function used to decode link url to a human-readable format`
   */
  normalizeLinkText: (url: string) => string;
  /**
   * Link components parser functions, useful to write plugins. See details
   * [here](https://github.com/serkodev/markdown-exit/tree/main/packages/markdown-exit/src/parser/helpers).
   */
  helpers: {
    parseLinkDestination: typeof parseLinkDestination;
    parseLinkLabel: typeof parseLinkLabel;
    parseLinkTitle: typeof parseLinkTitle;
  };
  options: Required<ParserOptions>;
  /**
   * Parse input string and returns list of block tokens (special token type
   * "inline" will contain list of inline tokens). You should not call this
   * method directly, until you write custom renderer (for example, to produce
   * AST).
   *
   * `env` is used to pass data between "distributed" rules and return additional
   * metadata like reference info, needed for the renderer. It also can be used to
   * inject data in specific cases. Usually, you will be ok to pass `{}`,
   * and then pass updated object to renderer.
   *
   * @param src source string
   * @param env environment sandbox
   */
  parse(src: string, env?: MarkdownExitEnv): Token[];
  /**
   * The same as {@link parse} but skip all block rules. It returns the
   * block tokens list with the single `inline` element, containing parsed inline
   * tokens in `children` property. Also updates `env` object.
   *
   * @param src source string
   * @param env environment sandbox
   */
  parseInline(src: string, env?: MarkdownExitEnv): Token[];
}
//#endregion
//#region src/parser/inline/rules/autolink.d.ts
declare function autolink(state: StateInline, silent: boolean): boolean;
//#endregion
//#region src/parser/inline/rules/backticks.d.ts
declare function backtick(state: StateInline, silent: boolean): boolean;
//#endregion
//#region src/parser/inline/rules/balance_pairs.d.ts
declare function link_pairs(state: StateInline): void;
//#endregion
//#region src/parser/inline/rules/entity.d.ts
declare function entity(state: StateInline, silent: boolean): boolean;
//#endregion
//#region src/parser/inline/rules/escape.d.ts
declare function escape(state: StateInline, silent: boolean): boolean;
//#endregion
//#region src/parser/inline/rules/fragments_join.d.ts
declare function fragments_join(state: StateInline): void;
//#endregion
//#region src/parser/inline/rules/html_inline.d.ts
declare function html_inline(state: StateInline, silent: boolean): boolean;
//#endregion
//#region src/parser/inline/rules/image.d.ts
declare function image(state: StateInline, silent: boolean): boolean;
//#endregion
//#region src/parser/inline/rules/link.d.ts
declare function link(state: StateInline, silent: boolean): boolean;
//#endregion
//#region src/parser/inline/rules/linkify.d.ts
declare function linkify(state: StateInline, silent: boolean): boolean;
//#endregion
//#region src/parser/inline/rules/newline.d.ts
declare function newline(state: StateInline, silent: boolean): boolean;
//#endregion
//#region src/parser/inline/rules/text.d.ts
declare function text(state: StateInline, silent: boolean): boolean;
//#endregion
//#region src/parser/inline/parser_inline.d.ts
type RuleInline = (state: StateInline, silent: boolean) => boolean;
type RuleInline2 = (state: StateInline) => void;
declare const _rules: [["text", typeof text], ["linkify", typeof linkify], ["newline", typeof newline], ["escape", typeof escape], ["backticks", typeof backtick], ["strikethrough", (state: StateInline, silent: boolean) => boolean], ["emphasis", (state: StateInline, silent: boolean) => boolean], ["link", typeof link], ["image", typeof image], ["autolink", typeof autolink], ["html_inline", typeof html_inline], ["entity", typeof entity]];
type InlineRule = typeof _rules[number][0];
declare const _rules2: [["balance_pairs", typeof link_pairs], ["strikethrough", (state: StateInline) => void], ["emphasis", (state: StateInline) => void], ["fragments_join", typeof fragments_join]];
type InlineRule2 = typeof _rules2[number][0];
declare class ParserInline<T extends Parser = Parser> {
  /**
   * {@link Ruler} instance. Keep configuration of inline rules.
   */
  ruler: Ruler<RuleInline>;
  /**
   * {@link Ruler} instance. Second ruler used for post-processing
   * (e.g. in emphasis-like rules).
   */
  ruler2: Ruler<RuleInline2>;
  constructor();
  /**
   * Skip single token by running all rules in validation mode;
   * returns `true` if any rule reported success
   */
  skipToken(state: StateInline): void;
  /**
   * Generate tokens for input range
   */
  tokenize(state: StateInline): void;
  /**
   * Process input string and push inline tokens into `outTokens`
   */
  parse(str: string, md: T, env: MarkdownExitEnv, outTokens: Token[]): void;
  State: {
    new (src: string, md: T, env: MarkdownExitEnv, outTokens: Token[]): StateInline<T>;
  };
}
//#endregion
//#region src/renderer.d.ts
interface RenderOptions {
  /**
   * Set `true` to add '/' when closing single tags
   * (`<br />`). This is needed only for full CommonMark compatibility. In real
   * world you will need HTML output.
   * @default false
   */
  xhtmlOut?: boolean;
  /**
   * Set `true` to convert `\n` in paragraphs into `<br>`.
   * @default false
   */
  breaks?: boolean;
  /**
   * CSS language class prefix for fenced blocks.
   * Can be useful for external highlighters.
   * @default 'language-'
   */
  langPrefix?: string;
  /**
   * Highlighter function for fenced code blocks.
   * Highlighter `function (str, lang, attrs)` should return escaped HTML. It can
   * also return empty string if the source was not changed and should be escaped
   * externally. If result starts with <pre... internal wrapper is skipped.
   * @default null
   */
  highlight?: ((str: string, lang: string, attrs: string, env: MarkdownExitEnv) => string | Promise<string>) | null;
}
type RenderRule = (tokens: Token[], idx: number, options: RenderOptions, env: MarkdownExitEnv, self: Renderer) => string | Promise<string>;
interface RenderRuleRecord {
  [type: string]: RenderRule | undefined;
  code_inline?: RenderRule | undefined;
  code_block?: RenderRule | undefined;
  fence?: RenderRule | undefined;
  image?: RenderRule | undefined;
  hardbreak?: RenderRule | undefined;
  softbreak?: RenderRule | undefined;
  text?: RenderRule | undefined;
  html_block?: RenderRule | undefined;
  html_inline?: RenderRule | undefined;
}
declare class Renderer {
  /**
   * Contains render rules for tokens. Can be updated and extended.
   *
   * ##### Example
   *
   * ```javascript
   * md.renderer.rules.strong_open = () => '<b>';
   * md.renderer.rules.strong_close = () => '</b>';
   *
   * var result = md.renderInline(...);
   * ```
   *
   * @see https://github.com/serkodev/markdown-exit/tree/main/packages/markdown-exit/src/renderer.ts
   */
  rules: RenderRuleRecord;
  /**
   * Creates new {@link Renderer} instance and fill {@link Renderer#rules} with defaults.
   */
  constructor();
  /**
   * Render token attributes to string.
   */
  renderAttrs(token: Pick<Token, 'attrs'>): string;
  /**
   * Default token renderer. Can be overriden by custom function
   * in {@link Renderer#rules}.
   *
   * @param tokens list of tokens
   * @param idx token index to render
   * @param options params of parser instance
   * @param env additional data from parsed input (references, for example)
   */
  renderToken(tokens: Token[], idx: number, options: RenderOptions, env?: MarkdownExitEnv): string;
  /**
   * The same as {@link Renderer.render}, but for single token of `inline` type.
   *
   * @param tokens list of block tokens to render
   * @param options params of parser instance
   * @param env additional data from parsed input (references, for example)
   */
  renderInline(tokens: Token[], options: RenderOptions, env?: MarkdownExitEnv): string;
  /**
   * Special kludge for image `alt` attributes to conform CommonMark spec.
   * Don't try to use it! Spec requires to show `alt` content with stripped markup,
   * instead of simple escaping.
   *
   * @param tokens list of block tokens to render
   * @param options params of parser instance
   * @param env additional data from parsed input (references, for example)
   */
  renderInlineAsText(tokens: Token[], options: RenderOptions, env?: MarkdownExitEnv): string;
  /**
   * Takes token stream and generates HTML. Probably, you will never need to call
   * this method directly.
   *
   * @param tokens list of block tokens to render
   * @param options params of parser instance
   * @param env additional data from parsed input (references, for example)
   */
  render(tokens: Token[], options: RenderOptions, env?: MarkdownExitEnv): string;
  /**
   * Async version of {@link Renderer.renderInline}. Runs all render rules in parallel
   * (Promise.all) and preserves output order.
   */
  renderInlineAsync(tokens: Token[], options: RenderOptions, env?: any): Promise<string>;
  /**
   * Async version of {@link Renderer.render}. Runs all render rules in parallel
   * (Promise.all) and preserves output order.
   */
  renderAsync(tokens: Token[], options: RenderOptions, env?: any): Promise<string>;
}
//#endregion
//#region src/types/preset.d.ts
interface Preset {
  options: Required<MarkdownExitOptions>;
  components: {
    core: {
      rules?: CoreRule[];
    };
    block: {
      rules?: BlockRule[];
    };
    inline: {
      rules?: InlineRule[];
      rules2?: InlineRule2[];
    };
  };
}
declare namespace utils_d_exports {
  export { arrayReplaceAt, assign, escapeHtml, escapeRE, fromCodePoint, has, isMdAsciiPunct, isPromiseLike, isPunctChar, isSpace, isString, isValidEntityCode, isWhiteSpace, lib, normalizeReference, unescapeAll, unescapeMd };
}
declare function isString(obj: unknown): obj is string;
declare function has(object: object, key: string | number | symbol): boolean;
type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends ((x: infer R) => void) ? R : never;
/**
 * Merge objects
 */
declare function assign<T extends object, S extends readonly (object | null | undefined)[]>(target: T, ...sources: S): T & UnionToIntersection<NonNullable<S[number]>>;
declare function arrayReplaceAt<T>(src: readonly T[], pos: number, newElements: readonly T[]): T[];
declare function isValidEntityCode(c: number): boolean;
declare function fromCodePoint(c: number): string;
declare function unescapeMd(str: string): string;
declare function unescapeAll(str: string): string;
declare function escapeHtml(str: string): string;
declare function escapeRE(str: string): string;
declare function isSpace(code: number): boolean;
declare function isWhiteSpace(code: number): boolean;
declare function isPunctChar(ch: string): boolean;
declare function isMdAsciiPunct(ch: number): boolean;
declare function normalizeReference(str: string): string;
declare function isPromiseLike<T = unknown>(v: any): v is Promise<T>;
/**
 * Re-export libraries commonly used in both markdown-it and its plugins,
 * so plugins won't have to depend on them explicitly, which reduces their
 * bundled size (e.g. a browser build).
 */
declare const lib: {
  mdurl: typeof mdurl;
  ucmicro: any;
};
//#endregion
//#region src/core.d.ts
/**
 * MarkdownExit provides named presets as a convenience to quickly
 * enable/disable active syntax rules and options for common use cases.
 *
 * - ["commonmark"](https://github.com/serkodev/markdown-exit/tree/main/packages/markdown-exit/src/presets/commonmark.ts) -
 *   configures parser to strict [CommonMark](http://commonmark.org/) mode.
 * - [default](https://github.com/serkodev/markdown-exit/tree/main/packages/markdown-exit/src/presets/default.ts) -
 *   similar to GFM, used when no preset name given. Enables all available rules,
 *   but still without html, typographer & autolinker.
 * - ["zero"](https://github.com/serkodev/markdown-exit/tree/main/packages/markdown-exit/src/presets/zero.ts) -
 *   all rules disabled. Useful to quickly setup your config via `.enable()`.
 *   For example, when you need only `bold` and `italic` markup and nothing else.
 */
type PresetName = 'default' | 'zero' | 'commonmark';
interface MarkdownExitOptions extends ParserOptions, RenderOptions {}
type PluginSimple = (md: MarkdownExit) => void;
type PluginWithOptions<T = any> = (md: MarkdownExit, options?: T) => void;
type PluginWithParams = (md: MarkdownExit, ...params: any[]) => void;
declare class MarkdownExit extends Parser {
  /**
   * Instance of {@link Renderer}. Use it to modify output look. Or to add rendering
   * rules for new token types, generated by plugins.
   *
   * ##### Example
   *
   * ```javascript
   * function myToken(tokens, idx, options, env, self) {
   *   //...
   *   return result;
   * };
   *
   * md.renderer.rules['my_token'] = myToken
   * ```
   *
   * See {@link Renderer} docs and [source code](https://github.com/serkodev/markdown-exit/tree/main/packages/markdown-exit/src/renderer.ts).
   */
  renderer: Renderer;
  /**
   * Assorted utility functions, useful to write plugins. See details
   * [here](https://github.com/serkodev/markdown-exit/tree/main/packages/markdown-exit/src/common/utils.ts).
   */
  utils: typeof utils_d_exports;
  options: Required<MarkdownExitOptions>;
  constructor(options?: MarkdownExitOptions);
  constructor(presetName: PresetName, options?: MarkdownExitOptions);
  /**
   * chainable*
   *
   * Set parser options (in the same format as in constructor). Probably, you
   * will never need it, but you can change options after constructor call.
   *
   * ##### Example
   *
   * ```javascript
   * md.set({ html: true, breaks: true })
   *   .set({ typographer: true });
   * ```
   *
   * __Note:__ To achieve the best possible performance, don't modify a
   * `markdown-exit` instance options on the fly. If you need multiple configurations
   * it's best to create multiple instances and initialize each with separate
   * config.
   */
  set(options: MarkdownExitOptions): this;
  /**
   * chainable*, *internal*
   *
   * Batch load of all options and compenent settings. This is internal method,
   * and you probably will not need it. But if you with - see available presets
   * and data structure [here](https://github.com/serkodev/markdown-exit/tree/main/packages/markdown-exit/src/presets)
   *
   * We strongly recommend to use presets instead of direct config loads. That
   * will give better compatibility with next versions.
   */
  configure(presets: PresetName | Preset): this;
  /**
   * chainable*
   *
   * Enable list or rules. It will automatically find appropriate components,
   * containing rules with given names. If rule not found, and `ignoreInvalid`
   * not set - throws exception.
   *
   * ##### Example
   *
   * ```javascript
   * md.enable(['sub', 'sup'])
   *   .disable('smartquotes');
   * ```
   *
   * @param list rule name or list of rule names to enable
   * @param ignoreInvalid set `true` to ignore errors when rule not found.
   */
  enable(list: string | string[], ignoreInvalid?: boolean): this;
  /**
   * chainable*
   *
   * The same as {@link MarkdownExit.enable}, but turn specified rules off.
   *
   * @param list rule name or list of rule names to disable.
   * @param ignoreInvalid set `true` to ignore errors when rule not found.
   */
  disable(list: string | string[], ignoreInvalid?: boolean): this;
  /**
   * chainable*
   *
   * Load specified plugin with given params into current parser instance.
   * It's just a sugar to call `plugin(md, params)` with curring.
   *
   * ##### Example
   *
   * ```javascript
   * var iterator = require('markdown-it-for-inline');
   * md.use(iterator, 'foo_replace', 'text', function (tokens, idx) {
   *   tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar');
   * });
   * ```
   */
  use(plugin: PluginSimple): this;
  use<T = any>(plugin: PluginWithOptions<T>, options?: T): this;
  use(plugin: PluginWithParams, ...params: any[]): this;
  /**
   * Render markdown string into html. It does all magic for you :).
   *
   * `env` can be used to inject additional metadata (`{}` by default).
   * But you will not need it with high probability. See also comment
   * in {@link MarkdownExit.parse}.
   *
   * @param src source string
   * @param env environment sandbox
   */
  render(src: string, env?: MarkdownExitEnv): string;
  /**
   * Async version of {@link MarkdownExit.render}. Runs all render rules in parallel
   * (Promise.all) and preserves output order.
   */
  renderAsync(src: string, env?: MarkdownExitEnv): Promise<string>;
  /**
   * Similar to {@link MarkdownExit.render} but for single paragraph content. Result
   * will NOT be wrapped into `<p>` tags.
   *
   * @param src source string
   * @param env environment sandbox
   */
  renderInline(src: string, env?: MarkdownExitEnv): string;
  /**
   * Async version of {@link MarkdownExit.renderInline}. Runs all render rules in parallel
   * (Promise.all) and preserves output order.
   */
  renderInlineAsync(src: string, env?: MarkdownExitEnv): Promise<string>;
}
declare function createMarkdownExit(options?: MarkdownExitOptions): MarkdownExit;
declare function createMarkdownExit(presetName: PresetName, options?: MarkdownExitOptions): MarkdownExit;
//#endregion
//#region src/index.d.ts
type MarkdownExitConstructor = InstanceType<typeof MarkdownExit>;
declare const MarkdownExitConstructor: (typeof createMarkdownExit & typeof MarkdownExit);
//#endregion
export { HTMLAttribute, MarkdownExit, MarkdownExitOptions, Nesting, Parser, ParserOptions, PluginSimple, PluginWithOptions, PluginWithParams, PresetName, RenderOptions, RenderRule, RenderRuleRecord, Renderer, type RuleBlock, type RuleCore, type RuleInline, RuleOptions, Ruler, SourceMapLineRange, StateBlock, StateCore, StateInline, Token, createMarkdownExit, MarkdownExitConstructor as default, defaultOptions };