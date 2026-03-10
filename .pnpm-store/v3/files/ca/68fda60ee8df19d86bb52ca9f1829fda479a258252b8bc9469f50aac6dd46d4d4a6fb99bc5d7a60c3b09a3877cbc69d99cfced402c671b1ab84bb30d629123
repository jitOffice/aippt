"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChildrenDataByIndexes = getChildrenDataByIndexes;
exports.buildItemPath = buildItemPath;
const utils_1 = require("../../utils");
/**
 * 获取数据项的子数据
 */
function getChildrenDataByIndexes(data, indexes) {
    if (indexes.length === 0)
        return data.items;
    const datum = (0, utils_1.getDatumByIndexes)(data, indexes);
    if (datum == null)
        return [];
    datum.children || (datum.children = []);
    return datum.children;
}
/**
 * Build lodash-style path for an item based on indexes.
 * Example: [1,2] -> data.items[1].children[2]
 */
function buildItemPath(indexes, prefix = 'data.items') {
    return indexes.reduce((path, idx, i) => i === 0 ? `${path}[${idx}]` : `${path}.children[${idx}]`, prefix);
}
