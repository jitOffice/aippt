const TEMPLATE_REGISTRY = new Map();
export function registerTemplate(type, template) {
    TEMPLATE_REGISTRY.set(type, template);
}
export function getTemplate(type) {
    return TEMPLATE_REGISTRY.get(type);
}
export function getTemplates() {
    return Array.from(TEMPLATE_REGISTRY.keys());
}
