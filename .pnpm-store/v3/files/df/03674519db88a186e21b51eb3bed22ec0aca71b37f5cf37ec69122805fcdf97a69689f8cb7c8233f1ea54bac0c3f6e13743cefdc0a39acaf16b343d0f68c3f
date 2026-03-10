const STRUCTURE_REGISTRY = new Map();
export function registerStructure(type, structure) {
    STRUCTURE_REGISTRY.set(type, structure);
}
export function getStructure(type) {
    return STRUCTURE_REGISTRY.get(type);
}
export function getStructures() {
    return Array.from(STRUCTURE_REGISTRY.keys());
}
