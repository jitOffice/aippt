"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDividerComponent = exports.registerDivider = void 0;
const dividerRegistry = new Map();
const registerDivider = (type, component) => {
    dividerRegistry.set(type, component);
};
exports.registerDivider = registerDivider;
const getDividerComponent = (type) => {
    var _a;
    if (!type)
        return null;
    return (_a = dividerRegistry.get(type)) !== null && _a !== void 0 ? _a : null;
};
exports.getDividerComponent = getDividerComponent;
