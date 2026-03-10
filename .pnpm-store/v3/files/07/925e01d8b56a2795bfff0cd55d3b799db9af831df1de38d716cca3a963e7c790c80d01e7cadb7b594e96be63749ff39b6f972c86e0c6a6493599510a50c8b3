import { t as __exportAll } from "./chunk-CzXV76rE.js";
import { decodeHTML } from "entities";
import * as mdurl from "mdurl";
import * as ucmicro from "uc.micro";
import LinkifyIt from "linkify-it";
import punycode from "punycode.js";

//#region src/common/utils.ts
var utils_exports = /* @__PURE__ */ __exportAll({
	arrayReplaceAt: () => arrayReplaceAt,
	assign: () => assign,
	escapeHtml: () => escapeHtml,
	escapeRE: () => escapeRE,
	fromCodePoint: () => fromCodePoint,
	has: () => has,
	isMdAsciiPunct: () => isMdAsciiPunct,
	isPromiseLike: () => isPromiseLike,
	isPunctChar: () => isPunctChar,
	isSpace: () => isSpace,
	isString: () => isString,
	isValidEntityCode: () => isValidEntityCode,
	isWhiteSpace: () => isWhiteSpace,
	lib: () => lib,
	normalizeReference: () => normalizeReference,
	unescapeAll: () => unescapeAll,
	unescapeMd: () => unescapeMd
});
function isString(obj) {
	return typeof obj === "string";
}
const _hasOwnProperty = Object.prototype.hasOwnProperty;
function has(object, key) {
	return _hasOwnProperty.call(object, key);
}
function assign(target, ...sources) {
	for (const s of sources) {
		if (!s) continue;
		if (typeof s !== "object") throw new TypeError("source must be object");
		Object.assign(target, s);
	}
	return target;
}
function arrayReplaceAt(src, pos, newElements) {
	return src.slice(0, pos).concat(newElements, src.slice(pos + 1));
}
function isValidEntityCode(c) {
	if (c >= 55296 && c <= 57343) return false;
	if (c >= 64976 && c <= 65007) return false;
	if ((c & 65535) === 65535 || (c & 65535) === 65534) return false;
	if (c >= 0 && c <= 8) return false;
	if (c === 11) return false;
	if (c >= 14 && c <= 31) return false;
	if (c >= 127 && c <= 159) return false;
	if (c > 1114111) return false;
	return true;
}
function fromCodePoint(c) {
	if (c > 65535) {
		c -= 65536;
		const surrogate1 = 55296 + (c >> 10);
		const surrogate2 = 56320 + (c & 1023);
		return String.fromCharCode(surrogate1, surrogate2);
	}
	return String.fromCharCode(c);
}
const UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g;
const UNESCAPE_ALL_RE = new RegExp(`${UNESCAPE_MD_RE.source}|${/&([a-z#][a-z0-9]{1,31});/gi.source}`, "gi");
const DIGITAL_ENTITY_TEST_RE = /^#(x[a-f0-9]{1,8}|\d{1,8})$/i;
function replaceEntityPattern(match, name) {
	if (name.charCodeAt(0) === 35 && DIGITAL_ENTITY_TEST_RE.test(name)) {
		const code$1 = name[1].toLowerCase() === "x" ? Number.parseInt(name.slice(2), 16) : Number.parseInt(name.slice(1), 10);
		if (isValidEntityCode(code$1)) return fromCodePoint(code$1);
		return match;
	}
	const decoded = decodeHTML(match);
	if (decoded !== match) return decoded;
	return match;
}
function unescapeMd(str) {
	if (!str.includes("\\")) return str;
	return str.replace(UNESCAPE_MD_RE, "$1");
}
function unescapeAll(str) {
	if (!str.includes("\\") && !str.includes("&")) return str;
	return str.replace(UNESCAPE_ALL_RE, (match, escaped, entity$1) => {
		if (escaped) return escaped;
		return replaceEntityPattern(match, entity$1);
	});
}
const HTML_ESCAPE_TEST_RE = /[&<>"]/;
const HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
const HTML_REPLACEMENTS = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
};
function replaceUnsafeChar(ch) {
	return HTML_REPLACEMENTS[ch];
}
function escapeHtml(str) {
	if (HTML_ESCAPE_TEST_RE.test(str)) return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
	return str;
}
const REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;
function escapeRE(str) {
	return str.replace(REGEXP_ESCAPE_RE, "\\$&");
}
function isSpace(code$1) {
	switch (code$1) {
		case 9:
		case 32: return true;
	}
	return false;
}
function isWhiteSpace(code$1) {
	if (code$1 >= 8192 && code$1 <= 8202) return true;
	switch (code$1) {
		case 9:
		case 10:
		case 11:
		case 12:
		case 13:
		case 32:
		case 160:
		case 5760:
		case 8239:
		case 8287:
		case 12288: return true;
	}
	return false;
}
function isPunctChar(ch) {
	return ucmicro.P.test(ch) || ucmicro.S.test(ch);
}
function isMdAsciiPunct(ch) {
	switch (ch) {
		case 33:
		case 34:
		case 35:
		case 36:
		case 37:
		case 38:
		case 39:
		case 40:
		case 41:
		case 42:
		case 43:
		case 44:
		case 45:
		case 46:
		case 47:
		case 58:
		case 59:
		case 60:
		case 61:
		case 62:
		case 63:
		case 64:
		case 91:
		case 92:
		case 93:
		case 94:
		case 95:
		case 96:
		case 123:
		case 124:
		case 125:
		case 126: return true;
		default: return false;
	}
}
function normalizeReference(str) {
	str = str.trim().replace(/\s+/g, " ");
	if ("ẞ".toLowerCase() === "Ṿ") str = str.replace(/ẞ/g, "ß");
	return str.toLowerCase().toUpperCase();
}
function isPromiseLike(v) {
	return typeof v?.then === "function";
}
/**
* Re-export libraries commonly used in both markdown-it and its plugins,
* so plugins won't have to depend on them explicitly, which reduces their
* bundled size (e.g. a browser build).
*/
const lib = {
	mdurl,
	ucmicro
};

//#endregion
//#region src/token.ts
var Token = class {
	/**
	* Type of the token, e.g. "paragraph_open"
	*/
	type;
	/**
	* HTML tag name, e.g. "p"
	*/
	tag;
	/**
	* HTML attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
	*/
	attrs = null;
	/**
	* Source map info. Format: `[ line_begin, line_end ]`
	*/
	map = null;
	/**
	* Level change (number in {-1, 0, 1} set)
	*/
	nesting;
	/**
	* Nesting level, the same as `state.level`
	*/
	level = 0;
	/**
	* An array of child nodes (inline and img tokens)
	*/
	children = null;
	/**
	* In a case of self-closing tag (code, html, fence, etc.),
	* it has contents of this tag.
	*/
	content = "";
	/**
	* '*' or '_' for emphasis, fence string for fence, etc.
	*/
	markup = "";
	/**
	* - Info string for "fence" tokens
	* - The value "auto" for autolink "link_open" and "link_close" tokens
	* - The string value of the item marker for ordered-list "list_item_open" tokens
	* - Label string of "reference" tokens
	*/
	info = "";
	/**
	* A place for plugins to store an arbitrary data
	*/
	meta = null;
	/**
	* True for block-level tokens, false for inline tokens.
	* Used in renderer to calculate line breaks
	*/
	block = false;
	/**
	* If it's true, ignore this element when rendering. Used for tight lists
	* to hide paragraphs.
	*/
	hidden = false;
	/**
	* Create new token and fill passed properties.
	*/
	constructor(type, tag, nesting) {
		this.type = type;
		this.tag = tag;
		this.nesting = nesting;
	}
	/**
	* Search attribute index by name.
	*/
	attrIndex(name) {
		if (!this.attrs) return -1;
		const attrs = this.attrs;
		for (let i = 0, len = attrs.length; i < len; i++) if (attrs[i][0] === name) return i;
		return -1;
	}
	/**
	* Add `[ name, value ]` attribute to list. Init attrs if necessary
	*/
	attrPush(attrData) {
		if (this.attrs) this.attrs.push(attrData);
		else this.attrs = [attrData];
	}
	/**
	* Set `name` attribute to `value`. Override old value if exists.
	*/
	attrSet(name, value) {
		const idx = this.attrIndex(name);
		const attrData = [name, value];
		if (idx < 0) this.attrPush(attrData);
		else this.attrs[idx] = attrData;
	}
	/**
	* Get the value of attribute `name`, or null if it does not exist.
	*/
	attrGet(name) {
		const idx = this.attrIndex(name);
		let value = null;
		if (idx >= 0) value = this.attrs[idx][1];
		return value;
	}
	/**
	* Join value to existing attribute via space. Or create new attribute if not
	* exists. Useful to operate with token classes.
	*/
	attrJoin(name, value) {
		const idx = this.attrIndex(name);
		if (idx < 0) this.attrPush([name, value]);
		else this.attrs[idx][1] = `${this.attrs[idx][1]} ${value}`;
	}
};

//#endregion
//#region src/parser/block/state_block.ts
var StateBlock = class {
	src;
	/**
	* link to parser instance
	*/
	md;
	env;
	tokens;
	/**
	* line begin offsets for fast jumps
	*/
	bMarks = [];
	/**
	* line end offsets for fast jumps
	*/
	eMarks = [];
	/**
	* offsets of the first non-space characters (tabs not expanded)
	*/
	tShift = [];
	/**
	* indents for each line (tabs expanded)
	*/
	sCount = [];
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
	bsCount = [];
	/**
	* required block content indent (for example, if we are
	* inside a list, it would be positioned after list marker)
	*/
	blkIndent = 0;
	/**
	* line index in src
	*/
	line = 0;
	/**
	* lines count
	*/
	lineMax = 0;
	/**
	* loose/tight mode for lists
	*/
	tight = false;
	/**
	* indent of the current dd block (-1 if there isn't any)
	*/
	ddIndent = -1;
	/**
	* indent of the current list block (-1 if there isn't any)
	*/
	listIndent = -1;
	/**
	* used in lists to determine if they interrupt a paragraph
	*/
	parentType = "root";
	level = 0;
	/**
	* re-export Token class to use in block rules
	*/
	Token = Token;
	constructor(src, md, env, tokens) {
		this.src = src;
		this.md = md;
		this.env = env;
		this.tokens = tokens;
		const s = this.src;
		const len = s.length;
		for (let start = 0; start < len;) {
			const lineEnd = s.indexOf("\n", start);
			const end = lineEnd === -1 ? len : lineEnd;
			let indent = 0;
			let offset = 0;
			let pos = start;
			while (pos < end) {
				const ch = s.charCodeAt(pos);
				if (isSpace(ch)) {
					indent++;
					offset += ch === 9 ? 4 - offset % 4 : 1;
					pos++;
					continue;
				}
				break;
			}
			this.bMarks.push(start);
			this.eMarks.push(end);
			this.tShift.push(indent);
			this.sCount.push(offset);
			this.bsCount.push(0);
			start = end + 1;
		}
		this.bMarks.push(s.length);
		this.eMarks.push(s.length);
		this.tShift.push(0);
		this.sCount.push(0);
		this.bsCount.push(0);
		this.lineMax = this.bMarks.length - 1;
	}
	/**
	* Push new token to "stream".
	*/
	push(type, tag, nesting) {
		const token = new Token(type, tag, nesting);
		token.block = true;
		if (nesting < 0) this.level--;
		token.level = this.level;
		if (nesting > 0) this.level++;
		this.tokens.push(token);
		return token;
	}
	isEmpty(line) {
		return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
	}
	skipEmptyLines(from) {
		for (let max = this.lineMax; from < max; from++) if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) break;
		return from;
	}
	/**
	* Skip spaces from given position.
	*/
	skipSpaces(pos) {
		const src = this.src;
		for (let max = src.length; pos < max; pos++) if (!isSpace(src.charCodeAt(pos))) break;
		return pos;
	}
	/**
	* Skip spaces from given position in reverse.
	*/
	skipSpacesBack(pos, min) {
		if (pos <= min) return pos;
		const src = this.src;
		while (pos > min) if (!isSpace(src.charCodeAt(--pos))) return pos + 1;
		return pos;
	}
	/**
	* Skip char codes from given position
	*/
	skipChars(pos, code$1) {
		const src = this.src;
		for (let max = src.length; pos < max; pos++) if (src.charCodeAt(pos) !== code$1) break;
		return pos;
	}
	/**
	* Skip char codes reverse from given position - 1
	*/
	skipCharsBack(pos, code$1, min) {
		if (pos <= min) return pos;
		const src = this.src;
		while (pos > min) if (code$1 !== src.charCodeAt(--pos)) return pos + 1;
		return pos;
	}
	/**
	* cut lines range from source.
	*/
	getLines(begin, end, indent, keepLastLF) {
		if (begin >= end) return "";
		const queue = new Array(end - begin);
		const src = this.src;
		for (let i = 0, line = begin; line < end; line++, i++) {
			let lineIndent = 0;
			const lineStart = this.bMarks[line];
			let first = lineStart;
			let last;
			if (line + 1 < end || keepLastLF) last = this.eMarks[line] + 1;
			else last = this.eMarks[line];
			while (first < last && lineIndent < indent) {
				const ch = src.charCodeAt(first);
				if (isSpace(ch)) if (ch === 9) lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
				else lineIndent++;
				else if (first - lineStart < this.tShift[line]) lineIndent++;
				else break;
				first++;
			}
			if (lineIndent > indent) queue[i] = " ".repeat(lineIndent - indent) + this.src.slice(first, last);
			else queue[i] = this.src.slice(first, last);
		}
		return queue.join("");
	}
};

//#endregion
//#region src/parser/core/state_core.ts
var StateCore = class {
	src;
	env;
	tokens = [];
	inlineMode = false;
	/**
	* link to parser instance
	*/
	md;
	constructor(src, md, env) {
		this.src = src;
		this.env = env;
		this.md = md;
	}
	Token = Token;
};

//#endregion
//#region src/parser/inline/state_inline.ts
var StateInline = class {
	src;
	env;
	md;
	tokens;
	tokens_meta;
	pos = 0;
	posMax;
	level = 0;
	pending = "";
	pendingLevel = 0;
	/**
	* Stores { start: end } pairs. Useful for backtrack
	* optimization of pairs parse (emphasis, strikes).
	*/
	cache = {};
	/**
	* List of emphasis-like delimiters for current tag
	*/
	delimiters = [];
	/**
	* Stack of delimiter lists for upper level tags
	*/
	_prev_delimiters = [];
	/**
	* backtick length => last seen position
	*/
	backticks = {};
	backticksScanned = false;
	/**
	* Counter used to disable inline linkify-it execution
	* inside <a> and markdown links
	*/
	linkLevel = 0;
	constructor(src, md, env, outTokens) {
		this.src = src;
		this.env = env;
		this.md = md;
		this.tokens = outTokens;
		this.tokens_meta = new Array(outTokens.length);
		this.posMax = this.src.length;
	}
	/**
	* Flush pending text
	*/
	pushPending() {
		const token = new Token("text", "", 0);
		token.content = this.pending;
		token.level = this.pendingLevel;
		this.tokens.push(token);
		this.pending = "";
		return token;
	}
	/**
	* Push new token to "stream".
	* If pending text exists - flush it as text token
	*/
	push(type, tag, nesting) {
		if (this.pending) this.pushPending();
		const token = new Token(type, tag, nesting);
		let token_meta = null;
		if (nesting < 0) {
			this.level--;
			this.delimiters = this._prev_delimiters.pop() ?? [];
		}
		token.level = this.level;
		if (nesting > 0) {
			this.level++;
			this._prev_delimiters.push(this.delimiters);
			this.delimiters = [];
			token_meta = { delimiters: this.delimiters };
		}
		this.pendingLevel = this.level;
		this.tokens.push(token);
		this.tokens_meta.push(token_meta);
		return token;
	}
	/**
	* Scan a sequence of emphasis-like markers, and determine whether
	* it can start an emphasis sequence or end an emphasis sequence.
	*
	*  - start - position to scan from (it should point at a valid marker);
	*  - canSplitWord - determine if these markers can be found inside a word
	*/
	scanDelims(start, canSplitWord) {
		const src = this.src;
		const max = this.posMax;
		const marker = src.charCodeAt(start);
		const lastChar = start > 0 ? src.charCodeAt(start - 1) : 32;
		let pos = start;
		while (pos < max && src.charCodeAt(pos) === marker) pos++;
		const count = pos - start;
		const nextChar = pos < max ? src.charCodeAt(pos) : 32;
		const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
		const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
		const isLastWhiteSpace = isWhiteSpace(lastChar);
		const isNextWhiteSpace = isWhiteSpace(nextChar);
		const left_flanking = !isNextWhiteSpace && (!isNextPunctChar || isLastWhiteSpace || isLastPunctChar);
		const right_flanking = !isLastWhiteSpace && (!isLastPunctChar || isNextWhiteSpace || isNextPunctChar);
		return {
			can_open: left_flanking && (canSplitWord || !right_flanking || isLastPunctChar),
			can_close: right_flanking && (canSplitWord || !left_flanking || isNextPunctChar),
			length: count
		};
	}
	Token = Token;
};

//#endregion
//#region src/parser/ruler.ts
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
var Ruler = class {
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
	__rules__ = [];
	/**
	* Cached rule chains.
	*
	* First level - chain name, '' for default.
	* Second level - diginal anchor for fast filtering by charcodes.
	*/
	__cache__ = null;
	/**
	* Helper methods, should not be used directly
	* Find rule index by name
	*/
	__find__(name) {
		for (let i = 0; i < this.__rules__.length; i++) if (this.__rules__[i].name === name) return i;
		return -1;
	}
	/**
	* Build rules lookup cache
	*/
	__compile__() {
		const chains = new Set([""]);
		for (const rule of this.__rules__) {
			if (!rule.enabled) continue;
			for (const altName of rule.alt) chains.add(altName);
		}
		this.__cache__ = {};
		for (const chain of chains) {
			const fns = [];
			for (const rule of this.__rules__) {
				if (!rule.enabled) continue;
				if (chain && !rule.alt.includes(chain)) continue;
				fns.push(rule.fn);
			}
			this.__cache__[chain] = fns;
		}
	}
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
	at(name, fn, options = {}) {
		const index = this.__find__(name);
		const opt = options || {};
		if (index === -1) throw new Error(`Parser rule not found: ${name}`);
		this.__rules__[index].fn = fn;
		this.__rules__[index].alt = opt.alt || [];
		this.__cache__ = null;
	}
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
	before(beforeName, ruleName, fn, options) {
		const index = this.__find__(beforeName);
		const opt = options || {};
		if (index === -1) throw new Error(`Parser rule not found: ${beforeName}`);
		this.__rules__.splice(index, 0, {
			name: ruleName,
			enabled: true,
			fn,
			alt: opt.alt || []
		});
		this.__cache__ = null;
	}
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
	after(afterName, ruleName, fn, options) {
		const index = this.__find__(afterName);
		const opt = options || {};
		if (index === -1) throw new Error(`Parser rule not found: ${afterName}`);
		this.__rules__.splice(index + 1, 0, {
			name: ruleName,
			enabled: true,
			fn,
			alt: opt.alt || []
		});
		this.__cache__ = null;
	}
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
	push(ruleName, fn, options) {
		const opt = options || {};
		this.__rules__.push({
			name: ruleName,
			enabled: true,
			fn,
			alt: opt.alt || []
		});
		this.__cache__ = null;
	}
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
	enable(list$1, ignoreInvalid) {
		if (!Array.isArray(list$1)) list$1 = [list$1];
		const result = [];
		for (const name of list$1) {
			const idx = this.__find__(name);
			if (idx < 0) {
				if (ignoreInvalid) continue;
				throw new Error(`Rules manager: invalid rule name ${name}`);
			}
			this.__rules__[idx].enabled = true;
			result.push(name);
		}
		this.__cache__ = null;
		return result;
	}
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
	enableOnly(list$1, ignoreInvalid) {
		if (!Array.isArray(list$1)) list$1 = [list$1];
		for (const rule of this.__rules__) rule.enabled = false;
		this.enable(list$1, ignoreInvalid);
	}
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
	disable(list$1, ignoreInvalid) {
		if (!Array.isArray(list$1)) list$1 = [list$1];
		const result = [];
		for (const name of list$1) {
			const idx = this.__find__(name);
			if (idx < 0) {
				if (ignoreInvalid) continue;
				throw new Error(`Rules manager: invalid rule name ${name}`);
			}
			this.__rules__[idx].enabled = false;
			result.push(name);
		}
		this.__cache__ = null;
		return result;
	}
	/**
	* Ruler.getRules(chainName) -> Array
	*
	* Return array of active functions (rules) for given chain name. It analyzes
	* rules configuration, compiles caches if not exists and returns result.
	*
	* Default chain name is `''` (empty string). It can't be skipped. That's
	* done intentionally, to keep signature monomorphic for high speed.
	*/
	getRules(chainName) {
		if (this.__cache__ === null) this.__compile__();
		return this.__cache__[chainName] || [];
	}
};

//#endregion
//#region src/parser/block/rules/blockquote.ts
function blockquote(state, startLine, endLine, silent) {
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	let max = state.eMarks[startLine];
	const oldLineMax = state.lineMax;
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	if (state.src.charCodeAt(pos) !== 62) return false;
	if (silent) return true;
	const oldBMarks = [];
	const oldBSCount = [];
	const oldSCount = [];
	const oldTShift = [];
	const terminatorRules = state.md.block.ruler.getRules("blockquote");
	const oldParentType = state.parentType;
	state.parentType = "blockquote";
	let lastLineEmpty = false;
	let nextLine;
	for (nextLine = startLine; nextLine < endLine; nextLine++) {
		const isOutdented = state.sCount[nextLine] < state.blkIndent;
		pos = state.bMarks[nextLine] + state.tShift[nextLine];
		max = state.eMarks[nextLine];
		if (pos >= max) break;
		if (state.src.charCodeAt(pos++) === 62 && !isOutdented) {
			let initial = state.sCount[nextLine] + 1;
			let spaceAfterMarker;
			let adjustTab;
			if (state.src.charCodeAt(pos) === 32) {
				pos++;
				initial++;
				adjustTab = false;
				spaceAfterMarker = true;
			} else if (state.src.charCodeAt(pos) === 9) {
				spaceAfterMarker = true;
				if ((state.bsCount[nextLine] + initial) % 4 === 3) {
					pos++;
					initial++;
					adjustTab = false;
				} else adjustTab = true;
			} else spaceAfterMarker = false;
			let offset = initial;
			oldBMarks.push(state.bMarks[nextLine]);
			state.bMarks[nextLine] = pos;
			while (pos < max) {
				const ch = state.src.charCodeAt(pos);
				if (isSpace(ch)) if (ch === 9) offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
				else offset++;
				else break;
				pos++;
			}
			lastLineEmpty = pos >= max;
			oldBSCount.push(state.bsCount[nextLine]);
			state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
			oldSCount.push(state.sCount[nextLine]);
			state.sCount[nextLine] = offset - initial;
			oldTShift.push(state.tShift[nextLine]);
			state.tShift[nextLine] = pos - state.bMarks[nextLine];
			continue;
		}
		if (lastLineEmpty) break;
		let terminate = false;
		for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
			terminate = true;
			break;
		}
		if (terminate) {
			state.lineMax = nextLine;
			if (state.blkIndent !== 0) {
				oldBMarks.push(state.bMarks[nextLine]);
				oldBSCount.push(state.bsCount[nextLine]);
				oldTShift.push(state.tShift[nextLine]);
				oldSCount.push(state.sCount[nextLine]);
				state.sCount[nextLine] -= state.blkIndent;
			}
			break;
		}
		oldBMarks.push(state.bMarks[nextLine]);
		oldBSCount.push(state.bsCount[nextLine]);
		oldTShift.push(state.tShift[nextLine]);
		oldSCount.push(state.sCount[nextLine]);
		state.sCount[nextLine] = -1;
	}
	const oldIndent = state.blkIndent;
	state.blkIndent = 0;
	const token_o = state.push("blockquote_open", "blockquote", 1);
	token_o.markup = ">";
	const lines = [startLine, 0];
	token_o.map = lines;
	state.md.block.tokenize(state, startLine, nextLine);
	const token_c = state.push("blockquote_close", "blockquote", -1);
	token_c.markup = ">";
	state.lineMax = oldLineMax;
	state.parentType = oldParentType;
	lines[1] = state.line;
	for (let i = 0; i < oldTShift.length; i++) {
		state.bMarks[i + startLine] = oldBMarks[i];
		state.tShift[i + startLine] = oldTShift[i];
		state.sCount[i + startLine] = oldSCount[i];
		state.bsCount[i + startLine] = oldBSCount[i];
	}
	state.blkIndent = oldIndent;
	return true;
}

//#endregion
//#region src/parser/block/rules/code.ts
function code(state, startLine, endLine) {
	if (state.sCount[startLine] - state.blkIndent < 4) return false;
	let nextLine = startLine + 1;
	let last = nextLine;
	while (nextLine < endLine) {
		if (state.isEmpty(nextLine)) {
			nextLine++;
			continue;
		}
		if (state.sCount[nextLine] - state.blkIndent >= 4) {
			nextLine++;
			last = nextLine;
			continue;
		}
		break;
	}
	state.line = last;
	const token = state.push("code_block", "code", 0);
	token.content = `${state.getLines(startLine, last, 4 + state.blkIndent, false)}\n`;
	token.map = [startLine, state.line];
	return true;
}

//#endregion
//#region src/parser/block/rules/fence.ts
function fence(state, startLine, endLine, silent) {
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	let max = state.eMarks[startLine];
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	if (pos + 3 > max) return false;
	const marker = state.src.charCodeAt(pos);
	if (marker !== 126 && marker !== 96) return false;
	let mem = pos;
	pos = state.skipChars(pos, marker);
	let len = pos - mem;
	if (len < 3) return false;
	const markup = state.src.slice(mem, pos);
	const params = state.src.slice(pos, max);
	if (marker === 96) {
		if (params.includes(String.fromCharCode(marker))) return false;
	}
	if (silent) return true;
	let nextLine = startLine;
	let haveEndMarker = false;
	for (;;) {
		nextLine++;
		if (nextLine >= endLine) break;
		pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
		max = state.eMarks[nextLine];
		if (pos < max && state.sCount[nextLine] < state.blkIndent) break;
		if (state.src.charCodeAt(pos) !== marker) continue;
		if (state.sCount[nextLine] - state.blkIndent >= 4) continue;
		pos = state.skipChars(pos, marker);
		if (pos - mem < len) continue;
		pos = state.skipSpaces(pos);
		if (pos < max) continue;
		haveEndMarker = true;
		break;
	}
	len = state.sCount[startLine];
	state.line = nextLine + (haveEndMarker ? 1 : 0);
	const token = state.push("fence", "code", 0);
	token.info = params;
	token.content = state.getLines(startLine + 1, nextLine, len, true);
	token.markup = markup;
	token.map = [startLine, state.line];
	return true;
}

//#endregion
//#region src/parser/block/rules/heading.ts
function heading(state, startLine, endLine, silent) {
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	let max = state.eMarks[startLine];
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	let ch = state.src.charCodeAt(pos);
	if (ch !== 35 || pos >= max) return false;
	let level = 1;
	ch = state.src.charCodeAt(++pos);
	while (ch === 35 && pos < max && level <= 6) {
		level++;
		ch = state.src.charCodeAt(++pos);
	}
	if (level > 6 || pos < max && !isSpace(ch)) return false;
	if (silent) return true;
	max = state.skipSpacesBack(max, pos);
	const tmp = state.skipCharsBack(max, 35, pos);
	if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) max = tmp;
	state.line = startLine + 1;
	const token_o = state.push("heading_open", `h${String(level)}`, 1);
	token_o.markup = "########".slice(0, level);
	token_o.map = [startLine, state.line];
	const token_i = state.push("inline", "", 0);
	token_i.content = state.src.slice(pos, max).trim();
	token_i.map = [startLine, state.line];
	token_i.children = [];
	const token_c = state.push("heading_close", `h${String(level)}`, -1);
	token_c.markup = "########".slice(0, level);
	return true;
}

//#endregion
//#region src/parser/block/rules/hr.ts
function hr(state, startLine, endLine, silent) {
	const max = state.eMarks[startLine];
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	const marker = state.src.charCodeAt(pos++);
	if (marker !== 42 && marker !== 45 && marker !== 95) return false;
	let cnt = 1;
	while (pos < max) {
		const ch = state.src.charCodeAt(pos++);
		if (ch !== marker && !isSpace(ch)) return false;
		if (ch === marker) cnt++;
	}
	if (cnt < 3) return false;
	if (silent) return true;
	state.line = startLine + 1;
	const token = state.push("hr", "hr", 0);
	token.map = [startLine, state.line];
	token.markup = String.fromCharCode(marker).repeat(cnt);
	return true;
}

//#endregion
//#region src/parser/utils/html_blocks.ts
var html_blocks_default = [
	"address",
	"article",
	"aside",
	"base",
	"basefont",
	"blockquote",
	"body",
	"caption",
	"center",
	"col",
	"colgroup",
	"dd",
	"details",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"frame",
	"frameset",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hr",
	"html",
	"iframe",
	"legend",
	"li",
	"link",
	"main",
	"menu",
	"menuitem",
	"nav",
	"noframes",
	"ol",
	"optgroup",
	"option",
	"p",
	"param",
	"search",
	"section",
	"summary",
	"table",
	"tbody",
	"td",
	"tfoot",
	"th",
	"thead",
	"title",
	"tr",
	"track",
	"ul"
];

//#endregion
//#region src/parser/utils/html_re.ts
const open_tag = `<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^"'=<>\`\\x00-\\x20]+|'[^']*'|"[^"]*"))?)*\\s*\\/?>`;
const close_tag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
const HTML_TAG_RE = /* @__PURE__ */ new RegExp(`^(?:${open_tag}|${close_tag}|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<\\?[\\s\\S]*?\\?>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)`);
const HTML_OPEN_CLOSE_TAG_RE = /* @__PURE__ */ new RegExp(`^(?:${open_tag}|${close_tag})`);

//#endregion
//#region src/parser/block/rules/html_block.ts
const HTML_SEQUENCES = [
	[
		/^<(script|pre|style|textarea)(?=(\s|>|$))/i,
		/<\/(script|pre|style|textarea)>/i,
		true
	],
	[
		/^<!--/,
		/-->/,
		true
	],
	[
		/^<\?/,
		/\?>/,
		true
	],
	[
		/^<![A-Z]/,
		/>/,
		true
	],
	[
		/^<!\[CDATA\[/,
		/\]\]>/,
		true
	],
	[
		new RegExp(`^</?(${html_blocks_default.join("|")})(?=(\\s|/?>|$))`, "i"),
		/^$/,
		true
	],
	[
		/* @__PURE__ */ new RegExp(`${HTML_OPEN_CLOSE_TAG_RE.source}\\s*$`),
		/^$/,
		false
	]
];
function html_block(state, startLine, endLine, silent) {
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	let max = state.eMarks[startLine];
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	if (!state.md.options.html) return false;
	if (state.src.charCodeAt(pos) !== 60) return false;
	let lineText = state.src.slice(pos, max);
	let i = 0;
	for (; i < HTML_SEQUENCES.length; i++) if (HTML_SEQUENCES[i][0].test(lineText)) break;
	if (i === HTML_SEQUENCES.length) return false;
	if (silent) return HTML_SEQUENCES[i][2];
	let nextLine = startLine + 1;
	if (!HTML_SEQUENCES[i][1].test(lineText)) for (; nextLine < endLine; nextLine++) {
		if (state.sCount[nextLine] < state.blkIndent) break;
		pos = state.bMarks[nextLine] + state.tShift[nextLine];
		max = state.eMarks[nextLine];
		lineText = state.src.slice(pos, max);
		if (HTML_SEQUENCES[i][1].test(lineText)) {
			if (lineText.length !== 0) nextLine++;
			break;
		}
	}
	state.line = nextLine;
	const token = state.push("html_block", "", 0);
	token.map = [startLine, nextLine];
	token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
	return true;
}

//#endregion
//#region src/parser/block/rules/lheading.ts
function lheading(state, startLine, endLine) {
	const terminatorRules = state.md.block.ruler.getRules("paragraph");
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	const oldParentType = state.parentType;
	state.parentType = "paragraph";
	let level = 0;
	let marker;
	let nextLine = startLine + 1;
	for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
		if (state.sCount[nextLine] - state.blkIndent > 3) continue;
		if (state.sCount[nextLine] >= state.blkIndent) {
			let pos = state.bMarks[nextLine] + state.tShift[nextLine];
			const max = state.eMarks[nextLine];
			if (pos < max) {
				marker = state.src.charCodeAt(pos);
				if (marker === 45 || marker === 61) {
					pos = state.skipChars(pos, marker);
					pos = state.skipSpaces(pos);
					if (pos >= max) {
						level = marker === 61 ? 1 : 2;
						break;
					}
				}
			}
		}
		if (state.sCount[nextLine] < 0) continue;
		let terminate = false;
		for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
			terminate = true;
			break;
		}
		if (terminate) break;
	}
	if (!level || marker === void 0) return false;
	const content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
	state.line = nextLine + 1;
	const token_o = state.push("heading_open", `h${String(level)}`, 1);
	token_o.markup = String.fromCharCode(marker);
	token_o.map = [startLine, state.line];
	const token_i = state.push("inline", "", 0);
	token_i.content = content;
	token_i.map = [startLine, state.line - 1];
	token_i.children = [];
	const token_c = state.push("heading_close", `h${String(level)}`, -1);
	token_c.markup = String.fromCharCode(marker);
	state.parentType = oldParentType;
	return true;
}

//#endregion
//#region src/parser/block/rules/list.ts
function skipBulletListMarker(state, startLine) {
	const max = state.eMarks[startLine];
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	const marker = state.src.charCodeAt(pos++);
	if (marker !== 42 && marker !== 45 && marker !== 43) return -1;
	if (pos < max) {
		if (!isSpace(state.src.charCodeAt(pos))) return -1;
	}
	return pos;
}
function skipOrderedListMarker(state, startLine) {
	const start = state.bMarks[startLine] + state.tShift[startLine];
	const max = state.eMarks[startLine];
	let pos = start;
	if (pos + 1 >= max) return -1;
	let ch = state.src.charCodeAt(pos++);
	if (ch < 48 || ch > 57) return -1;
	for (;;) {
		if (pos >= max) return -1;
		ch = state.src.charCodeAt(pos++);
		if (ch >= 48 && ch <= 57) {
			if (pos - start >= 10) return -1;
			continue;
		}
		if (ch === 41 || ch === 46) break;
		return -1;
	}
	if (pos < max) {
		ch = state.src.charCodeAt(pos);
		if (!isSpace(ch)) return -1;
	}
	return pos;
}
function markTightParagraphs(state, idx) {
	const level = state.level + 2;
	for (let i = idx + 2, l = state.tokens.length - 2; i < l; i++) if (state.tokens[i].level === level && state.tokens[i].type === "paragraph_open") {
		state.tokens[i + 2].hidden = true;
		state.tokens[i].hidden = true;
		i += 2;
	}
}
function list(state, startLine, endLine, silent) {
	let max, pos, start, token;
	let nextLine = startLine;
	let tight = true;
	if (state.sCount[nextLine] - state.blkIndent >= 4) return false;
	if (state.listIndent >= 0 && state.sCount[nextLine] - state.listIndent >= 4 && state.sCount[nextLine] < state.blkIndent) return false;
	let isTerminatingParagraph = false;
	if (silent && state.parentType === "paragraph") {
		if (state.sCount[nextLine] >= state.blkIndent) isTerminatingParagraph = true;
	}
	let isOrdered;
	let markerValue;
	let posAfterMarker = skipOrderedListMarker(state, nextLine);
	if (posAfterMarker >= 0) {
		isOrdered = true;
		start = state.bMarks[nextLine] + state.tShift[nextLine];
		markerValue = Number(state.src.slice(start, posAfterMarker - 1));
		if (isTerminatingParagraph && markerValue !== 1) return false;
	} else {
		posAfterMarker = skipBulletListMarker(state, nextLine);
		if (posAfterMarker >= 0) isOrdered = false;
		else return false;
	}
	if (isTerminatingParagraph) {
		if (state.skipSpaces(posAfterMarker) >= state.eMarks[nextLine]) return false;
	}
	if (silent) return true;
	const markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
	const listTokIdx = state.tokens.length;
	if (isOrdered) {
		token = state.push("ordered_list_open", "ol", 1);
		if (markerValue !== 1) token.attrs = [["start", markerValue.toString()]];
	} else token = state.push("bullet_list_open", "ul", 1);
	const listLines = [nextLine, 0];
	token.map = listLines;
	token.markup = String.fromCharCode(markerCharCode);
	let prevEmptyEnd = false;
	const terminatorRules = state.md.block.ruler.getRules("list");
	const oldParentType = state.parentType;
	state.parentType = "list";
	while (nextLine < endLine) {
		pos = posAfterMarker;
		max = state.eMarks[nextLine];
		const initial = state.sCount[nextLine] + posAfterMarker - (state.bMarks[nextLine] + state.tShift[nextLine]);
		let offset = initial;
		while (pos < max) {
			const ch = state.src.charCodeAt(pos);
			if (ch === 9) offset += 4 - (offset + state.bsCount[nextLine]) % 4;
			else if (ch === 32) offset++;
			else break;
			pos++;
		}
		const contentStart = pos;
		let indentAfterMarker;
		if (contentStart >= max) indentAfterMarker = 1;
		else indentAfterMarker = offset - initial;
		if (indentAfterMarker > 4) indentAfterMarker = 1;
		const indent = initial + indentAfterMarker;
		token = state.push("list_item_open", "li", 1);
		token.markup = String.fromCharCode(markerCharCode);
		const itemLines = [nextLine, 0];
		token.map = itemLines;
		if (isOrdered) token.info = state.src.slice(start, posAfterMarker - 1);
		const oldTight = state.tight;
		const oldTShift = state.tShift[nextLine];
		const oldSCount = state.sCount[nextLine];
		const oldListIndent = state.listIndent;
		state.listIndent = state.blkIndent;
		state.blkIndent = indent;
		state.tight = true;
		state.tShift[nextLine] = contentStart - state.bMarks[nextLine];
		state.sCount[nextLine] = offset;
		if (contentStart >= max && state.isEmpty(nextLine + 1)) state.line = Math.min(state.line + 2, endLine);
		else state.md.block.tokenize(state, nextLine, endLine, true);
		if (!state.tight || prevEmptyEnd) tight = false;
		prevEmptyEnd = state.line - nextLine > 1 && state.isEmpty(state.line - 1);
		state.blkIndent = state.listIndent;
		state.listIndent = oldListIndent;
		state.tShift[nextLine] = oldTShift;
		state.sCount[nextLine] = oldSCount;
		state.tight = oldTight;
		token = state.push("list_item_close", "li", -1);
		token.markup = String.fromCharCode(markerCharCode);
		nextLine = state.line;
		itemLines[1] = nextLine;
		if (nextLine >= endLine) break;
		if (state.sCount[nextLine] < state.blkIndent) break;
		if (state.sCount[nextLine] - state.blkIndent >= 4) break;
		let terminate = false;
		for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
			terminate = true;
			break;
		}
		if (terminate) break;
		if (isOrdered) {
			posAfterMarker = skipOrderedListMarker(state, nextLine);
			if (posAfterMarker < 0) break;
			start = state.bMarks[nextLine] + state.tShift[nextLine];
		} else {
			posAfterMarker = skipBulletListMarker(state, nextLine);
			if (posAfterMarker < 0) break;
		}
		if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) break;
	}
	if (isOrdered) token = state.push("ordered_list_close", "ol", -1);
	else token = state.push("bullet_list_close", "ul", -1);
	token.markup = String.fromCharCode(markerCharCode);
	listLines[1] = nextLine;
	state.line = nextLine;
	state.parentType = oldParentType;
	if (tight) markTightParagraphs(state, listTokIdx);
	return true;
}

//#endregion
//#region src/parser/block/rules/paragraph.ts
function paragraph(state, startLine, endLine) {
	const terminatorRules = state.md.block.ruler.getRules("paragraph");
	const oldParentType = state.parentType;
	let nextLine = startLine + 1;
	state.parentType = "paragraph";
	for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
		if (state.sCount[nextLine] - state.blkIndent > 3) continue;
		if (state.sCount[nextLine] < 0) continue;
		let terminate = false;
		for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
			terminate = true;
			break;
		}
		if (terminate) break;
	}
	const content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
	state.line = nextLine;
	const token_o = state.push("paragraph_open", "p", 1);
	token_o.map = [startLine, state.line];
	const token_i = state.push("inline", "", 0);
	token_i.content = content;
	token_i.map = [startLine, state.line];
	token_i.children = [];
	state.push("paragraph_close", "p", -1);
	state.parentType = oldParentType;
	return true;
}

//#endregion
//#region src/parser/block/rules/reference.ts
function reference(state, startLine, endLine, silent) {
	let pos = state.bMarks[startLine] + state.tShift[startLine];
	let max = state.eMarks[startLine];
	let nextLine = startLine + 1;
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	if (state.src.charCodeAt(pos) !== 91) return false;
	function getNextLine(nextLine$1) {
		const endLine$1 = state.lineMax;
		if (nextLine$1 >= endLine$1 || state.isEmpty(nextLine$1)) return null;
		let isContinuation = false;
		if (state.sCount[nextLine$1] - state.blkIndent > 3) isContinuation = true;
		if (state.sCount[nextLine$1] < 0) isContinuation = true;
		if (!isContinuation) {
			const terminatorRules = state.md.block.ruler.getRules("reference");
			const oldParentType = state.parentType;
			state.parentType = "reference";
			let terminate = false;
			for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine$1, endLine$1, true)) {
				terminate = true;
				break;
			}
			state.parentType = oldParentType;
			if (terminate) return null;
		}
		const pos$1 = state.bMarks[nextLine$1] + state.tShift[nextLine$1];
		const max$1 = state.eMarks[nextLine$1];
		return state.src.slice(pos$1, max$1 + 1);
	}
	let str = state.src.slice(pos, max + 1);
	max = str.length;
	let labelEnd = -1;
	for (pos = 1; pos < max; pos++) {
		const ch = str.charCodeAt(pos);
		if (ch === 91) return false;
		else if (ch === 93) {
			labelEnd = pos;
			break;
		} else if (ch === 10) {
			const lineContent = getNextLine(nextLine);
			if (lineContent !== null) {
				str += lineContent;
				max = str.length;
				nextLine++;
			}
		} else if (ch === 92) {
			pos++;
			if (pos < max && str.charCodeAt(pos) === 10) {
				const lineContent = getNextLine(nextLine);
				if (lineContent !== null) {
					str += lineContent;
					max = str.length;
					nextLine++;
				}
			}
		}
	}
	if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 58) return false;
	for (pos = labelEnd + 2; pos < max; pos++) {
		const ch = str.charCodeAt(pos);
		if (ch === 10) {
			const lineContent = getNextLine(nextLine);
			if (lineContent !== null) {
				str += lineContent;
				max = str.length;
				nextLine++;
			}
		} else if (isSpace(ch)) {} else break;
	}
	const destRes = state.md.helpers.parseLinkDestination(str, pos, max);
	if (!destRes.ok) return false;
	const href = state.md.normalizeLink(destRes.str);
	if (!state.md.validateLink(href)) return false;
	pos = destRes.pos;
	const destEndPos = pos;
	const destEndLineNo = nextLine;
	const start = pos;
	for (; pos < max; pos++) {
		const ch = str.charCodeAt(pos);
		if (ch === 10) {
			const lineContent = getNextLine(nextLine);
			if (lineContent !== null) {
				str += lineContent;
				max = str.length;
				nextLine++;
			}
		} else if (isSpace(ch)) {} else break;
	}
	let titleRes = state.md.helpers.parseLinkTitle(str, pos, max);
	while (titleRes.can_continue) {
		const lineContent = getNextLine(nextLine);
		if (lineContent === null) break;
		str += lineContent;
		pos = max;
		max = str.length;
		nextLine++;
		titleRes = state.md.helpers.parseLinkTitle(str, pos, max, titleRes);
	}
	let title;
	if (pos < max && start !== pos && titleRes.ok) {
		title = titleRes.str;
		pos = titleRes.pos;
	} else {
		title = "";
		pos = destEndPos;
		nextLine = destEndLineNo;
	}
	while (pos < max) {
		if (!isSpace(str.charCodeAt(pos))) break;
		pos++;
	}
	if (pos < max && str.charCodeAt(pos) !== 10) {
		if (title) {
			title = "";
			pos = destEndPos;
			nextLine = destEndLineNo;
			while (pos < max) {
				if (!isSpace(str.charCodeAt(pos))) break;
				pos++;
			}
		}
	}
	if (pos < max && str.charCodeAt(pos) !== 10) return false;
	const label = normalizeReference(str.slice(1, labelEnd));
	if (!label) return false;
	/* istanbul ignore if */
	if (silent) return true;
	if (typeof state.env.references === "undefined") state.env.references = {};
	if (typeof state.env.references[label] === "undefined") state.env.references[label] = {
		title,
		href
	};
	state.line = nextLine;
	const token = state.push("reference", "", 0);
	token.map = [startLine, state.line];
	token.info = label;
	token.meta = {
		title,
		href
	};
	return true;
}

//#endregion
//#region src/parser/block/rules/table.ts
const MAX_AUTOCOMPLETED_CELLS = 65536;
function getLine(state, line) {
	const pos = state.bMarks[line] + state.tShift[line];
	const max = state.eMarks[line];
	return state.src.slice(pos, max);
}
function escapedSplit(str) {
	const result = [];
	const max = str.length;
	let pos = 0;
	let ch = str.charCodeAt(pos);
	let isEscaped = false;
	let lastPos = 0;
	let current = "";
	while (pos < max) {
		if (ch === 124) if (!isEscaped) {
			result.push(current + str.substring(lastPos, pos));
			current = "";
			lastPos = pos + 1;
		} else {
			current += str.substring(lastPos, pos - 1);
			lastPos = pos;
		}
		isEscaped = ch === 92;
		pos++;
		ch = str.charCodeAt(pos);
	}
	result.push(current + str.substring(lastPos));
	return result;
}
function table(state, startLine, endLine, silent) {
	if (startLine + 2 > endLine) return false;
	let nextLine = startLine + 1;
	if (state.sCount[nextLine] < state.blkIndent) return false;
	if (state.sCount[nextLine] - state.blkIndent >= 4) return false;
	let pos = state.bMarks[nextLine] + state.tShift[nextLine];
	if (pos >= state.eMarks[nextLine]) return false;
	const firstCh = state.src.charCodeAt(pos++);
	if (firstCh !== 124 && firstCh !== 45 && firstCh !== 58) return false;
	if (pos >= state.eMarks[nextLine]) return false;
	const secondCh = state.src.charCodeAt(pos++);
	if (secondCh !== 124 && secondCh !== 45 && secondCh !== 58 && !isSpace(secondCh)) return false;
	if (firstCh === 45 && isSpace(secondCh)) return false;
	while (pos < state.eMarks[nextLine]) {
		const ch = state.src.charCodeAt(pos);
		if (ch !== 124 && ch !== 45 && ch !== 58 && !isSpace(ch)) return false;
		pos++;
	}
	let lineText = getLine(state, startLine + 1);
	let columns = lineText.split("|");
	const aligns = [];
	for (let i = 0; i < columns.length; i++) {
		const t = columns[i].trim();
		if (!t) if (i === 0 || i === columns.length - 1) continue;
		else return false;
		if (!/^:?-+:?$/.test(t)) return false;
		if (t.charCodeAt(t.length - 1) === 58) aligns.push(t.charCodeAt(0) === 58 ? "center" : "right");
		else if (t.charCodeAt(0) === 58) aligns.push("left");
		else aligns.push("");
	}
	lineText = getLine(state, startLine).trim();
	if (!lineText.includes("|")) return false;
	if (state.sCount[startLine] - state.blkIndent >= 4) return false;
	columns = escapedSplit(lineText);
	if (columns.length && columns[0] === "") columns.shift();
	if (columns.length && columns[columns.length - 1] === "") columns.pop();
	const columnCount = columns.length;
	if (columnCount === 0 || columnCount !== aligns.length) return false;
	if (silent) return true;
	const oldParentType = state.parentType;
	state.parentType = "table";
	const terminatorRules = state.md.block.ruler.getRules("blockquote");
	const token_to = state.push("table_open", "table", 1);
	const tableLines = [startLine, 0];
	token_to.map = tableLines;
	const token_tho = state.push("thead_open", "thead", 1);
	token_tho.map = [startLine, startLine + 1];
	const token_htro = state.push("tr_open", "tr", 1);
	token_htro.map = [startLine, startLine + 1];
	for (let i = 0; i < columns.length; i++) {
		const token_ho = state.push("th_open", "th", 1);
		if (aligns[i]) token_ho.attrs = [["style", `text-align:${aligns[i]}`]];
		const token_il = state.push("inline", "", 0);
		token_il.content = columns[i].trim();
		token_il.children = [];
		state.push("th_close", "th", -1);
	}
	state.push("tr_close", "tr", -1);
	state.push("thead_close", "thead", -1);
	let tbodyLines;
	let autocompletedCells = 0;
	for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
		if (state.sCount[nextLine] < state.blkIndent) break;
		let terminate = false;
		for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
			terminate = true;
			break;
		}
		if (terminate) break;
		lineText = getLine(state, nextLine).trim();
		if (!lineText) break;
		if (state.sCount[nextLine] - state.blkIndent >= 4) break;
		columns = escapedSplit(lineText);
		if (columns.length && columns[0] === "") columns.shift();
		if (columns.length && columns[columns.length - 1] === "") columns.pop();
		autocompletedCells += columnCount - columns.length;
		if (autocompletedCells > MAX_AUTOCOMPLETED_CELLS) break;
		if (nextLine === startLine + 2) {
			const token_tbo = state.push("tbody_open", "tbody", 1);
			token_tbo.map = tbodyLines = [startLine + 2, 0];
		}
		const token_tro = state.push("tr_open", "tr", 1);
		token_tro.map = [nextLine, nextLine + 1];
		for (let i = 0; i < columnCount; i++) {
			const token_tdo = state.push("td_open", "td", 1);
			if (aligns[i]) token_tdo.attrs = [["style", `text-align:${aligns[i]}`]];
			const token_il = state.push("inline", "", 0);
			token_il.content = columns[i] ? columns[i].trim() : "";
			token_il.children = [];
			state.push("td_close", "td", -1);
		}
		state.push("tr_close", "tr", -1);
	}
	if (tbodyLines) {
		state.push("tbody_close", "tbody", -1);
		tbodyLines[1] = nextLine;
	}
	state.push("table_close", "table", -1);
	tableLines[1] = nextLine;
	state.parentType = oldParentType;
	state.line = nextLine;
	return true;
}

//#endregion
//#region src/parser/block/parser_block.ts
const _rules$2 = [
	[
		"table",
		table,
		["paragraph", "reference"]
	],
	["code", code],
	[
		"fence",
		fence,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"blockquote",
		blockquote,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"hr",
		hr,
		[
			"paragraph",
			"reference",
			"blockquote",
			"list"
		]
	],
	[
		"list",
		list,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["reference", reference],
	[
		"html_block",
		html_block,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	[
		"heading",
		heading,
		[
			"paragraph",
			"reference",
			"blockquote"
		]
	],
	["lheading", lheading],
	["paragraph", paragraph]
];
var ParserBlock = class {
	/**
	* {@link Ruler} instance. Keep configuration of block rules.
	*/
	ruler;
	constructor() {
		this.ruler = new Ruler();
		for (let i = 0; i < _rules$2.length; i++) this.ruler.push(_rules$2[i][0], _rules$2[i][1], { alt: (_rules$2[i][2] || []).slice() });
	}
	/**
	* Generate tokens for input range
	*/
	tokenize(state, startLine, endLine, silent) {
		const rules = this.ruler.getRules("");
		const len = rules.length;
		const maxNesting = state.md.options.maxNesting;
		let line = startLine;
		let hasEmptyLines = false;
		while (line < endLine) {
			state.line = line = state.skipEmptyLines(line);
			if (line >= endLine) break;
			if (state.sCount[line] < state.blkIndent) break;
			if (state.level >= maxNesting) {
				state.line = endLine;
				break;
			}
			const prevLine = state.line;
			let ok = false;
			for (let i = 0; i < len; i++) {
				ok = rules[i](state, line, endLine, false);
				if (ok) {
					if (prevLine >= state.line) throw new Error("block rule didn't increment state.line");
					break;
				}
			}
			if (!ok) throw new Error("none of the block rules matched");
			state.tight = !hasEmptyLines;
			if (state.isEmpty(state.line - 1)) hasEmptyLines = true;
			line = state.line;
			if (line < endLine && state.isEmpty(line)) {
				hasEmptyLines = true;
				line++;
				state.line = line;
			}
		}
	}
	/**
	* Process input string and push block tokens into `outTokens`
	*/
	parse(src, md, env, outTokens) {
		if (!src) return;
		const state = new this.State(src, md, env, outTokens);
		this.tokenize(state, state.line, state.lineMax);
	}
	State = StateBlock;
};

//#endregion
//#region src/parser/core/rules/block.ts
function block(state) {
	let token;
	if (state.inlineMode) {
		token = new state.Token("inline", "", 0);
		token.content = state.src;
		token.map = [0, 1];
		token.children = [];
		state.tokens.push(token);
	} else state.md.block.parse(state.src, state.md, state.env, state.tokens);
}

//#endregion
//#region src/parser/core/rules/inline.ts
function inline(state) {
	const tokens = state.tokens;
	for (let i = 0, l = tokens.length; i < l; i++) {
		const tok = tokens[i];
		if (tok.type === "inline") state.md.inline.parse(tok.content, state.md, state.env, tok.children);
	}
}

//#endregion
//#region src/parser/core/rules/linkify.ts
function isLinkOpen$1(str) {
	return /^<a[>\s]/i.test(str);
}
function isLinkClose$1(str) {
	return /^<\/a\s*>/i.test(str);
}
function linkify$1(state) {
	if (!state.md.options.linkify) return;
	const blockTokens = state.tokens;
	const linkify$2 = state.md.linkify;
	for (let j = 0, l = blockTokens.length; j < l; j++) {
		if (blockTokens[j].type !== "inline" || !linkify$2.pretest(blockTokens[j].content)) continue;
		const tokens = blockTokens[j].children;
		let htmlLinkLevel = 0;
		for (let i = tokens.length - 1; i >= 0; i--) {
			const currentToken = tokens[i];
			if (currentToken.type === "link_close") {
				i--;
				while (tokens[i].level !== currentToken.level && tokens[i].type !== "link_open") i--;
				continue;
			}
			if (currentToken.type === "html_inline") {
				if (isLinkOpen$1(currentToken.content) && htmlLinkLevel > 0) htmlLinkLevel--;
				if (isLinkClose$1(currentToken.content)) htmlLinkLevel++;
			}
			if (htmlLinkLevel > 0) continue;
			if (currentToken.type === "text") {
				const text$1 = currentToken.content;
				if (!linkify$2.pretest(text$1)) continue;
				const links = linkify$2.match(text$1);
				if (!links?.length) continue;
				const nodes = [];
				let level = currentToken.level;
				let lastPos = 0;
				const startFrom = links[0].index === 0 && i > 0 && tokens[i - 1].type === "text_special" ? 1 : 0;
				for (let ln = startFrom; ln < links.length; ln++) {
					const link$1 = links[ln];
					const fullUrl = state.md.normalizeLink(link$1.url);
					if (!state.md.validateLink(fullUrl)) continue;
					let urlText = link$1.text;
					if (!link$1.schema) urlText = state.md.normalizeLinkText(`http://${urlText}`).replace(/^http:\/\//, "");
					else if (link$1.schema === "mailto:" && !/^mailto:/i.test(urlText)) urlText = state.md.normalizeLinkText(`mailto:${urlText}`).replace(/^mailto:/, "");
					else urlText = state.md.normalizeLinkText(urlText);
					const pos = link$1.index;
					if (pos > lastPos) {
						const token = new state.Token("text", "", 0);
						token.content = text$1.slice(lastPos, pos);
						token.level = level;
						nodes.push(token);
					}
					const token_o = new state.Token("link_open", "a", 1);
					token_o.attrs = [["href", fullUrl]];
					token_o.level = level++;
					token_o.markup = "linkify";
					token_o.info = "auto";
					nodes.push(token_o);
					const token_t = new state.Token("text", "", 0);
					token_t.content = urlText;
					token_t.level = level;
					nodes.push(token_t);
					const token_c = new state.Token("link_close", "a", -1);
					token_c.level = --level;
					token_c.markup = "linkify";
					token_c.info = "auto";
					nodes.push(token_c);
					lastPos = link$1.lastIndex;
				}
				if (lastPos < text$1.length) {
					const token = new state.Token("text", "", 0);
					token.content = text$1.slice(lastPos);
					token.level = level;
					nodes.push(token);
				}
				tokens.splice(i, 1, ...nodes);
			}
		}
	}
}

//#endregion
//#region src/parser/core/rules/normalize.ts
const NEWLINES_RE = /\r\n?|\n/g;
const NULL_RE = /\0/g;
function normalize(state) {
	let str = state.src;
	const hasCR = str.includes("\r");
	const hasNull = str.includes("\0");
	if (!hasCR && !hasNull) return;
	if (hasCR) str = str.replace(NEWLINES_RE, "\n");
	if (hasNull) str = str.replace(NULL_RE, "�");
	state.src = str;
}

//#endregion
//#region src/parser/core/rules/replacements.ts
const RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
const SCOPED_ABBR_TEST_RE = /\((?:c|tm|r)\)/i;
const SCOPED_ABBR_RE = /\((c|tm|r)\)/gi;
const SCOPED_ABBR = {
	c: "©",
	r: "®",
	tm: "™"
};
function replaceFn(match, name) {
	return SCOPED_ABBR[name.toLowerCase()];
}
function replace_scoped(inlineTokens) {
	let inside_autolink = 0;
	for (let i = inlineTokens.length - 1; i >= 0; i--) {
		const token = inlineTokens[i];
		if (token.type === "text" && !inside_autolink) token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
		if (token.type === "link_open" && token.info === "auto") inside_autolink--;
		if (token.type === "link_close" && token.info === "auto") inside_autolink++;
	}
}
function replace_rare(inlineTokens) {
	let inside_autolink = 0;
	for (let i = inlineTokens.length - 1; i >= 0; i--) {
		const token = inlineTokens[i];
		if (token.type === "text" && !inside_autolink) {
			if (RARE_RE.test(token.content)) token.content = token.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–");
		}
		if (token.type === "link_open" && token.info === "auto") inside_autolink--;
		if (token.type === "link_close" && token.info === "auto") inside_autolink++;
	}
}
function replace(state) {
	let blkIdx;
	if (!state.md.options.typographer) return;
	for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
		if (state.tokens[blkIdx].type !== "inline") continue;
		if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) replace_scoped(state.tokens[blkIdx].children);
		if (RARE_RE.test(state.tokens[blkIdx].content)) replace_rare(state.tokens[blkIdx].children);
	}
}

//#endregion
//#region src/parser/core/rules/smartquotes.ts
const QUOTE_TEST_RE = /['"]/;
const QUOTE_RE = /['"]/g;
const APOSTROPHE = "’";
function replaceAt(str, index, ch) {
	return str.slice(0, index) + ch + str.slice(index + 1);
}
function process_inlines(tokens, state) {
	let j;
	const stack = [];
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const thisLevel = tokens[i].level;
		for (j = stack.length - 1; j >= 0; j--) if (stack[j].level <= thisLevel) break;
		stack.length = j + 1;
		if (token.type !== "text") continue;
		let text$1 = token.content;
		let pos = 0;
		let max = text$1.length;
		OUTER: while (pos < max) {
			QUOTE_RE.lastIndex = pos;
			const t = QUOTE_RE.exec(text$1);
			if (!t) break;
			let canOpen = true;
			let canClose = true;
			pos = t.index + 1;
			const isSingle = t[0] === "'";
			let lastChar = 32;
			if (t.index - 1 >= 0) lastChar = text$1.charCodeAt(t.index - 1);
			else for (j = i - 1; j >= 0; j--) {
				if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
				if (!tokens[j].content) continue;
				lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
				break;
			}
			let nextChar = 32;
			if (pos < max) nextChar = text$1.charCodeAt(pos);
			else for (j = i + 1; j < tokens.length; j++) {
				if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
				if (!tokens[j].content) continue;
				nextChar = tokens[j].content.charCodeAt(0);
				break;
			}
			const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
			const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
			const isLastWhiteSpace = isWhiteSpace(lastChar);
			const isNextWhiteSpace = isWhiteSpace(nextChar);
			if (isNextWhiteSpace) canOpen = false;
			else if (isNextPunctChar) {
				if (!(isLastWhiteSpace || isLastPunctChar)) canOpen = false;
			}
			if (isLastWhiteSpace) canClose = false;
			else if (isLastPunctChar) {
				if (!(isNextWhiteSpace || isNextPunctChar)) canClose = false;
			}
			if (nextChar === 34 && t[0] === "\"") {
				if (lastChar >= 48 && lastChar <= 57) canClose = canOpen = false;
			}
			if (canOpen && canClose) {
				canOpen = isLastPunctChar;
				canClose = isNextPunctChar;
			}
			if (!canOpen && !canClose) {
				if (isSingle) token.content = replaceAt(token.content, t.index, APOSTROPHE);
				continue;
			}
			if (canClose) for (j = stack.length - 1; j >= 0; j--) {
				let item = stack[j];
				if (stack[j].level < thisLevel) break;
				if (item.single === isSingle && stack[j].level === thisLevel) {
					item = stack[j];
					let openQuote;
					let closeQuote;
					if (isSingle) {
						openQuote = state.md.options.quotes[2];
						closeQuote = state.md.options.quotes[3];
					} else {
						openQuote = state.md.options.quotes[0];
						closeQuote = state.md.options.quotes[1];
					}
					token.content = replaceAt(token.content, t.index, closeQuote);
					tokens[item.token].content = replaceAt(tokens[item.token].content, item.pos, openQuote);
					pos += closeQuote.length - 1;
					if (item.token === i) pos += openQuote.length - 1;
					text$1 = token.content;
					max = text$1.length;
					stack.length = j;
					continue OUTER;
				}
			}
			if (canOpen) stack.push({
				token: i,
				pos: t.index,
				single: isSingle,
				level: thisLevel
			});
			else if (canClose && isSingle) token.content = replaceAt(token.content, t.index, APOSTROPHE);
		}
	}
}
function smartquotes(state) {
	if (!state.md.options.typographer) return;
	for (let blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
		if (state.tokens[blkIdx].type !== "inline" || !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) continue;
		process_inlines(state.tokens[blkIdx].children, state);
	}
}

//#endregion
//#region src/parser/core/rules/text_join.ts
function text_join(state) {
	let curr, last;
	const blockTokens = state.tokens;
	const l = blockTokens.length;
	for (let j = 0; j < l; j++) {
		if (blockTokens[j].type !== "inline") continue;
		const tokens = blockTokens[j].children;
		const max = tokens.length;
		for (curr = 0; curr < max; curr++) if (tokens[curr].type === "text_special") tokens[curr].type = "text";
		for (curr = last = 0; curr < max; curr++) if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
		else {
			if (curr !== last) tokens[last] = tokens[curr];
			last++;
		}
		if (curr !== last) tokens.length = last;
	}
}

//#endregion
//#region src/parser/core/parser_core.ts
const _rules$1 = [
	["normalize", normalize],
	["block", block],
	["inline", inline],
	["linkify", linkify$1],
	["replacements", replace],
	["smartquotes", smartquotes],
	["text_join", text_join]
];
var Core = class {
	/**
	* {@link Ruler} instance. Keep configuration of core rules.
	*/
	ruler;
	constructor() {
		this.ruler = new Ruler();
		for (let i = 0; i < _rules$1.length; i++) this.ruler.push(_rules$1[i][0], _rules$1[i][1]);
	}
	/**
	* Executes core chain rules.
	*/
	process(state) {
		const rules = this.ruler.getRules("");
		for (let i = 0, l = rules.length; i < l; i++) rules[i](state);
	}
	State = StateCore;
};

//#endregion
//#region src/parser/helpers/parse_link_destination.ts
function parseLinkDestination(str, start, max) {
	let code$1;
	let pos = start;
	const result = {
		ok: false,
		pos: 0,
		str: ""
	};
	if (str.charCodeAt(pos) === 60) {
		pos++;
		while (pos < max) {
			code$1 = str.charCodeAt(pos);
			if (code$1 === 10) return result;
			if (code$1 === 60) return result;
			if (code$1 === 62) {
				result.pos = pos + 1;
				result.str = unescapeAll(str.slice(start + 1, pos));
				result.ok = true;
				return result;
			}
			if (code$1 === 92 && pos + 1 < max) {
				pos += 2;
				continue;
			}
			pos++;
		}
		return result;
	}
	let level = 0;
	while (pos < max) {
		code$1 = str.charCodeAt(pos);
		if (code$1 === 32) break;
		if (code$1 < 32 || code$1 === 127) break;
		if (code$1 === 92 && pos + 1 < max) {
			if (str.charCodeAt(pos + 1) === 32) break;
			pos += 2;
			continue;
		}
		if (code$1 === 40) {
			level++;
			if (level > 32) return result;
		}
		if (code$1 === 41) {
			if (level === 0) break;
			level--;
		}
		pos++;
	}
	if (start === pos) return result;
	if (level !== 0) return result;
	result.str = unescapeAll(str.slice(start, pos));
	result.pos = pos;
	result.ok = true;
	return result;
}

//#endregion
//#region src/parser/helpers/parse_link_label.ts
function parseLinkLabel(state, start, disableNested = false) {
	let level;
	let found = false;
	let marker;
	let prevPos;
	const max = state.posMax;
	const oldPos = state.pos;
	state.pos = start + 1;
	level = 1;
	while (state.pos < max) {
		marker = state.src.charCodeAt(state.pos);
		if (marker === 93) {
			level--;
			if (level === 0) {
				found = true;
				break;
			}
		}
		prevPos = state.pos;
		state.md.inline.skipToken(state);
		if (marker === 91) {
			if (prevPos === state.pos - 1) level++;
			else if (disableNested) {
				state.pos = oldPos;
				return -1;
			}
		}
	}
	let labelEnd = -1;
	if (found) labelEnd = state.pos;
	state.pos = oldPos;
	return labelEnd;
}

//#endregion
//#region src/parser/helpers/parse_link_title.ts
function parseLinkTitle(str, start, max, prev_state) {
	let code$1;
	let pos = start;
	const state = {
		ok: false,
		can_continue: false,
		pos: 0,
		str: "",
		marker: 0
	};
	if (prev_state) {
		state.str = prev_state.str;
		state.marker = prev_state.marker;
	} else {
		if (pos >= max) return state;
		let marker = str.charCodeAt(pos);
		if (marker !== 34 && marker !== 39 && marker !== 40) return state;
		start++;
		pos++;
		if (marker === 40) marker = 41;
		state.marker = marker;
	}
	while (pos < max) {
		code$1 = str.charCodeAt(pos);
		if (code$1 === state.marker) {
			state.pos = pos + 1;
			state.str += unescapeAll(str.slice(start, pos));
			state.ok = true;
			return state;
		} else if (code$1 === 40 && state.marker === 41) return state;
		else if (code$1 === 92 && pos + 1 < max) pos++;
		pos++;
	}
	state.can_continue = true;
	state.str += unescapeAll(str.slice(start, pos));
	return state;
}

//#endregion
//#region src/parser/helpers/index.ts
const helpers = {
	parseLinkDestination,
	parseLinkLabel,
	parseLinkTitle
};

//#endregion
//#region src/parser/inline/rules/autolink.ts
const EMAIL_RE = /^([\w.!#$%&'*+/=?^`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*)$/i;
const AUTOLINK_RE = /^([a-z][a-z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/i;
function autolink(state, silent) {
	let pos = state.pos;
	if (state.src.charCodeAt(pos) !== 60) return false;
	const start = state.pos;
	const max = state.posMax;
	for (;;) {
		if (++pos >= max) return false;
		const ch = state.src.charCodeAt(pos);
		if (ch === 60) return false;
		if (ch === 62) break;
	}
	const url = state.src.slice(start + 1, pos);
	if (AUTOLINK_RE.test(url)) {
		const fullUrl = state.md.normalizeLink(url);
		if (!state.md.validateLink(fullUrl)) return false;
		if (!silent) {
			const token_o = state.push("link_open", "a", 1);
			token_o.attrs = [["href", fullUrl]];
			token_o.markup = "autolink";
			token_o.info = "auto";
			const token_t = state.push("text", "", 0);
			token_t.content = state.md.normalizeLinkText(url);
			const token_c = state.push("link_close", "a", -1);
			token_c.markup = "autolink";
			token_c.info = "auto";
		}
		state.pos += url.length + 2;
		return true;
	}
	if (EMAIL_RE.test(url)) {
		const fullUrl = state.md.normalizeLink(`mailto:${url}`);
		if (!state.md.validateLink(fullUrl)) return false;
		if (!silent) {
			const token_o = state.push("link_open", "a", 1);
			token_o.attrs = [["href", fullUrl]];
			token_o.markup = "autolink";
			token_o.info = "auto";
			const token_t = state.push("text", "", 0);
			token_t.content = state.md.normalizeLinkText(url);
			const token_c = state.push("link_close", "a", -1);
			token_c.markup = "autolink";
			token_c.info = "auto";
		}
		state.pos += url.length + 2;
		return true;
	}
	return false;
}

//#endregion
//#region src/parser/inline/rules/backticks.ts
function backtick(state, silent) {
	let pos = state.pos;
	const src = state.src;
	if (src.charCodeAt(pos) !== 96) return false;
	const start = pos;
	pos++;
	const max = state.posMax;
	while (pos < max && src.charCodeAt(pos) === 96) pos++;
	const marker = src.slice(start, pos);
	const openerLength = marker.length;
	if (state.backticksScanned && (state.backticks[openerLength] || 0) <= start) {
		if (!silent) state.pending += marker;
		state.pos += openerLength;
		return true;
	}
	let matchEnd = pos;
	let matchStart;
	while (true) {
		matchStart = src.indexOf("`", matchEnd);
		if (matchStart === -1) break;
		matchEnd = matchStart + 1;
		while (matchEnd < max && src.charCodeAt(matchEnd) === 96) matchEnd++;
		const closerLength = matchEnd - matchStart;
		if (closerLength === openerLength) {
			if (!silent) {
				const token = state.push("code_inline", "code", 0);
				token.markup = marker;
				token.content = src.slice(pos, matchStart).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
			}
			state.pos = matchEnd;
			return true;
		}
		state.backticks[closerLength] = matchStart;
	}
	state.backticksScanned = true;
	if (!silent) state.pending += marker;
	state.pos += openerLength;
	return true;
}

//#endregion
//#region src/parser/inline/rules/balance_pairs.ts
function processDelimiters(delimiters) {
	const openersBottom = {};
	const max = delimiters.length;
	if (!max) return;
	let headerIdx = 0;
	let lastTokenIdx = -2;
	const jumps = [];
	for (let closerIdx = 0; closerIdx < max; closerIdx++) {
		const closer = delimiters[closerIdx];
		jumps.push(0);
		if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) headerIdx = closerIdx;
		lastTokenIdx = closer.token;
		closer.length = closer.length || 0;
		if (!closer.close) continue;
		if (!openersBottom.hasOwnProperty(closer.marker)) openersBottom[closer.marker] = [
			-1,
			-1,
			-1,
			-1,
			-1,
			-1
		];
		const minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + closer.length % 3];
		let openerIdx = headerIdx - jumps[headerIdx] - 1;
		let newMinOpenerIdx = openerIdx;
		for (; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1) {
			const opener = delimiters[openerIdx];
			if (opener.marker !== closer.marker) continue;
			if (opener.open && opener.end < 0) {
				let isOddMatch = false;
				if (opener.close || closer.open) {
					if ((opener.length + closer.length) % 3 === 0) {
						if (opener.length % 3 !== 0 || closer.length % 3 !== 0) isOddMatch = true;
					}
				}
				if (!isOddMatch) {
					const lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? jumps[openerIdx - 1] + 1 : 0;
					jumps[closerIdx] = closerIdx - openerIdx + lastJump;
					jumps[openerIdx] = lastJump;
					closer.open = false;
					opener.end = closerIdx;
					opener.close = false;
					newMinOpenerIdx = -1;
					lastTokenIdx = -2;
					break;
				}
			}
		}
		if (newMinOpenerIdx !== -1) openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length || 0) % 3] = newMinOpenerIdx;
	}
}
function link_pairs(state) {
	const tokens_meta = state.tokens_meta;
	const max = state.tokens_meta.length;
	processDelimiters(state.delimiters);
	for (let curr = 0; curr < max; curr++) {
		const delimiters = tokens_meta[curr]?.delimiters;
		if (delimiters) processDelimiters(delimiters);
	}
}

//#endregion
//#region src/parser/inline/rules/emphasis.ts
function emphasis_tokenize(state, silent) {
	const start = state.pos;
	const marker = state.src.charCodeAt(start);
	if (silent) return false;
	if (marker !== 95 && marker !== 42) return false;
	const scanned = state.scanDelims(state.pos, marker === 42);
	for (let i = 0; i < scanned.length; i++) {
		const token = state.push("text", "", 0);
		token.content = String.fromCharCode(marker);
		state.delimiters.push({
			marker,
			length: scanned.length,
			token: state.tokens.length - 1,
			end: -1,
			open: scanned.can_open,
			close: scanned.can_close
		});
	}
	state.pos += scanned.length;
	return true;
}
function postProcess$1(state, delimiters) {
	const max = delimiters.length;
	for (let i = max - 1; i >= 0; i--) {
		const startDelim = delimiters[i];
		if (startDelim.marker !== 95 && startDelim.marker !== 42) continue;
		if (startDelim.end === -1) continue;
		const endDelim = delimiters[startDelim.end];
		const isStrong = i > 0 && delimiters[i - 1].end === startDelim.end + 1 && delimiters[i - 1].marker === startDelim.marker && delimiters[i - 1].token === startDelim.token - 1 && delimiters[startDelim.end + 1].token === endDelim.token + 1;
		const ch = String.fromCharCode(startDelim.marker);
		const token_o = state.tokens[startDelim.token];
		token_o.type = isStrong ? "strong_open" : "em_open";
		token_o.tag = isStrong ? "strong" : "em";
		token_o.nesting = 1;
		token_o.markup = isStrong ? ch + ch : ch;
		token_o.content = "";
		const token_c = state.tokens[endDelim.token];
		token_c.type = isStrong ? "strong_close" : "em_close";
		token_c.tag = isStrong ? "strong" : "em";
		token_c.nesting = -1;
		token_c.markup = isStrong ? ch + ch : ch;
		token_c.content = "";
		if (isStrong) {
			state.tokens[delimiters[i - 1].token].content = "";
			state.tokens[delimiters[startDelim.end + 1].token].content = "";
			i--;
		}
	}
}
function emphasis_post_process(state) {
	const tokens_meta = state.tokens_meta;
	const max = state.tokens_meta.length;
	postProcess$1(state, state.delimiters);
	for (let curr = 0; curr < max; curr++) {
		const delimiters = tokens_meta[curr]?.delimiters;
		if (delimiters) postProcess$1(state, delimiters);
	}
}
var emphasis_default = {
	tokenize: emphasis_tokenize,
	postProcess: emphasis_post_process
};

//#endregion
//#region src/parser/inline/rules/entity.ts
const DIGITAL_RE = /^&#(x[a-f0-9]{1,6}|\d{1,7});/i;
const NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
function entity(state, silent) {
	const pos = state.pos;
	const max = state.posMax;
	if (state.src.charCodeAt(pos) !== 38) return false;
	if (pos + 1 >= max) return false;
	if (state.src.charCodeAt(pos + 1) === 35) {
		const match = state.src.slice(pos).match(DIGITAL_RE);
		if (match) {
			if (!silent) {
				const code$1 = match[1][0].toLowerCase() === "x" ? Number.parseInt(match[1].slice(1), 16) : Number.parseInt(match[1], 10);
				const token = state.push("text_special", "", 0);
				token.content = isValidEntityCode(code$1) ? fromCodePoint(code$1) : fromCodePoint(65533);
				token.markup = match[0];
				token.info = "entity";
			}
			state.pos += match[0].length;
			return true;
		}
	} else {
		const match = state.src.slice(pos).match(NAMED_RE);
		if (match) {
			const decoded = decodeHTML(match[0]);
			if (decoded !== match[0]) {
				if (!silent) {
					const token = state.push("text_special", "", 0);
					token.content = decoded;
					token.markup = match[0];
					token.info = "entity";
				}
				state.pos += match[0].length;
				return true;
			}
		}
	}
	return false;
}

//#endregion
//#region src/parser/inline/rules/escape.ts
const ESCAPED = [];
for (let i = 0; i < 256; i++) ESCAPED.push(0);
for (const ch of "\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("")) ESCAPED[ch.charCodeAt(0)] = 1;
function escape(state, silent) {
	let pos = state.pos;
	const max = state.posMax;
	if (state.src.charCodeAt(pos) !== 92) return false;
	pos++;
	if (pos >= max) return false;
	let ch1 = state.src.charCodeAt(pos);
	if (ch1 === 10) {
		if (!silent) state.push("hardbreak", "br", 0);
		pos++;
		while (pos < max) {
			ch1 = state.src.charCodeAt(pos);
			if (!isSpace(ch1)) break;
			pos++;
		}
		state.pos = pos;
		return true;
	}
	let escapedStr = state.src[pos];
	if (ch1 >= 55296 && ch1 <= 56319 && pos + 1 < max) {
		const ch2 = state.src.charCodeAt(pos + 1);
		if (ch2 >= 56320 && ch2 <= 57343) {
			escapedStr += state.src[pos + 1];
			pos++;
		}
	}
	const origStr = `\\${escapedStr}`;
	if (!silent) {
		const token = state.push("text_special", "", 0);
		if (ch1 < 256 && ESCAPED[ch1] !== 0) token.content = escapedStr;
		else token.content = origStr;
		token.markup = origStr;
		token.info = "escape";
	}
	state.pos = pos + 1;
	return true;
}

//#endregion
//#region src/parser/inline/rules/fragments_join.ts
function fragments_join(state) {
	let curr, last;
	let level = 0;
	const tokens = state.tokens;
	const max = state.tokens.length;
	for (curr = last = 0; curr < max; curr++) {
		if (tokens[curr].nesting < 0) level--;
		tokens[curr].level = level;
		if (tokens[curr].nesting > 0) level++;
		if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
		else {
			if (curr !== last) tokens[last] = tokens[curr];
			last++;
		}
	}
	if (curr !== last) tokens.length = last;
}

//#endregion
//#region src/parser/inline/rules/html_inline.ts
function isLinkOpen(str) {
	return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
	return /^<\/a\s*>/i.test(str);
}
function isLetter(ch) {
	const lc = ch | 32;
	return lc >= 97 && lc <= 122;
}
function html_inline(state, silent) {
	if (!state.md.options.html) return false;
	const max = state.posMax;
	const pos = state.pos;
	if (state.src.charCodeAt(pos) !== 60 || pos + 2 >= max) return false;
	const ch = state.src.charCodeAt(pos + 1);
	if (ch !== 33 && ch !== 63 && ch !== 47 && !isLetter(ch)) return false;
	const match = state.src.slice(pos).match(HTML_TAG_RE);
	if (!match) return false;
	if (!silent) {
		const token = state.push("html_inline", "", 0);
		token.content = match[0];
		if (isLinkOpen(token.content)) state.linkLevel++;
		if (isLinkClose(token.content)) state.linkLevel--;
	}
	state.pos += match[0].length;
	return true;
}

//#endregion
//#region src/parser/inline/rules/image.ts
function image(state, silent) {
	let code$1, content, label, pos, ref, res, title, start;
	let href = "";
	const oldPos = state.pos;
	const max = state.posMax;
	if (state.src.charCodeAt(state.pos) !== 33) return false;
	if (state.src.charCodeAt(state.pos + 1) !== 91) return false;
	const labelStart = state.pos + 2;
	const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);
	if (labelEnd < 0) return false;
	pos = labelEnd + 1;
	if (pos < max && state.src.charCodeAt(pos) === 40) {
		pos++;
		for (; pos < max; pos++) {
			code$1 = state.src.charCodeAt(pos);
			if (!isSpace(code$1) && code$1 !== 10) break;
		}
		if (pos >= max) return false;
		start = pos;
		res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
		if (res.ok) {
			href = state.md.normalizeLink(res.str);
			if (state.md.validateLink(href)) pos = res.pos;
			else href = "";
		}
		start = pos;
		for (; pos < max; pos++) {
			code$1 = state.src.charCodeAt(pos);
			if (!isSpace(code$1) && code$1 !== 10) break;
		}
		res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
		if (pos < max && start !== pos && res.ok) {
			title = res.str;
			pos = res.pos;
			for (; pos < max; pos++) {
				code$1 = state.src.charCodeAt(pos);
				if (!isSpace(code$1) && code$1 !== 10) break;
			}
		} else title = "";
		if (pos >= max || state.src.charCodeAt(pos) !== 41) {
			state.pos = oldPos;
			return false;
		}
		pos++;
	} else {
		if (typeof state.env.references === "undefined") return false;
		if (pos < max && state.src.charCodeAt(pos) === 91) {
			start = pos + 1;
			pos = state.md.helpers.parseLinkLabel(state, pos);
			if (pos >= 0) label = state.src.slice(start, pos++);
			else pos = labelEnd + 1;
		} else pos = labelEnd + 1;
		if (!label) label = state.src.slice(labelStart, labelEnd);
		ref = state.env.references[normalizeReference(label)];
		if (!ref) {
			state.pos = oldPos;
			return false;
		}
		href = ref.href;
		title = ref.title;
	}
	if (!silent) {
		content = state.src.slice(labelStart, labelEnd);
		const tokens = [];
		state.md.inline.parse(content, state.md, state.env, tokens);
		const token = state.push("image", "img", 0);
		const attrs = [["src", href], ["alt", ""]];
		token.attrs = attrs;
		token.children = tokens;
		token.content = content;
		if (title) attrs.push(["title", title]);
	}
	state.pos = pos;
	state.posMax = max;
	return true;
}

//#endregion
//#region src/parser/inline/rules/link.ts
function link(state, silent) {
	let code$1, label, res, ref;
	let href = "";
	let title = "";
	let start = state.pos;
	let parseReference = true;
	if (state.src.charCodeAt(state.pos) !== 91) return false;
	const oldPos = state.pos;
	const max = state.posMax;
	const labelStart = state.pos + 1;
	const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
	if (labelEnd < 0) return false;
	let pos = labelEnd + 1;
	if (pos < max && state.src.charCodeAt(pos) === 40) {
		parseReference = false;
		pos++;
		for (; pos < max; pos++) {
			code$1 = state.src.charCodeAt(pos);
			if (!isSpace(code$1) && code$1 !== 10) break;
		}
		if (pos >= max) return false;
		start = pos;
		res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
		if (res.ok) {
			href = state.md.normalizeLink(res.str);
			if (state.md.validateLink(href)) pos = res.pos;
			else href = "";
			start = pos;
			for (; pos < max; pos++) {
				code$1 = state.src.charCodeAt(pos);
				if (!isSpace(code$1) && code$1 !== 10) break;
			}
			res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
			if (pos < max && start !== pos && res.ok) {
				title = res.str;
				pos = res.pos;
				for (; pos < max; pos++) {
					code$1 = state.src.charCodeAt(pos);
					if (!isSpace(code$1) && code$1 !== 10) break;
				}
			}
		}
		if (pos >= max || state.src.charCodeAt(pos) !== 41) parseReference = true;
		pos++;
	}
	if (parseReference) {
		if (typeof state.env.references === "undefined") return false;
		if (pos < max && state.src.charCodeAt(pos) === 91) {
			start = pos + 1;
			pos = state.md.helpers.parseLinkLabel(state, pos);
			if (pos >= 0) label = state.src.slice(start, pos++);
			else pos = labelEnd + 1;
		} else pos = labelEnd + 1;
		if (!label) label = state.src.slice(labelStart, labelEnd);
		ref = state.env.references[normalizeReference(label)];
		if (!ref) {
			state.pos = oldPos;
			return false;
		}
		href = ref.href;
		title = ref.title;
	}
	if (!silent) {
		state.pos = labelStart;
		state.posMax = labelEnd;
		const token_o = state.push("link_open", "a", 1);
		const attrs = [["href", href]];
		token_o.attrs = attrs;
		if (title) attrs.push(["title", title]);
		state.linkLevel++;
		state.md.inline.tokenize(state);
		state.linkLevel--;
		state.push("link_close", "a", -1);
	}
	state.pos = pos;
	state.posMax = max;
	return true;
}

//#endregion
//#region src/parser/inline/rules/linkify.ts
const SCHEME_RE = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
function linkify(state, silent) {
	if (!state.md.options.linkify) return false;
	if (state.linkLevel > 0) return false;
	const pos = state.pos;
	const max = state.posMax;
	if (pos + 3 > max) return false;
	if (state.src.charCodeAt(pos) !== 58) return false;
	if (state.src.charCodeAt(pos + 1) !== 47) return false;
	if (state.src.charCodeAt(pos + 2) !== 47) return false;
	const match = state.pending.match(SCHEME_RE);
	if (!match) return false;
	const proto = match[1];
	const link$1 = state.md.linkify.matchAtStart(state.src.slice(pos - proto.length));
	if (!link$1) return false;
	let url = link$1.url;
	if (url.length <= proto.length) return false;
	let urlEnd = url.length;
	while (urlEnd > 0 && url.charCodeAt(urlEnd - 1) === 42) urlEnd--;
	if (urlEnd !== url.length) url = url.slice(0, urlEnd);
	const fullUrl = state.md.normalizeLink(url);
	if (!state.md.validateLink(fullUrl)) return false;
	if (!silent) {
		state.pending = state.pending.slice(0, -proto.length);
		const token_o = state.push("link_open", "a", 1);
		token_o.attrs = [["href", fullUrl]];
		token_o.markup = "linkify";
		token_o.info = "auto";
		const token_t = state.push("text", "", 0);
		token_t.content = state.md.normalizeLinkText(url);
		const token_c = state.push("link_close", "a", -1);
		token_c.markup = "linkify";
		token_c.info = "auto";
	}
	state.pos += url.length - proto.length;
	return true;
}

//#endregion
//#region src/parser/inline/rules/newline.ts
function newline(state, silent) {
	let pos = state.pos;
	if (state.src.charCodeAt(pos) !== 10) return false;
	const pmax = state.pending.length - 1;
	const max = state.posMax;
	if (!silent) if (pmax >= 0 && state.pending.charCodeAt(pmax) === 32) if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 32) {
		let ws = pmax - 1;
		while (ws >= 1 && state.pending.charCodeAt(ws - 1) === 32) ws--;
		state.pending = state.pending.slice(0, ws);
		state.push("hardbreak", "br", 0);
	} else {
		state.pending = state.pending.slice(0, -1);
		state.push("softbreak", "br", 0);
	}
	else state.push("softbreak", "br", 0);
	pos++;
	while (pos < max && isSpace(state.src.charCodeAt(pos))) pos++;
	state.pos = pos;
	return true;
}

//#endregion
//#region src/parser/inline/rules/strikethrough.ts
function strikethrough_tokenize(state, silent) {
	const start = state.pos;
	const marker = state.src.charCodeAt(start);
	if (silent) return false;
	if (marker !== 126) return false;
	const scanned = state.scanDelims(state.pos, true);
	let len = scanned.length;
	const ch = String.fromCharCode(marker);
	if (len < 2) return false;
	let token;
	if (len % 2) {
		token = state.push("text", "", 0);
		token.content = ch;
		len--;
	}
	for (let i = 0; i < len; i += 2) {
		token = state.push("text", "", 0);
		token.content = ch + ch;
		state.delimiters.push({
			marker,
			length: 0,
			token: state.tokens.length - 1,
			end: -1,
			open: scanned.can_open,
			close: scanned.can_close
		});
	}
	state.pos += scanned.length;
	return true;
}
function postProcess(state, delimiters) {
	let token;
	const loneMarkers = [];
	const max = delimiters.length;
	for (let i = 0; i < max; i++) {
		const startDelim = delimiters[i];
		if (startDelim.marker !== 126) continue;
		if (startDelim.end === -1) continue;
		const endDelim = delimiters[startDelim.end];
		token = state.tokens[startDelim.token];
		token.type = "s_open";
		token.tag = "s";
		token.nesting = 1;
		token.markup = "~~";
		token.content = "";
		token = state.tokens[endDelim.token];
		token.type = "s_close";
		token.tag = "s";
		token.nesting = -1;
		token.markup = "~~";
		token.content = "";
		if (state.tokens[endDelim.token - 1].type === "text" && state.tokens[endDelim.token - 1].content === "~") loneMarkers.push(endDelim.token - 1);
	}
	while (loneMarkers.length) {
		const i = loneMarkers.pop();
		let j = i + 1;
		while (j < state.tokens.length && state.tokens[j].type === "s_close") j++;
		j--;
		if (i !== j) {
			token = state.tokens[j];
			state.tokens[j] = state.tokens[i];
			state.tokens[i] = token;
		}
	}
}
function strikethrough_postProcess(state) {
	const tokens_meta = state.tokens_meta;
	const max = state.tokens_meta.length;
	postProcess(state, state.delimiters);
	for (let curr = 0; curr < max; curr++) {
		const delimiters = tokens_meta[curr]?.delimiters;
		if (delimiters) postProcess(state, delimiters);
	}
}
var strikethrough_default = {
	tokenize: strikethrough_tokenize,
	postProcess: strikethrough_postProcess
};

//#endregion
//#region src/parser/inline/rules/text.ts
function isTerminatorChar(ch) {
	switch (ch) {
		case 10:
		case 33:
		case 35:
		case 36:
		case 37:
		case 38:
		case 42:
		case 43:
		case 45:
		case 58:
		case 60:
		case 61:
		case 62:
		case 64:
		case 91:
		case 92:
		case 93:
		case 94:
		case 95:
		case 96:
		case 123:
		case 125:
		case 126: return true;
		default: return false;
	}
}
function text(state, silent) {
	let pos = state.pos;
	const src = state.src;
	while (pos < state.posMax && !isTerminatorChar(src.charCodeAt(pos))) pos++;
	if (pos === state.pos) return false;
	if (!silent) state.pending += src.slice(state.pos, pos);
	state.pos = pos;
	return true;
}

//#endregion
//#region src/parser/inline/parser_inline.ts
const _rules = [
	["text", text],
	["linkify", linkify],
	["newline", newline],
	["escape", escape],
	["backticks", backtick],
	["strikethrough", strikethrough_default.tokenize],
	["emphasis", emphasis_default.tokenize],
	["link", link],
	["image", image],
	["autolink", autolink],
	["html_inline", html_inline],
	["entity", entity]
];
const _rules2 = [
	["balance_pairs", link_pairs],
	["strikethrough", strikethrough_default.postProcess],
	["emphasis", emphasis_default.postProcess],
	["fragments_join", fragments_join]
];
var ParserInline = class {
	/**
	* {@link Ruler} instance. Keep configuration of inline rules.
	*/
	ruler;
	/**
	* {@link Ruler} instance. Second ruler used for post-processing
	* (e.g. in emphasis-like rules).
	*/
	ruler2;
	constructor() {
		/**
		* ParserInline#ruler -> Ruler
		*
		* [[Ruler]] instance. Keep configuration of inline rules.
		*/
		this.ruler = new Ruler();
		for (let i = 0; i < _rules.length; i++) this.ruler.push(_rules[i][0], _rules[i][1]);
		/**
		* ParserInline#ruler2 -> Ruler
		*
		* [[Ruler]] instance. Second ruler used for post-processing
		* (e.g. in emphasis-like rules).
		*/
		this.ruler2 = new Ruler();
		for (let i = 0; i < _rules2.length; i++) this.ruler2.push(_rules2[i][0], _rules2[i][1]);
	}
	/**
	* Skip single token by running all rules in validation mode;
	* returns `true` if any rule reported success
	*/
	skipToken(state) {
		const pos = state.pos;
		const rules = this.ruler.getRules("");
		const len = rules.length;
		const maxNesting = state.md.options.maxNesting;
		const cache = state.cache;
		const cachedPos = cache[pos];
		if (cachedPos !== void 0) {
			state.pos = cachedPos;
			return;
		}
		let ok = false;
		if (state.level < maxNesting) for (let i = 0; i < len; i++) {
			state.level++;
			ok = rules[i](state, true);
			state.level--;
			if (ok) {
				if (pos >= state.pos) throw new Error("inline rule didn't increment state.pos");
				break;
			}
		}
		else state.pos = state.posMax;
		if (!ok) state.pos++;
		cache[pos] = state.pos;
	}
	/**
	* Generate tokens for input range
	*/
	tokenize(state) {
		const rules = this.ruler.getRules("");
		const len = rules.length;
		const end = state.posMax;
		const maxNesting = state.md.options.maxNesting;
		while (state.pos < end) {
			const prevPos = state.pos;
			let ok = false;
			if (state.level < maxNesting) for (let i = 0; i < len; i++) {
				ok = rules[i](state, false);
				if (ok) {
					if (prevPos >= state.pos) throw new Error("inline rule didn't increment state.pos");
					break;
				}
			}
			if (ok) {
				if (state.pos >= end) break;
				continue;
			}
			state.pending += state.src[state.pos++];
		}
		if (state.pending) state.pushPending();
	}
	/**
	* Process input string and push inline tokens into `outTokens`
	*/
	parse(str, md, env, outTokens) {
		const state = new this.State(str, md, env, outTokens);
		this.tokenize(state);
		const rules = this.ruler2.getRules("");
		const len = rules.length;
		for (let i = 0; i < len; i++) rules[i](state);
	}
	State = StateInline;
};

//#endregion
//#region src/parser/utils/link.ts
const BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
function validateLink(url) {
	const str = url.trim().toLowerCase();
	return BAD_PROTO_RE.test(str) ? GOOD_DATA_RE.test(str) : true;
}
const RECODE_HOSTNAME_FOR = [
	"http:",
	"https:",
	"mailto:"
];
function normalizeLink(url) {
	const parsed = mdurl.parse(url, true);
	if (parsed.hostname) {
		if (!parsed.protocol || RECODE_HOSTNAME_FOR.includes(parsed.protocol)) try {
			parsed.hostname = punycode.toASCII(parsed.hostname);
		} catch {}
	}
	return mdurl.encode(mdurl.format(parsed));
}
function normalizeLinkText(url) {
	const parsed = mdurl.parse(url, true);
	if (parsed.hostname) {
		if (!parsed.protocol || RECODE_HOSTNAME_FOR.includes(parsed.protocol)) try {
			parsed.hostname = punycode.toUnicode(parsed.hostname);
		} catch {}
	}
	return mdurl.decode(mdurl.format(parsed), `${mdurl.decode.defaultChars}%`);
}

//#endregion
//#region src/parser/parser.ts
const defaultOptions = {
	html: false,
	linkify: false,
	typographer: false,
	quotes: "“”‘’",
	maxNesting: 100
};
var Parser = class {
	/**
	* Instance of {@link ParserInline}. You may need it to add new rules when writing plugins.
	*/
	inline = new ParserInline();
	/**
	* Instance of {@link ParserBlock}. You may need it to add new rules when writing plugins.
	*/
	block = new ParserBlock();
	/**
	* Instance of {@link Core} chain executor. You may need it to add new rules when writing plugins.
	*/
	core = new Core();
	/**
	* [linkify-it](https://github.com/markdown-it/linkify-it) instance.
	* Used by [linkify](https://github.com/serkodev/markdown-exit/blob/main/packages/markdown-exit/src/parser/core/rules/linkify.ts)
	* rule.
	*/
	linkify = new LinkifyIt();
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
	validateLink = validateLink;
	/**
	* Function used to encode link url to a machine-readable format,
	* which includes url-encoding, punycode, etc.
	*/
	normalizeLink = normalizeLink;
	/**
	* Function used to decode link url to a human-readable format`
	*/
	normalizeLinkText = normalizeLinkText;
	/**
	* Link components parser functions, useful to write plugins. See details
	* [here](https://github.com/serkodev/markdown-exit/tree/main/packages/markdown-exit/src/parser/helpers).
	*/
	helpers = { ...helpers };
	options = { ...defaultOptions };
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
	parse(src, env = {}) {
		if (typeof src !== "string") throw new TypeError("Input data should be a String");
		const state = new this.core.State(src, this, env);
		this.core.process(state);
		return state.tokens;
	}
	/**
	* The same as {@link parse} but skip all block rules. It returns the
	* block tokens list with the single `inline` element, containing parsed inline
	* tokens in `children` property. Also updates `env` object.
	*
	* @param src source string
	* @param env environment sandbox
	*/
	parseInline(src, env = {}) {
		const state = new this.core.State(src, this, env);
		state.inlineMode = true;
		this.core.process(state);
		return state.tokens;
	}
};

//#endregion
//#region src/presets/commonmark.ts
const commonmarkPreset = {
	options: {
		html: true,
		xhtmlOut: true,
		breaks: false,
		langPrefix: "language-",
		linkify: false,
		typographer: false,
		quotes: "“”‘’",
		highlight: null,
		maxNesting: 20
	},
	components: {
		core: { rules: [
			"normalize",
			"block",
			"inline",
			"text_join"
		] },
		block: { rules: [
			"blockquote",
			"code",
			"fence",
			"heading",
			"hr",
			"html_block",
			"lheading",
			"list",
			"reference",
			"paragraph"
		] },
		inline: {
			rules: [
				"autolink",
				"backticks",
				"emphasis",
				"entity",
				"escape",
				"html_inline",
				"image",
				"link",
				"newline",
				"text"
			],
			rules2: [
				"balance_pairs",
				"emphasis",
				"fragments_join"
			]
		}
	}
};
var commonmark_default = commonmarkPreset;

//#endregion
//#region src/presets/default.ts
const defaultPreset = {
	options: {
		...defaultOptions,
		xhtmlOut: false,
		breaks: false,
		langPrefix: "language-",
		highlight: null
	},
	components: {
		core: {},
		block: {},
		inline: {}
	}
};
var default_default = defaultPreset;

//#endregion
//#region src/presets/zero.ts
const zeroPreset = {
	options: {
		html: false,
		xhtmlOut: false,
		breaks: false,
		langPrefix: "language-",
		linkify: false,
		typographer: false,
		quotes: "“”‘’",
		highlight: null,
		maxNesting: 20
	},
	components: {
		core: { rules: [
			"normalize",
			"block",
			"inline",
			"text_join"
		] },
		block: { rules: ["paragraph"] },
		inline: {
			rules: ["text"],
			rules2: ["balance_pairs", "fragments_join"]
		}
	}
};
var zero_default = zeroPreset;

//#endregion
//#region src/renderer.ts
const default_rules = {};
default_rules.code_inline = function(tokens, idx, options, env, slf) {
	const token = tokens[idx];
	return `<code${slf.renderAttrs(token)}>${escapeHtml(token.content)}</code>`;
};
default_rules.code_block = function(tokens, idx, options, env, slf) {
	const token = tokens[idx];
	return `<pre${slf.renderAttrs(token)}><code>${escapeHtml(tokens[idx].content)}</code></pre>\n`;
};
default_rules.fence = function(tokens, idx, options, env, slf) {
	const token = tokens[idx];
	const info = token.info ? unescapeAll(token.info).trim() : "";
	let langName = "";
	let langAttrs = "";
	if (info) {
		const arr = info.split(/(\s+)/g);
		langName = arr[0];
		langAttrs = arr.slice(2).join("");
	}
	function finalize(highlighted$1) {
		if (highlighted$1.indexOf("<pre") === 0) return `${highlighted$1}\n`;
		if (info) {
			const i = token.attrIndex("class");
			const tmpAttrs = token.attrs ? token.attrs.slice() : [];
			if (i < 0) tmpAttrs.push(["class", options.langPrefix + langName]);
			else {
				tmpAttrs[i] = tmpAttrs[i].slice();
				tmpAttrs[i][1] += ` ${options.langPrefix}${langName}`;
			}
			const tmpToken = { attrs: tmpAttrs };
			return `<pre><code${slf.renderAttrs(tmpToken)}>${highlighted$1}</code></pre>\n`;
		}
		return `<pre><code${slf.renderAttrs(token)}>${highlighted$1}</code></pre>\n`;
	}
	const resolveHighlighted = () => {
		if (!options.highlight) return escapeHtml(token.content);
		const highlighted$1 = options.highlight(token.content, langName, langAttrs, env);
		if (isPromiseLike(highlighted$1)) return highlighted$1.then((v) => v || escapeHtml(token.content));
		return highlighted$1 || escapeHtml(token.content);
	};
	const highlighted = resolveHighlighted();
	return isPromiseLike(highlighted) ? highlighted.then(finalize) : finalize(highlighted);
};
default_rules.image = function(tokens, idx, options, env, slf) {
	const token = tokens[idx];
	token.attrs[token.attrIndex("alt")][1] = slf.renderInlineAsText(token.children, options, env);
	return slf.renderToken(tokens, idx, options);
};
default_rules.hardbreak = function(tokens, idx, options) {
	return options.xhtmlOut ? "<br />\n" : "<br>\n";
};
default_rules.softbreak = function(tokens, idx, options) {
	return options.breaks ? options.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
};
default_rules.text = function(tokens, idx) {
	return escapeHtml(tokens[idx].content);
};
default_rules.html_block = function(tokens, idx) {
	return tokens[idx].content;
};
default_rules.html_inline = function(tokens, idx) {
	return tokens[idx].content;
};
default_rules.reference = function(tokens, idx) {
	return tokens[idx].content;
};
var Renderer = class {
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
	rules = assign({}, default_rules);
	/**
	* Creates new {@link Renderer} instance and fill {@link Renderer#rules} with defaults.
	*/
	constructor() {}
	/**
	* Render token attributes to string.
	*/
	renderAttrs(token) {
		const attrs = token.attrs;
		if (!attrs) return "";
		const len = attrs.length;
		if (len === 0) return "";
		let result = "";
		for (let i = 0; i < len; i++) result += ` ${escapeHtml(attrs[i][0])}="${escapeHtml(attrs[i][1])}"`;
		return result;
	}
	/**
	* Default token renderer. Can be overriden by custom function
	* in {@link Renderer#rules}.
	*
	* @param tokens list of tokens
	* @param idx token index to render
	* @param options params of parser instance
	* @param env additional data from parsed input (references, for example)
	*/
	renderToken(tokens, idx, options, env = {}) {
		const token = tokens[idx];
		let result = "";
		if (token.hidden) return "";
		if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) result += "\n";
		result += (token.nesting === -1 ? "</" : "<") + token.tag;
		result += this.renderAttrs(token);
		if (token.nesting === 0 && options.xhtmlOut) result += " /";
		let needLf = false;
		if (token.block) {
			needLf = true;
			if (token.nesting === 1) {
				if (idx + 1 < tokens.length) {
					const nextToken = tokens[idx + 1];
					if (nextToken.type === "inline" || nextToken.type === "reference" || nextToken.hidden) needLf = false;
					else if (nextToken.nesting === -1 && nextToken.tag === token.tag) needLf = false;
				}
			}
		}
		result += needLf ? ">\n" : ">";
		return result;
	}
	/**
	* The same as {@link Renderer.render}, but for single token of `inline` type.
	*
	* @param tokens list of block tokens to render
	* @param options params of parser instance
	* @param env additional data from parsed input (references, for example)
	*/
	renderInline(tokens, options, env = {}) {
		let result = "";
		const rules = this.rules;
		for (let i = 0, len = tokens.length; i < len; i++) {
			const rule = rules[tokens[i].type];
			if (rule) {
				const _result = rule(tokens, i, options, env, this);
				if (isPromiseLike(_result)) throw new Error("Renderer.renderInline: async rule detected, use renderInlineAsync()");
				result += _result;
			} else result += this.renderToken(tokens, i, options, env);
		}
		return result;
	}
	/**
	* Special kludge for image `alt` attributes to conform CommonMark spec.
	* Don't try to use it! Spec requires to show `alt` content with stripped markup,
	* instead of simple escaping.
	*
	* @param tokens list of block tokens to render
	* @param options params of parser instance
	* @param env additional data from parsed input (references, for example)
	*/
	renderInlineAsText(tokens, options, env = {}) {
		let result = "";
		for (let i = 0, len = tokens.length; i < len; i++) {
			const token = tokens[i];
			switch (token.type) {
				case "text":
					result += token.content;
					break;
				case "image":
					result += this.renderInlineAsText(token.children, options, env);
					break;
				case "html_inline":
				case "html_block":
					result += token.content;
					break;
				case "softbreak":
				case "hardbreak":
					result += "\n";
					break;
				default:
			}
		}
		return result;
	}
	/**
	* Takes token stream and generates HTML. Probably, you will never need to call
	* this method directly.
	*
	* @param tokens list of block tokens to render
	* @param options params of parser instance
	* @param env additional data from parsed input (references, for example)
	*/
	render(tokens, options, env = {}) {
		let result = "";
		const rules = this.rules;
		for (let i = 0, len = tokens.length; i < len; i++) {
			const type = tokens[i].type;
			if (type === "inline") result += this.renderInline(tokens[i].children, options, env);
			else {
				const rule = rules[type];
				if (rule) {
					const _result = rule(tokens, i, options, env, this);
					if (isPromiseLike(_result)) throw new Error("Renderer.render: async rule detected, use renderAsync()");
					result += _result;
				} else result += this.renderToken(tokens, i, options, env);
			}
		}
		return result;
	}
	/**
	* Async version of {@link Renderer.renderInline}. Runs all render rules in parallel
	* (Promise.all) and preserves output order.
	*/
	async renderInlineAsync(tokens, options, env) {
		const tasks = [];
		const rules = this.rules;
		for (let i = 0, len = tokens.length; i < len; i++) {
			const rule = rules[tokens[i].type];
			if (rule) tasks.push(Promise.resolve(rule(tokens, i, options, env, this)));
			else tasks.push(Promise.resolve(this.renderToken(tokens, i, options, env)));
		}
		return (await Promise.all(tasks)).join("");
	}
	/**
	* Async version of {@link Renderer.render}. Runs all render rules in parallel
	* (Promise.all) and preserves output order.
	*/
	async renderAsync(tokens, options, env) {
		const tasks = [];
		const rules = this.rules;
		for (let i = 0, len = tokens.length; i < len; i++) {
			const tok = tokens[i];
			const type = tok.type;
			if (type === "inline") tasks.push(this.renderInlineAsync(tok.children, options, env));
			else {
				const rule = rules[type];
				if (rule) tasks.push(Promise.resolve(rule(tokens, i, options, env, this)));
				else tasks.push(Promise.resolve(this.renderToken(tokens, i, options, env)));
			}
		}
		return (await Promise.all(tasks)).join("");
	}
};

//#endregion
//#region src/core.ts
const config = {
	default: default_default,
	zero: zero_default,
	commonmark: commonmark_default
};
var MarkdownExit = class extends Parser {
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
	renderer = new Renderer();
	/**
	* Assorted utility functions, useful to write plugins. See details
	* [here](https://github.com/serkodev/markdown-exit/tree/main/packages/markdown-exit/src/common/utils.ts).
	*/
	utils = utils_exports;
	options = { ...config.default.options };
	constructor(presetNameOrOptions, options) {
		super();
		const [presetName, opts] = typeof presetNameOrOptions === "string" ? [presetNameOrOptions, options] : ["default", presetNameOrOptions];
		this.configure(presetName);
		if (opts) this.set(opts);
	}
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
	set(options) {
		assign(this.options, options);
		return this;
	}
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
	configure(presets) {
		if (typeof presets === "string") {
			const presetName = presets;
			presets = config[presetName];
			if (!presets) throw new Error(`Wrong \`markdown-exit\` preset "${presetName}", check name`);
		}
		if (!presets) throw new Error("Wrong `markdown-exit` preset, can't be empty");
		if (presets.options) this.set(presets.options);
		if (presets.components) for (const name of Object.keys(presets.components)) {
			const component = presets.components[name];
			if (component.rules) this[name].ruler.enableOnly(component.rules);
			if (component.rules2) this[name].ruler2?.enableOnly(component.rules2);
		}
		return this;
	}
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
	enable(list$1, ignoreInvalid) {
		let result = [];
		if (!Array.isArray(list$1)) list$1 = [list$1];
		for (const chain of [
			"core",
			"block",
			"inline"
		]) result = result.concat(this[chain].ruler.enable(list$1, true));
		result = result.concat(this.inline.ruler2.enable(list$1, true));
		const missed = list$1.filter((name) => !result.includes(name));
		if (missed.length && !ignoreInvalid) throw new Error(`MarkdownExit. Failed to enable unknown rule(s): ${missed}`);
		return this;
	}
	/**
	* chainable*
	*
	* The same as {@link MarkdownExit.enable}, but turn specified rules off.
	*
	* @param list rule name or list of rule names to disable.
	* @param ignoreInvalid set `true` to ignore errors when rule not found.
	*/
	disable(list$1, ignoreInvalid) {
		let result = [];
		if (!Array.isArray(list$1)) list$1 = [list$1];
		for (const chain of [
			"core",
			"block",
			"inline"
		]) result = result.concat(this[chain].ruler.disable(list$1, true));
		result = result.concat(this.inline.ruler2.disable(list$1, true));
		const missed = list$1.filter((name) => !result.includes(name));
		if (missed.length && !ignoreInvalid) throw new Error(`MarkdownExit. Failed to disable unknown rule(s): ${missed}`);
		return this;
	}
	use(plugin, ...params) {
		plugin.apply(plugin, [this, ...params]);
		return this;
	}
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
	render(src, env = {}) {
		return this.renderer.render(this.parse(src, env), this.options, env);
	}
	/**
	* Async version of {@link MarkdownExit.render}. Runs all render rules in parallel
	* (Promise.all) and preserves output order.
	*/
	renderAsync(src, env = {}) {
		return this.renderer.renderAsync(this.parse(src, env), this.options, env);
	}
	/**
	* Similar to {@link MarkdownExit.render} but for single paragraph content. Result
	* will NOT be wrapped into `<p>` tags.
	*
	* @param src source string
	* @param env environment sandbox
	*/
	renderInline(src, env = {}) {
		return this.renderer.render(this.parseInline(src, env), this.options, env);
	}
	/**
	* Async version of {@link MarkdownExit.renderInline}. Runs all render rules in parallel
	* (Promise.all) and preserves output order.
	*/
	renderInlineAsync(src, env = {}) {
		return this.renderer.renderAsync(this.parseInline(src, env), this.options, env);
	}
};
function createMarkdownExit(presetNameOrOptions, options) {
	return new MarkdownExit(presetNameOrOptions, options);
}

//#endregion
//#region src/index.ts
/**
* Make class callable without `new` operator.
*/
function createCallableClass(Class) {
	function callable(...args) {
		return new Class(...args);
	}
	Object.setPrototypeOf(callable, MarkdownExit);
	callable.prototype = MarkdownExit.prototype;
	callable.prototype.constructor = callable;
	return callable;
}
const MarkdownExitConstructor = createCallableClass(MarkdownExit);
var src_default = MarkdownExitConstructor;

//#endregion
export { MarkdownExit, Parser, Renderer, Ruler, StateBlock, StateCore, StateInline, Token, createMarkdownExit, src_default as default, defaultOptions };