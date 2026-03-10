import quadtree from '../../node_modules/d3-quadtree/src/quadtree.js';
import octree from '../../node_modules/d3-octree/src/octree.js';

/**
 * Repulsive force based on Coulomb's law
 * Uses Barnes-Hut optimization with quadtree/octree
 */
function forceRepulsive(factor = 1, coulombDisScale = 0.005, dimensions = 2) {
    function force(model, accMap) {
        const coulombDisScale2 = coulombDisScale * coulombDisScale;
        forceNBody(model, factor, coulombDisScale2, accMap, dimensions);
    }
    force.factor = function (_) {
        return arguments.length ? ((factor = _), force) : factor;
    };
    force.coulombDisScale = function (_) {
        return arguments.length ? ((coulombDisScale = _), force) : coulombDisScale;
    };
    force.dimensions = function (_) {
        return arguments.length ? ((dimensions = _), force) : dimensions;
    };
    return force;
}
const theta2 = 0.81; // Barnes-Hut approximation threshold
const epsilon = 0.1; // 为了防止出现除0的情况，加一个epsilon
function forceNBody(model, factor, coulombDisScale2, accMap, dimensions = 2) {
    const weightParam = factor / coulombDisScale2;
    const nodes = model.nodes();
    const data = nodes.map((node, i) => {
        const { nodeStrength, x, y, z, size, mass } = node;
        return {
            x,
            y,
            z,
            size,
            index: i,
            id: node.id,
            vx: 0,
            vy: 0,
            vz: 0,
            weight: weightParam * nodeStrength,
            mass: mass || 1,
        };
    });
    const tree = (dimensions === 2
        ? quadtree(data, (d) => d.x, (d) => d.y)
        : octree(data, (d) => d.x, (d) => d.y, (d) => d.z)).visitAfter(accumulate); // init internal node
    const nodeMap = new Map();
    data.forEach((n) => {
        nodeMap.set(n.id, n);
        // @ts-ignore
        computeForce(n, tree, dimensions);
    });
    data.map((n) => {
        const id = n.id;
        // 从 0 开始，= 初始化 + 加斥力
        accMap[id] = {
            x: n.vx / n.mass,
            y: n.vy / n.mass,
            z: n.vz / n.mass,
        };
    });
    return accMap;
}
function accumulate(treeNode) {
    let accWeight = 0;
    let accX = 0;
    let accY = 0;
    let accZ = 0;
    let accSize = 0;
    const numChildren = treeNode.length;
    if (numChildren) {
        // internal node, accumulate 4 child quads
        for (let i = 0; i < numChildren; i++) {
            const q = treeNode[i];
            if (q && q.weight) {
                accWeight += q.weight;
                accX += q.x * q.weight;
                accY += q.y * q.weight;
                accZ += q.z * q.weight;
                accSize += q.size * q.weight;
            }
        }
        treeNode.x = accX / accWeight;
        treeNode.y = accY / accWeight;
        treeNode.z = accZ / accWeight;
        treeNode.size = accSize / accWeight;
        treeNode.weight = accWeight;
    }
    else {
        // leaf node
        const q = treeNode;
        treeNode.x = q.data.x;
        treeNode.y = q.data.y;
        treeNode.z = q.data.z;
        treeNode.size = q.data.size;
        treeNode.weight = q.data.weight;
    }
}
const apply = (treeNode, x1, arg1, arg2, arg3, arg4, arg5, node, dimensions) => {
    var _a;
    if (((_a = treeNode.data) === null || _a === void 0 ? void 0 : _a.id) === node.id)
        return;
    const x2 = dimensions === 2 ? arg2 : dimensions === 3 ? arg4 : arg1;
    const dx = node.x - treeNode.x || epsilon;
    const dy = node.y - treeNode.y || epsilon;
    const dz = node.z - treeNode.z || epsilon;
    const pos = [dx, dy, dz];
    const width = x2 - x1;
    let len2 = 0;
    for (let i = 0; i < dimensions; i++) {
        len2 += pos[i] * pos[i];
    }
    const len1 = Math.sqrt(len2);
    const len3 = len1 * len2;
    // far node, apply Barnes-Hut approximation
    if (width * width * theta2 < len2) {
        const param = treeNode.weight / len3;
        node.vx += dx * param;
        node.vy += dy * param;
        node.vz += dz * param;
        return true;
    }
    // near quad, compute force directly
    if (treeNode.length)
        return false; // internal node, visit children
    // leaf node
    if (treeNode.data !== node) {
        const param = treeNode.data.weight / len3;
        node.vx += dx * param;
        node.vy += dy * param;
        node.vz += dz * param;
    }
};
// @ts-ignore
function computeForce(node, tree, dimensions) {
    // @ts-ignore
    tree.visit((treeNode, x1, y1, arg2, arg3, arg4, arg5) => apply(treeNode, x1, y1, arg2, arg3, arg4, arg5, node, dimensions));
}

export { forceNBody, forceRepulsive };
//# sourceMappingURL=repulsive.js.map
