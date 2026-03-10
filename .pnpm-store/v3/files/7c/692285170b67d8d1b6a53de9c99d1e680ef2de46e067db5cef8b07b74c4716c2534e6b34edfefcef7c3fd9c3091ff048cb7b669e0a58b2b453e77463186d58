import { getDatumByIndexes } from '../../utils/index.js';
/**
 * 获取数据项的子数据
 */
export function getChildrenDataByIndexes(data, indexes) {
    if (indexes.length === 0)
        return data.items;
    const datum = getDatumByIndexes(data, indexes);
    if (datum == null)
        return [];
    datum.children || (datum.children = []);
    return datum.children;
}
/**
 * Build lodash-style path for an item based on indexes.
 * Example: [1,2] -> data.items[1].children[2]
 */
export function buildItemPath(indexes, prefix = 'data.items') {
    return indexes.reduce((path, idx, i) => i === 0 ? `${path}[${idx}]` : `${path}.children[${idx}]`, prefix);
}
