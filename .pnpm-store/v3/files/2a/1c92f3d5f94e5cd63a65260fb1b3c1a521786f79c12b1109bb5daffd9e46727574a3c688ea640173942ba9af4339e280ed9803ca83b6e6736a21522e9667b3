import isNumber from '../../node_modules/@antv/util/esm/lodash/is-number.js';

/**
 * Centripetal force with different strengths for leaf, single, and other nodes
 * Unique feature of Force layout
 */
function forceCentripetal(options) {
    let centripetalOptions;
    let width = 800;
    let height = 600;
    function force(model, accMap) {
        if (!centripetalOptions)
            return;
        const { leaf, single, others, center: centriCenter } = centripetalOptions;
        const nodes = model.nodes();
        const edges = model.edges();
        // Convert LayoutNode[] to Node[] for callback compatibility
        const nodesForCallback = nodes.map((n) => (Object.assign(Object.assign({}, n), { data: n.data || {} })));
        const edgesForCallback = edges.map((e) => (Object.assign(Object.assign({}, e), { data: e.data || {} })));
        model.forEachNode((node) => {
            const { id, mass, x, y, z = 0, data } = node;
            const inDegree = model.degree(id, 'in');
            const outDegree = model.degree(id, 'out');
            const degree = model.degree(id, 'both');
            // Create Node type from LayoutNode for callback compatibility
            const nodeForCallback = Object.assign(Object.assign({}, node), { data: data || {} });
            const { x: centriX, y: centriY, z: centriZ, centerStrength, } = (centriCenter === null || centriCenter === void 0 ? void 0 : centriCenter(nodeForCallback, nodesForCallback, edgesForCallback, width, height)) || {
                x: 0,
                y: 0,
                z: 0,
                centerStrength: 0,
            };
            if (!isNumber(centriX) || !isNumber(centriY))
                return;
            const vx = (x - centriX) / mass;
            const vy = (y - centriY) / mass;
            const vz = (z - (centriZ || 0)) / mass;
            if (centerStrength) {
                accMap[id].x -= centerStrength * vx;
                accMap[id].y -= centerStrength * vy;
                accMap[id].z -= centerStrength * vz;
            }
            // 孤点
            if (degree === 0) {
                const singleStrength = single(nodeForCallback);
                if (!singleStrength)
                    return;
                accMap[id].x -= singleStrength * vx;
                accMap[id].y -= singleStrength * vy;
                accMap[id].z -= singleStrength * vz;
                return;
            }
            // 没有出度或没有入度，都认为是叶子节点
            if (inDegree === 0 || outDegree === 0) {
                const leafStrength = leaf(nodeForCallback, nodesForCallback, edgesForCallback);
                if (!leafStrength)
                    return;
                accMap[id].x -= leafStrength * vx;
                accMap[id].y -= leafStrength * vy;
                accMap[id].z -= leafStrength * vz;
                return;
            }
            // others
            const othersStrength = others(nodeForCallback);
            if (!othersStrength)
                return;
            accMap[id].x -= othersStrength * vx;
            accMap[id].y -= othersStrength * vy;
            accMap[id].z -= othersStrength * vz;
        });
    }
    force.options = function (_) {
        return arguments.length
            ? ((centripetalOptions = _), force)
            : centripetalOptions;
    };
    force.width = function (_) {
        return arguments.length ? ((width = _), force) : width;
    };
    force.height = function (_) {
        return arguments.length ? ((height = _), force) : height;
    };
    return force;
}

export { forceCentripetal };
//# sourceMappingURL=centripetal.js.map
