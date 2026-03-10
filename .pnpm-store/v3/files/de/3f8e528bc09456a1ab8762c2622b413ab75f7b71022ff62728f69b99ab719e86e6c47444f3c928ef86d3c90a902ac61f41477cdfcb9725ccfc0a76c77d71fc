"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTemplate = registerTemplate;
exports.getTemplate = getTemplate;
exports.getTemplates = getTemplates;
const TEMPLATE_REGISTRY = new Map();
function registerTemplate(type, template) {
    TEMPLATE_REGISTRY.set(type, template);
}
function getTemplate(type) {
    return TEMPLATE_REGISTRY.get(type);
}
function getTemplates() {
    return Array.from(TEMPLATE_REGISTRY.keys());
}
