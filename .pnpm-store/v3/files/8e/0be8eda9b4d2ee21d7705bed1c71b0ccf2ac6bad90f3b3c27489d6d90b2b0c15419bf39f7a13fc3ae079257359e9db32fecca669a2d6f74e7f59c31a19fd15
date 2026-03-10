import { cloneDeep } from 'lodash-es';
import { isNonNullableParsedDesignsOptions } from '../utils/index.js';
export function mergeOptions(object, source) {
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
export function cloneOptions(options) {
    const cloned = Object.assign({}, options);
    if (cloned.data)
        cloned.data = cloneDeep(cloned.data);
    if (cloned.elements)
        cloned.elements = cloneDeep(cloned.elements);
    return cloned;
}
export function isCompleteParsedInfographicOptions(options) {
    const { design, data } = options;
    if (!design)
        return false;
    if (!isNonNullableParsedDesignsOptions(design))
        return false;
    if (!data)
        return false;
    if (!Array.isArray(data.items) || data.items.length < 1)
        return false;
    return true;
}
