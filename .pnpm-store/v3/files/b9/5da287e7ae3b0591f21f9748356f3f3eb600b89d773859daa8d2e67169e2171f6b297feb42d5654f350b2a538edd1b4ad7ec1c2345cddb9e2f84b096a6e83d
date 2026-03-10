/**
 * Viewport configuration such as width, height and center point.
 */
const normalizeViewport = (options) => {
    const { width, height, center } = options;
    const normalizedWidth = width !== null && width !== void 0 ? width : (typeof window !== 'undefined' ? window.innerWidth : 0);
    const normalizedHeight = height !== null && height !== void 0 ? height : (typeof window !== 'undefined' ? window.innerHeight : 0);
    const centerPoint = center !== null && center !== void 0 ? center : [normalizedWidth / 2, normalizedHeight / 2];
    return {
        width: normalizedWidth,
        height: normalizedHeight,
        center: centerPoint,
    };
};

export { normalizeViewport };
//# sourceMappingURL=viewport.js.map
