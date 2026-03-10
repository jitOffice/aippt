/**
 * 针对多选时，获取多个属性中相同的属性值
 */
export function getSelectionAttrs(attrs) {
    if (!attrs.length)
        return {};
    return Object.keys(attrs[0]).reduce((acc, key) => {
        const k = key;
        if (attrs.every((attr) => attr[k] === attrs[0][k])) {
            acc[k] = attrs[0][k];
        }
        return acc;
    }, {});
}
