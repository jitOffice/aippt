/**
 * Gravity force toward center
 * Pulls all nodes toward a specified center point
 */
function forceGravity(center = [0, 0, 0], gravity = 10) {
    let getCenter;
    function force(model, accMap) {
        const nodes = model.nodes();
        if (!nodes)
            return;
        model.forEachNode((node) => {
            const { id, mass, x, y, z = 0 } = node;
            let vecX = 0;
            let vecY = 0;
            let vecZ = 0;
            let currentGravity = gravity;
            const degree = model.degree(id);
            const forceCenter = getCenter === null || getCenter === void 0 ? void 0 : getCenter(node, degree);
            if (forceCenter) {
                const [centerX, centerY, strength] = forceCenter;
                vecX = x - centerX;
                vecY = y - centerY;
                currentGravity = strength;
            }
            else {
                vecX = x - center[0];
                vecY = y - center[1];
                vecZ = z - (center[2] || 0);
            }
            if (currentGravity) {
                accMap[id].x -= (currentGravity * vecX) / mass;
                accMap[id].y -= (currentGravity * vecY) / mass;
                accMap[id].z -= (currentGravity * vecZ) / mass;
            }
        });
    }
    force.center = function (_) {
        return arguments.length ? ((center = _), force) : center;
    };
    force.gravity = function (_) {
        return arguments.length ? ((gravity = _), force) : gravity;
    };
    force.getCenter = function (_) {
        return arguments.length ? ((getCenter = _), force) : getCenter;
    };
    return force;
}

export { forceGravity };
//# sourceMappingURL=gravity.js.map
