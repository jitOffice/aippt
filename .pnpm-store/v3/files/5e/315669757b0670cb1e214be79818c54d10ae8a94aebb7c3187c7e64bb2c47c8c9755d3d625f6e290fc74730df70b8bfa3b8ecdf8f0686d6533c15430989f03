import get from '../node_modules/@antv/util/esm/lodash/get.js';
import set from '../node_modules/@antv/util/esm/lodash/set.js';

/**
 * Get nested property value
 * For example: getNestedValue(obj, 'a.b.c') will return obj.a.b.c
 */
function getNestedValue(obj, path) {
    const keys = String(path).split('.');
    return get(obj, keys);
}
/**
 * Set nested property value
 * For example: setNestedValue(obj, 'a.b.c', value) will set obj.a.b.c = value
 */
function setNestedValue(obj, path, value) {
    const keys = String(path).split('.');
    set(obj, keys, value);
}
/**
 * Merge objects, but undefined values in source objects will not override existing values
 * @param target - The target object
 * @param sources - Source objects to merge
 * @returns A new merged object
 *
 * @example
 * assignDefined({ a: 1, b: 2 }, { b: undefined, c: 3 })
 * // Returns: { a: 1, b: 2, c: 3 }
 */
function assignDefined(target, ...sources) {
    sources.forEach((source) => {
        if (source) {
            Object.keys(source).forEach((key) => {
                const value = source[key];
                if (value !== undefined) {
                    target[key] = value;
                }
            });
        }
    });
    return target;
}

export { assignDefined, getNestedValue, setNestedValue };
//# sourceMappingURL=object.js.map
