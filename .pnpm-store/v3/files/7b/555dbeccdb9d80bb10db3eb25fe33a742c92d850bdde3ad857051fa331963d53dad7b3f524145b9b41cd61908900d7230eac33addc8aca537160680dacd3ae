const PALETTE_REGISTRY = new Map();
export function registerPalette(name, palette) {
    PALETTE_REGISTRY.set(name, palette);
}
export function getPalette(type) {
    return PALETTE_REGISTRY.get(type);
}
export function getPalettes() {
    return Object.fromEntries(PALETTE_REGISTRY);
}
