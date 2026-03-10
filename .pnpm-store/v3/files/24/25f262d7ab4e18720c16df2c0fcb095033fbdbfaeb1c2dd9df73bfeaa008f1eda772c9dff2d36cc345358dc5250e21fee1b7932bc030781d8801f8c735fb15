import { isEditArea, isEditableText, isForeignObjectElement, isIconElement, isItemIcon, isItemIconGroup, isRoughElement, isRoughVolume, isTextEntity, } from '../../utils/index.js';
export function getEventTarget(element) {
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
export function getSelectableTarget(element) {
    if (!element)
        return null;
    const recognizers = [getTextEventTarget, getIconEventTarget];
    for (const fn of recognizers) {
        const result = fn(element);
        if (result) {
            return result;
        }
    }
    if (isEditArea(element)) {
        return element;
    }
    if (isEditableText(element) || isIconElement(element)) {
        return element;
    }
    return null;
}
const getRoughEventTarget = (element) => {
    var _a;
    const is = (ele) => {
        if (!ele)
            return false;
        return isRoughElement(ele) || isRoughVolume(ele);
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
    if (isTextEntity(element) && isForeignObjectElement(element.parentElement)) {
        return element.parentElement;
    }
    return null;
};
const getIconEventTarget = (element) => {
    const parent = element.parentElement;
    if (isItemIconGroup(parent)) {
        return parent;
    }
    if (isItemIcon(element)) {
        return element;
    }
    return null;
};
export function isTextSelectionTarget(target) {
    if (!(target instanceof HTMLElement))
        return false;
    if (target.isContentEditable)
        return true;
    const tag = target.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea';
}
