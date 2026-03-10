import { getIconEntity, isIconElement } from '../../utils/index.js';
export function getIndexesFromElement(element) {
    var _a, _b;
    return (((_b = (_a = getElementEntity(element)) === null || _a === void 0 ? void 0 : _a.dataset.indexes) === null || _b === void 0 ? void 0 : _b.split(',').map(Number)) || []);
}
function getElementEntity(element) {
    if (isIconElement(element))
        return getIconEntity(element);
    return element;
}
