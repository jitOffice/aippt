import isObject from './is-object.js';
import isString from './is-string.js';
import isNumber from './is-number.js';

/**
 * https://github.com/developit/dlv/blob/master/index.js
 * @param obj
 * @param path
 * @param value
 */
var set$1 = (function (obj, path, value) {
    var o = obj;
    var keyArr = isString(path) ? path.split('.') : path;
    keyArr.forEach(function (key, idx) {
        // 不是最后一个
        if (idx < keyArr.length - 1) {
            if (!isObject(o[key])) {
                o[key] = isNumber(keyArr[idx + 1]) ? [] : {};
            }
            o = o[key];
        }
        else {
            o[key] = value;
        }
    });
    return obj;
});

export { set$1 as default };
//# sourceMappingURL=set.js.map
