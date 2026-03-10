/**
 * Attractive force based on Hooke's law
 * Applies spring-like forces between connected nodes
 */
function forceAttractive(dimensions = 2) {
    let preventOverlap = false;
    function force(model, accMap) {
        model.forEachEdge((edge) => {
            var _a, _b;
            const { source, target } = edge;
            const sourceNode = model.node(source);
            const targetNode = model.node(target);
            if (!sourceNode || !targetNode)
                return;
            let vecX = targetNode.x - sourceNode.x;
            let vecY = targetNode.y - sourceNode.y;
            let vecZ = dimensions === 3 ? ((_a = targetNode.z) !== null && _a !== void 0 ? _a : 0) - ((_b = sourceNode.z) !== null && _b !== void 0 ? _b : 0) : 0;
            if (!vecX && !vecY) {
                vecX = 0.01;
                vecY = 0.01;
                if (dimensions === 3 && !vecZ) {
                    vecZ = 0.01;
                }
            }
            const vecLength = Math.sqrt(vecX * vecX + vecY * vecY + vecZ * vecZ);
            if (vecLength < Number(sourceNode.size) + Number(targetNode.size))
                return;
            const direX = vecX / vecLength;
            const direY = vecY / vecLength;
            const direZ = vecZ / vecLength;
            const { linkDistance = 200, edgeStrength = 200 } = edge;
            const diff = linkDistance - vecLength;
            const param = diff * edgeStrength;
            const massSource = sourceNode.mass || 1;
            const massTarget = targetNode.mass || 1;
            // 质量占比越大，对另一端影响程度越大
            const sourceMassRatio = 1 / massSource;
            const targetMassRatio = 1 / massTarget;
            const disX = direX * param;
            const disY = direY * param;
            const disZ = direZ * param;
            accMap[source].x -= disX * sourceMassRatio;
            accMap[source].y -= disY * sourceMassRatio;
            accMap[source].z -= disZ * sourceMassRatio;
            accMap[target].x += disX * targetMassRatio;
            accMap[target].y += disY * targetMassRatio;
            accMap[target].z += disZ * targetMassRatio;
        });
    }
    force.dimensions = function (_) {
        return arguments.length ? ((dimensions = _), force) : dimensions;
    };
    force.preventOverlap = function (_) {
        return arguments.length ? ((preventOverlap = _), force) : preventOverlap;
    };
    return force;
}

export { forceAttractive };
//# sourceMappingURL=attractive.js.map
