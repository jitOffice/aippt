import { EncodedTokenMetadata, FontStyle, INITIAL } from "@shikijs/vscode-textmate";

//#region src/tokenizer.ts
var TokenizerState = class TokenizerState {
	constructor(_ruleStack) {
		this._ruleStack = _ruleStack;
	}
	get ruleStack() {
		return this._ruleStack;
	}
	clone() {
		return new TokenizerState(this._ruleStack);
	}
	equals(other) {
		if (!other || !(other instanceof TokenizerState) || other !== this || other._ruleStack !== this._ruleStack) return false;
		return true;
	}
};

//#endregion
//#region src/utils.ts
function normalizeColor(color) {
	if (Array.isArray(color)) color = color[0];
	if (!color) return void 0;
	color = (color.charCodeAt(0) === 35 ? color.slice(1) : color).toLowerCase();
	if (color.length === 3 || color.length === 4) color = color.split("").map((c) => c + c).join("");
	return color;
}

//#endregion
//#region src/index.ts
function textmateThemeToMonacoTheme(theme) {
	let rules = "rules" in theme ? theme.rules : void 0;
	if (!rules) {
		rules = [];
		const themeSettings = theme.settings || theme.tokenColors;
		for (const { scope, settings: { foreground, background, fontStyle } = {} } of themeSettings) {
			if (!foreground && !background && !fontStyle) continue;
			const scopes = Array.isArray(scope) ? scope : scope ? [scope] : [];
			const normalizedFontStyle = normalizeFontStyleString(fontStyle);
			const normalizedForeground = normalizeColor(foreground);
			const normalizedBackground = normalizeColor(background);
			rules.push(...scopes.map((s) => ({
				token: s,
				foreground: normalizedForeground,
				background: normalizedBackground,
				fontStyle: normalizedFontStyle
			})));
		}
	}
	const colors = Object.fromEntries(Object.entries(theme.colors || {}).map(([key, value]) => [key, `#${normalizeColor(value)}`]));
	return {
		base: theme.type === "light" ? "vs" : "vs-dark",
		inherit: false,
		colors,
		rules
	};
}
function shikiToMonaco(highlighter, monaco, options = {}) {
	const themeMap = /* @__PURE__ */ new Map();
	const themeIds = highlighter.getLoadedThemes();
	for (const themeId of themeIds) {
		const monacoTheme = textmateThemeToMonacoTheme(highlighter.getTheme(themeId));
		themeMap.set(themeId, monacoTheme);
		monaco.editor.defineTheme(themeId, monacoTheme);
	}
	const colorMap = [];
	const colorStyleToScopeMap = /* @__PURE__ */ new Map();
	const _setTheme = monaco.editor.setTheme.bind(monaco.editor);
	monaco.editor.setTheme = (themeName) => {
		const ret = highlighter.setTheme(themeName);
		const theme = themeMap.get(themeName);
		colorMap.length = ret.colorMap.length;
		for (let i = 0; i < ret.colorMap.length; i++) colorMap[i] = ret.colorMap[i];
		colorStyleToScopeMap.clear();
		theme?.rules.forEach((rule) => {
			const c = normalizeColor(rule.foreground);
			if (!c) return;
			const key = getColorStyleKey(c, normalizeFontStyleString(rule.fontStyle));
			if (!colorStyleToScopeMap.has(key)) colorStyleToScopeMap.set(key, rule.token);
		});
		_setTheme(themeName);
	};
	const _create = monaco.editor.create;
	monaco.editor.create = (element, options, override) => {
		if (options?.theme) monaco.editor.setTheme(options.theme);
		return _create(element, options, override);
	};
	monaco.editor.setTheme(themeIds[0]);
	function findScopeByColorAndStyle(color, fontStyle) {
		const key = getColorStyleKey(color, normalizeFontStyleBits(fontStyle));
		return colorStyleToScopeMap.get(key);
	}
	const { tokenizeMaxLineLength = 2e4, tokenizeTimeLimit = 500 } = options;
	const monacoLanguageIds = new Set(monaco.languages.getLanguages().map((l) => l.id));
	for (const lang of highlighter.getLoadedLanguages()) if (monacoLanguageIds.has(lang)) monaco.languages.setTokensProvider(lang, {
		getInitialState() {
			return new TokenizerState(INITIAL);
		},
		tokenize(line, state) {
			if (line.length >= tokenizeMaxLineLength) return {
				endState: state,
				tokens: [{
					startIndex: 0,
					scopes: ""
				}]
			};
			const result = highlighter.getLanguage(lang).tokenizeLine2(line, state.ruleStack, tokenizeTimeLimit);
			if (result.stoppedEarly) console.warn(`Time limit reached when tokenizing line: ${line.substring(0, 100)}`);
			const tokensLength = result.tokens.length / 2;
			const tokens = [];
			for (let j = 0; j < tokensLength; j++) {
				const startIndex = result.tokens[2 * j];
				const metadata = result.tokens[2 * j + 1];
				const color = normalizeColor(colorMap[EncodedTokenMetadata.getForeground(metadata)] || "");
				const fontStyle = EncodedTokenMetadata.getFontStyle(metadata);
				const scope = color ? findScopeByColorAndStyle(color, fontStyle) || "" : "";
				tokens.push({
					startIndex,
					scopes: scope
				});
			}
			return {
				endState: new TokenizerState(result.ruleStack),
				tokens
			};
		}
	});
}
function normalizeFontStyleBits(fontStyle) {
	if (fontStyle <= FontStyle.None) return "";
	const styles = [];
	if (fontStyle & FontStyle.Italic) styles.push("italic");
	if (fontStyle & FontStyle.Bold) styles.push("bold");
	if (fontStyle & FontStyle.Underline) styles.push("underline");
	if (fontStyle & FontStyle.Strikethrough) styles.push("strikethrough");
	return styles.join(" ");
}
const VALID_FONT_STYLES = [
	"italic",
	"bold",
	"underline",
	"strikethrough"
];
const VALID_FONT_ALIASES = { "line-through": "strikethrough" };
function normalizeFontStyleString(fontStyle) {
	if (!fontStyle) return "";
	const styles = new Set(fontStyle.split(/[\s,]+/).map((style) => style.trim().toLowerCase()).map((style) => VALID_FONT_ALIASES[style] || style).filter(Boolean));
	return VALID_FONT_STYLES.filter((style) => styles.has(style)).join(" ");
}
function getColorStyleKey(color, fontStyle) {
	if (!fontStyle) return color;
	return `${color}|${fontStyle}`;
}

//#endregion
export { shikiToMonaco, textmateThemeToMonacoTheme };