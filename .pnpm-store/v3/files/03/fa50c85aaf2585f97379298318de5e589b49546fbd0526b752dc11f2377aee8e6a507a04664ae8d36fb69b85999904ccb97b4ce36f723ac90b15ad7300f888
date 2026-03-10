const dividerRegistry = new Map();
export const registerDivider = (type, component) => {
    dividerRegistry.set(type, component);
};
export const getDividerComponent = (type) => {
    var _a;
    if (!type)
        return null;
    return (_a = dividerRegistry.get(type)) !== null && _a !== void 0 ? _a : null;
};
