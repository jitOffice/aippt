"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerStructure = registerStructure;
exports.getStructure = getStructure;
exports.getStructures = getStructures;
const STRUCTURE_REGISTRY = new Map();
function registerStructure(type, structure) {
    STRUCTURE_REGISTRY.set(type, structure);
}
function getStructure(type) {
    return STRUCTURE_REGISTRY.get(type);
}
function getStructures() {
    return Array.from(STRUCTURE_REGISTRY.keys());
}
