import isArray from './is-array.js';
import isObject from './is-object.js';

function each$1(elements, func) {
    if (!elements) {
        return;
    }
    var rst;
    if (isArray(elements)) {
        for (var i = 0, len = elements.length; i < len; i++) {
            rst = func(elements[i], i);
            if (rst === false) {
                break;
            }
        }
    }
    else if (isObject(elements)) {
        for (var k in elements) {
            if (elements.hasOwnProperty(k)) {
                rst = func(elements[k], k);
                if (rst === false) {
                    break;
                }
            }
        }
    }
}

export { each$1 as default };
//# sourceMappingURL=each.js.map
