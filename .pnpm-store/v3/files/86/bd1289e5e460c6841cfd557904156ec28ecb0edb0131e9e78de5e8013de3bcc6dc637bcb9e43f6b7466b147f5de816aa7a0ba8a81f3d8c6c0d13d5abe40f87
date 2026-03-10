import isString from './is-string.js';

/**
 * https://github.com/developit/dlv/blob/master/index.js
 * @param obj
 * @param key
 * @param defaultValue
 */
var get$1 = (function (obj, key, defaultValue) {
    var p = 0;
    var keyArr = isString(key) ? key.split('.') : key;
    while (obj && p < keyArr.length) {
        obj = obj[keyArr[p++]];
    }
    return obj === undefined || p < keyArr.length ? defaultValue : obj;
});

export { get$1 as default };
//# sourceMappingURL=get.js.map
