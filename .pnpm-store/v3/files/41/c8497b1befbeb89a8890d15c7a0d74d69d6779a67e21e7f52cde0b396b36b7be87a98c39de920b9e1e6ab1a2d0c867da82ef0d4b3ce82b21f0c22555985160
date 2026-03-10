import { isIconElement } from './recognizer.js';
export function setElementRole(element, role) {
    element.setAttribute('data-element-type', role);
}
export function getElementByRole(element, role) {
    return element.querySelector(`[data-element-type="${role}"]`);
}
export function getElementRole(element) {
    if (isIconElement(element))
        return "item-icon" /* ElementTypeEnum.ItemIcon */;
    return (element.getAttribute('data-element-type') ||
        "unknown" /* ElementTypeEnum.Unknown */);
}
