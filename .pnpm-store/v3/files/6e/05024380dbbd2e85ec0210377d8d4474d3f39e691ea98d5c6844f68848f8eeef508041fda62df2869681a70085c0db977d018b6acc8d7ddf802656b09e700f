export function isNonNullableParsedDesignsOptions(options) {
    const { structure, item, items } = options;
    if (!structure)
        return false;
    if (!item)
        return false;
    if (items.some((it) => !it))
        return false;
    return true;
}
