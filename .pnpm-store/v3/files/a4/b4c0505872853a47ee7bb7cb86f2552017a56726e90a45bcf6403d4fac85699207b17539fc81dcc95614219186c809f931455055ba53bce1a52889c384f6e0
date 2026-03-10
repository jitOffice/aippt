"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatumByIndexes = getDatumByIndexes;
const lodash_es_1 = require("lodash-es");
/**
 * 根据 indexesKey 获取数据项
 */
function getDatumByIndexes(data, indexes) {
    if (indexes.length === 0)
        return {};
    const base = Array.isArray(data) ? data[indexes[0]] : data.items[indexes[0]];
    if (indexes.length === 1)
        return base;
    const path = indexes
        .slice(1)
        .map((i) => `children[${i}]`)
        .join('.');
    return (0, lodash_es_1.get)(base, path);
}
