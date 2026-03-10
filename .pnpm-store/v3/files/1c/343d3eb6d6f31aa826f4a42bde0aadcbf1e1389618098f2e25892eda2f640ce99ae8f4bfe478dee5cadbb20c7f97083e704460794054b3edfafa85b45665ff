"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexesFromElement = getIndexesFromElement;
const utils_1 = require("../../utils");
function getIndexesFromElement(element) {
    var _a, _b;
    return (((_b = (_a = getElementEntity(element)) === null || _a === void 0 ? void 0 : _a.dataset.indexes) === null || _b === void 0 ? void 0 : _b.split(',').map(Number)) || []);
}
function getElementEntity(element) {
    if ((0, utils_1.isIconElement)(element))
        return (0, utils_1.getIconEntity)(element);
    return element;
}
