"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeOptions = mergeOptions;
exports.cloneOptions = cloneOptions;
exports.isCompleteParsedInfographicOptions = isCompleteParsedInfographicOptions;
const lodash_es_1 = require("lodash-es");
const utils_1 = require("../utils");
function mergeOptions(object, source) {
    const base = Object.assign(Object.assign({}, object), source);
    if (object.design || source.design) {
        base.design = Object.assign(Object.assign({}, object.design), source.design);
    }
    if (object.themeConfig || source.themeConfig) {
        base.themeConfig = Object.assign(Object.assign({}, object.themeConfig), source.themeConfig);
    }
    if (object.svg || source.svg) {
        base.svg = Object.assign(Object.assign({}, object.svg), source.svg);
    }
    return base;
}
function cloneOptions(options) {
    const cloned = Object.assign({}, options);
    if (cloned.data)
        cloned.data = (0, lodash_es_1.cloneDeep)(cloned.data);
    if (cloned.elements)
        cloned.elements = (0, lodash_es_1.cloneDeep)(cloned.elements);
    return cloned;
}
function isCompleteParsedInfographicOptions(options) {
    const { design, data } = options;
    if (!design)
        return false;
    if (!(0, utils_1.isNonNullableParsedDesignsOptions)(design))
        return false;
    if (!data)
        return false;
    if (!Array.isArray(data.items) || data.items.length < 1)
        return false;
    return true;
}
