import each from './each.js';
import isPlainObject from './is-plain-object.js';

var hasOwnProperty = Object.prototype.hasOwnProperty;
var pick = (function (object, keys) {
    if (object === null || !isPlainObject(object)) {
        return {};
    }
    var result = {};
    each(keys, function (key) {
        if (hasOwnProperty.call(object, key)) {
            result[key] = object[key];
        }
    });
    return result;
});

export { pick as default };
//# sourceMappingURL=pick.js.map
