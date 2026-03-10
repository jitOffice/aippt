"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemIndexes = exports.getIndexesFromItemKey = void 0;
// 常量定义
const DEFAULT_SEPARATOR = ',';
/**
 * 将项目键值转换为索引数组（从0开始）
 * @param key - 项目键值，如 '0,1,2'
 * @param separator - 分隔符，默认为 ','
 * @example getIndexesFromItemKey('0,1,2') => [0, 1, 2]
 */
const getIndexesFromItemKey = (key, separator = DEFAULT_SEPARATOR) => {
    return key.split(separator).map((value) => parseInt(value, 10));
};
exports.getIndexesFromItemKey = getIndexesFromItemKey;
/**
 * 从项目 dataset.indexes 中获取索引数组
 * @example getItemIndexes('1,2,3') => [0, 1, 2]
 */
const getItemIndexes = (indexesStr) => {
    return (0, exports.getIndexesFromItemKey)(indexesStr);
};
exports.getItemIndexes = getItemIndexes;
