"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTheme = registerTheme;
exports.getTheme = getTheme;
exports.getThemes = getThemes;
const THEME_REGISTRY = new Map();
function registerTheme(name, theme) {
    THEME_REGISTRY.set(name, theme);
}
function getTheme(name) {
    return THEME_REGISTRY.get(name);
}
function getThemes() {
    return Array.from(THEME_REGISTRY.keys());
}
