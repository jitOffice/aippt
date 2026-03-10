"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPalette = registerPalette;
exports.getPalette = getPalette;
exports.getPalettes = getPalettes;
const PALETTE_REGISTRY = new Map();
function registerPalette(name, palette) {
    PALETTE_REGISTRY.set(name, palette);
}
function getPalette(type) {
    return PALETTE_REGISTRY.get(type);
}
function getPalettes() {
    return Object.fromEntries(PALETTE_REGISTRY);
}
