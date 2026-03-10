const ITEM_REGISTRY = new Map();
export function registerItem(type, item) {
    ITEM_REGISTRY.set(type, item);
}
export function getItem(type) {
    return ITEM_REGISTRY.get(type);
}
export function getItems() {
    return Array.from(ITEM_REGISTRY.keys());
}
