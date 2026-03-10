"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventTarget = getEventTarget;
exports.getSelectableTarget = getSelectableTarget;
exports.isTextSelectionTarget = isTextSelectionTarget;
const utils_1 = require("../../utils");
function getEventTarget(element) {
    if (!element)
        return null;
    const preprocess = [getRoughEventTarget];
    let target = element;
    for (const fn of preprocess) {
        const result = fn(target);
        if (result) {
            target = result;
            break;
        }
    }
    return getSelectableTarget(target);
}
function getSelectableTarget(element) {
    if (!element)
        return null;
    const recognizers = [getTextEventTarget, getIconEventTarget];
    for (const fn of recognizers) {
        const result = fn(element);
        if (result) {
            return result;
        }
    }
    if ((0, utils_1.isEditArea)(element)) {
        return element;
    }
    if ((0, utils_1.isEditableText)(element) || (0, utils_1.isIconElement)(element)) {
        return element;
    }
    return null;
}
const getRoughEventTarget = (element) => {
    var _a;
    const is = (ele) => {
        if (!ele)
            return false;
        return (0, utils_1.isRoughElement)(ele) || (0, utils_1.isRoughVolume)(ele);
    };
    if (is(element)) {
        return element.parentElement;
    }
    if (is(element.parentElement)) {
        return (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    }
    return null;
};
const getTextEventTarget = (element) => {
    if ((0, utils_1.isTextEntity)(element) && (0, utils_1.isForeignObjectElement)(element.parentElement)) {
        return element.parentElement;
    }
    return null;
};
const getIconEventTarget = (element) => {
    const parent = element.parentElement;
    if ((0, utils_1.isItemIconGroup)(parent)) {
        return parent;
    }
    if ((0, utils_1.isItemIcon)(element)) {
        return element;
    }
    return null;
};
function isTextSelectionTarget(target) {
    if (!(target instanceof HTMLElement))
        return false;
    if (target.isContentEditable)
        return true;
    const tag = target.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea';
}
