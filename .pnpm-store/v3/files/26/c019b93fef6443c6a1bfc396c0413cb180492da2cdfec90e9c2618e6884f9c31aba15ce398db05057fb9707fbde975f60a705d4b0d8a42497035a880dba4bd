"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptions = parseOptions;
exports.parseData = parseData;
const lodash_es_1 = require("lodash-es");
const designs_1 = require("../designs");
const renderer_1 = require("../renderer");
const themes_1 = require("../themes");
const utils_1 = require("../utils");
function parseOptions(options) {
    const { container = '#container', padding = 0, template, design, theme, themeConfig, data } = options, restOptions = __rest(options, ["container", "padding", "template", "design", "theme", "themeConfig", "data"]);
    const parsedContainer = typeof container === 'string'
        ? document.querySelector(container) || document.createElement('div')
        : container;
    const templateOptions = template
        ? (0, designs_1.getTemplate)(template)
        : undefined;
    const mergedThemeConfig = (0, lodash_es_1.merge)({}, templateOptions === null || templateOptions === void 0 ? void 0 : templateOptions.themeConfig, themeConfig);
    const resolvedThemeConfig = theme || themeConfig || (templateOptions === null || templateOptions === void 0 ? void 0 : templateOptions.themeConfig)
        ? parseTheme(theme, mergedThemeConfig)
        : undefined;
    const parsed = {
        container: parsedContainer,
        padding: (0, utils_1.parsePadding)(padding),
    };
    if (templateOptions) {
        const { design: templateDesign } = templateOptions, restTemplateOptions = __rest(templateOptions, ["design"]);
        Object.assign(parsed, restTemplateOptions);
    }
    Object.assign(parsed, restOptions);
    const parsedData = parseData(data, options.template);
    if (parsedData)
        parsed.data = parsedData;
    if (template)
        parsed.template = template;
    if ((templateOptions === null || templateOptions === void 0 ? void 0 : templateOptions.design) || design) {
        const designOptions = Object.assign(Object.assign({}, (resolvedThemeConfig
            ? Object.assign(Object.assign({}, options), { themeConfig: resolvedThemeConfig }) : options)), { data: parsedData || data });
        const parsedDesign = parseDesign(Object.assign(Object.assign({}, templateOptions === null || templateOptions === void 0 ? void 0 : templateOptions.design), design), designOptions);
        if ((0, utils_1.isNonNullableParsedDesignsOptions)(parsedDesign)) {
            parsed.design = parsedDesign;
        }
    }
    if (theme)
        parsed.theme = theme;
    if (resolvedThemeConfig) {
        parsed.themeConfig = resolvedThemeConfig;
    }
    return parsed;
}
function parseData(data, template) {
    if (!data)
        return undefined;
    if (Array.isArray(data.items) && data.items.length)
        return data;
    const { lists, sequences, compares, nodes, values, root } = data;
    const getPreferredData = () => {
        if (!template)
            return null;
        const DATA_MAP = {
            list: lists,
            sequence: sequences,
            compare: compares,
            relation: nodes,
            chart: values,
            hierarchy: root ? [root] : [],
        };
        const prefix = template.split('-')[0];
        const arr = DATA_MAP[prefix];
        return (arr === null || arr === void 0 ? void 0 : arr.length) ? arr : null;
    };
    const getPolyfillData = () => {
        var _a;
        if (lists === null || lists === void 0 ? void 0 : lists.length)
            return lists;
        if (sequences === null || sequences === void 0 ? void 0 : sequences.length)
            return sequences;
        if (compares === null || compares === void 0 ? void 0 : compares.length)
            return compares;
        if (nodes === null || nodes === void 0 ? void 0 : nodes.length)
            return nodes;
        if (values === null || values === void 0 ? void 0 : values.length)
            return values;
        if (root)
            return [root];
        if ((_a = data.items) === null || _a === void 0 ? void 0 : _a.length)
            return data.items;
        return [];
    };
    let items = getPreferredData() || getPolyfillData();
    if (items === sequences && data.order === 'desc') {
        items = [...items].reverse();
    }
    return Object.assign(Object.assign({}, data), { items });
}
function normalizeWithType(obj) {
    if (typeof obj === 'string')
        return { type: obj };
    if (!('type' in obj))
        throw new Error('Type is required');
    return obj;
}
function parseDesign(config, options) {
    const { structure, title, item, items } = config || {};
    const defaultItem = parseDesignItem(item || (items === null || items === void 0 ? void 0 : items[0]), options);
    return {
        structure: parseDesignStructure(structure),
        title: parseDesignTitle(title, options),
        item: defaultItem,
        items: !items
            ? [defaultItem]
            : items.map((item) => parseDesignItem(item, options)),
    };
}
function parseDesignStructure(config) {
    if (!config)
        return null;
    const _a = normalizeWithType(config), { type } = _a, userProps = __rest(_a, ["type"]);
    const structure = (0, designs_1.getStructure)(type);
    if (!structure)
        return null;
    const { component } = structure;
    return Object.assign(Object.assign({}, structure), { component: (props) => component(Object.assign(Object.assign({}, props), userProps)) });
}
function parseDesignTitle(config, options) {
    if (!config)
        return { component: null };
    const _a = normalizeWithType(config), { type } = _a, userProps = __rest(_a, ["type"]);
    const { themeConfig } = options;
    const background = (themeConfig === null || themeConfig === void 0 ? void 0 : themeConfig.colorBg) || '#fff';
    const themeColors = generateColors(background, background);
    // use default title for now
    return {
        component: (props) => (0, designs_1.Title)(Object.assign(Object.assign(Object.assign({}, props), { themeColors }), userProps)),
    };
}
function parseDesignItem(config, options) {
    if (!config)
        return null;
    const _a = normalizeWithType(config), { type } = _a, userProps = __rest(_a, ["type"]);
    const item = (0, designs_1.getItem)(type);
    if (!item)
        return null;
    const { component, options: itemOptions } = item;
    return Object.assign(Object.assign({}, item), { component: (props) => {
            var _a;
            const { indexes } = props;
            const { data, themeConfig } = options;
            const background = (themeConfig === null || themeConfig === void 0 ? void 0 : themeConfig.colorBg) || '#fff';
            const { themeColors = generateColors((0, renderer_1.getPaletteColor)(themeConfig === null || themeConfig === void 0 ? void 0 : themeConfig.palette, indexes, (_a = data === null || data === void 0 ? void 0 : data.items) === null || _a === void 0 ? void 0 : _a.length) ||
                (themeConfig === null || themeConfig === void 0 ? void 0 : themeConfig.colorPrimary) ||
                '#FF356A', background) } = props, restProps = __rest(props, ["themeColors"]);
            return component(Object.assign(Object.assign({ themeColors }, restProps), userProps));
        }, options: itemOptions });
}
function parseTheme(theme, themeConfig = {}) {
    var _a;
    const base = theme ? (0, themes_1.getTheme)(theme) || {} : {};
    const parsedThemeConfig = (0, lodash_es_1.merge)({}, base, themeConfig);
    parsedThemeConfig.palette = themeConfig.palette || base.palette;
    parsedThemeConfig.stylize = (_a = themeConfig.stylize) !== null && _a !== void 0 ? _a : base.stylize;
    if (!parsedThemeConfig.colorPrimary) {
        parsedThemeConfig.colorPrimary = '#FF356A';
    }
    if (!parsedThemeConfig.palette) {
        parsedThemeConfig.palette = [parsedThemeConfig.colorPrimary];
    }
    return parsedThemeConfig;
}
function generateColors(colorPrimary, background = '#fff') {
    return (0, themes_1.generateThemeColors)({
        colorPrimary,
        isDarkMode: (0, utils_1.isDarkColor)(background),
        colorBg: background,
    });
}
