import isNil from './is-nil.js';
import isArrayLike from './is-array-like.js';
import getType from './get-type.js';
import isPrototype from './is-prototype.js';

var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
function isEmpty(value) {
    /**
     * isEmpty(null) => true
     * isEmpty() => true
     * isEmpty(true) => true
     * isEmpty(1) => true
     * isEmpty([1, 2, 3]) => false
     * isEmpty('abc') => false
     * isEmpty({ a: 1 }) => false
     */
    if (isNil(value)) {
        return true;
    }
    if (isArrayLike(value)) {
        return !value.length;
    }
    var type = getType(value);
    if (type === 'Map' || type === 'Set') {
        return !value.size;
    }
    if (isPrototype(value)) {
        return !Object.keys(value).length;
    }
    for (var key in value) {
        if (hasOwnProperty$1.call(value, key)) {
            return false;
        }
    }
    return true;
}

export { isEmpty as default };
//# sourceMappingURL=is-empty.js.map
