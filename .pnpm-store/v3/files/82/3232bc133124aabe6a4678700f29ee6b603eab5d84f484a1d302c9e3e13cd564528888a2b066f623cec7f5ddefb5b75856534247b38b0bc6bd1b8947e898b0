import isNumber from '../node_modules/@antv/util/esm/lodash/is-number.js';

function parseSize(size) {
    if (!size)
        return [0, 0, 0];
    if (isNumber(size))
        return [size, size, size];
    else if (Array.isArray(size) && size.length === 0)
        return [0, 0, 0];
    const [x, y = x, z = x] = size;
    return [x, y, z];
}
function isSize(value) {
    if (isNumber(value))
        return true;
    if (Array.isArray(value)) {
        return value.every((item) => isNumber(item));
    }
    return false;
}

export { isSize, parseSize };
//# sourceMappingURL=size.js.map
