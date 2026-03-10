"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setElementRole = setElementRole;
exports.getElementByRole = getElementByRole;
exports.getElementRole = getElementRole;
const recognizer_1 = require("./recognizer");
function setElementRole(element, role) {
    element.setAttribute('data-element-type', role);
}
function getElementByRole(element, role) {
    return element.querySelector(`[data-element-type="${role}"]`);
}
function getElementRole(element) {
    if ((0, recognizer_1.isIconElement)(element))
        return "item-icon" /* ElementTypeEnum.ItemIcon */;
    return (element.getAttribute('data-element-type') ||
        "unknown" /* ElementTypeEnum.Unknown */);
}
