import { get } from 'lodash-es';
/**
 * 根据 indexesKey 获取数据项
 */
export function getDatumByIndexes(data, indexes) {
    if (indexes.length === 0)
        return {};
    const base = Array.isArray(data) ? data[indexes[0]] : data.items[indexes[0]];
    if (indexes.length === 1)
        return base;
    const path = indexes
        .slice(1)
        .map((i) => `children[${i}]`)
        .join('.');
    return get(base, path);
}
