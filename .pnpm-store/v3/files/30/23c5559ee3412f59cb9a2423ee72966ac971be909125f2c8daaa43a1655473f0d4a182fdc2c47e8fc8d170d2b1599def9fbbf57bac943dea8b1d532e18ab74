"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerItem = registerItem;
exports.getItem = getItem;
exports.getItems = getItems;
const ITEM_REGISTRY = new Map();
function registerItem(type, item) {
    ITEM_REGISTRY.set(type, item);
}
function getItem(type) {
    return ITEM_REGISTRY.get(type);
}
function getItems() {
    return Array.from(ITEM_REGISTRY.keys());
}
