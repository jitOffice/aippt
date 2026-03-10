const THEME_REGISTRY = new Map();
export function registerTheme(name, theme) {
    THEME_REGISTRY.set(name, theme);
}
export function getTheme(name) {
    return THEME_REGISTRY.get(name);
}
export function getThemes() {
    return Array.from(THEME_REGISTRY.keys());
}
