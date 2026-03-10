import quadtree from '../../node_modules/d3-quadtree/src/quadtree.js';
import isNumber from '../../node_modules/@antv/util/esm/lodash/is-number.js';

const EPSILON = 1e-6;
const COLLIDE_SCALE = 500;
/**
 * Collision force to prevent node overlap.
 */
function forceCollide(dimensions = 2) {
    let strength = 1;
    function force(model, accMap) {
        const nodes = model.nodes();
        if (nodes.length < 2 || strength <= 0)
            return;
        if (dimensions === 2) {
            const data = nodes.map((node, index) => {
                return {
                    id: node.id,
                    index,
                    x: node.x,
                    y: node.y,
                    r: Number(node.size) / 2,
                    mass: node.mass || 1,
                    fx: node.fx,
                    fy: node.fy,
                };
            });
            const tree = quadtree(data, (d) => d.x, (d) => d.y).visitAfter(accumulate2D);
            for (const node of data) {
                tree.visit((quad, x0, y0, x1, y1) => {
                    const quadR = quad.r || 0;
                    const searchR = node.r + quadR;
                    if (x0 > node.x + searchR ||
                        x1 < node.x - searchR ||
                        y0 > node.y + searchR ||
                        y1 < node.y - searchR) {
                        return true;
                    }
                    if (!quad.data)
                        return false;
                    let q = quad;
                    do {
                        const other = q.data;
                        if (other && other.index > node.index) {
                            collide2D(node, other, accMap);
                        }
                        q = q.next;
                    } while (q);
                    return false;
                });
            }
            return;
        }
        const data3d = nodes.map((node, index) => {
            var _a;
            return {
                id: node.id,
                index,
                x: node.x,
                y: node.y,
                z: (_a = node.z) !== null && _a !== void 0 ? _a : 0,
                r: Number(node.size) / 2,
                mass: node.mass || 1,
                fx: node.fx,
                fy: node.fy,
                fz: node.fz,
            };
        });
        for (let i = 0; i < data3d.length; i++) {
            for (let j = i + 1; j < data3d.length; j++) {
                collide3D(data3d[i], data3d[j], accMap);
            }
        }
    }
    function invMass2D(d) {
        const fixed = isNumber(d.fx) && isNumber(d.fy);
        return fixed ? 0 : 1 / (d.mass || 1);
    }
    function invMass3D(d) {
        const fixed = isNumber(d.fx) && isNumber(d.fy) && isNumber(d.fz);
        return fixed ? 0 : 1 / (d.mass || 1);
    }
    function collide2D(a, b, accMap) {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dist = Math.hypot(dx, dy);
        const minDist = a.r + b.r;
        if (dist >= minDist)
            return;
        if (dist < EPSILON) {
            dx = a.index < b.index ? EPSILON : -EPSILON;
            dy = 0;
            dist = Math.abs(dx);
        }
        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;
        const f = overlap * strength * COLLIDE_SCALE;
        const ia = invMass2D(a);
        const ib = invMass2D(b);
        if (ia) {
            accMap[a.id].x += nx * f * ia;
            accMap[a.id].y += ny * f * ia;
        }
        if (ib) {
            accMap[b.id].x -= nx * f * ib;
            accMap[b.id].y -= ny * f * ib;
        }
    }
    function collide3D(a, b, accMap) {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dz = a.z - b.z;
        let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const minDist = a.r + b.r;
        if (dist >= minDist)
            return;
        if (dist < EPSILON) {
            dx = a.index < b.index ? EPSILON : -EPSILON;
            dy = 0;
            dz = 0;
            dist = Math.abs(dx);
        }
        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;
        const nz = dz / dist;
        const f = overlap * strength * COLLIDE_SCALE;
        const ia = invMass3D(a);
        const ib = invMass3D(b);
        if (ia) {
            accMap[a.id].x += nx * f * ia;
            accMap[a.id].y += ny * f * ia;
            accMap[a.id].z += nz * f * ia;
        }
        if (ib) {
            accMap[b.id].x -= nx * f * ib;
            accMap[b.id].y -= ny * f * ib;
            accMap[b.id].z -= nz * f * ib;
        }
    }
    force.dimensions = function (_) {
        return arguments.length ? ((dimensions = _), force) : dimensions;
    };
    force.strength = function (_) {
        return arguments.length ? ((strength = _), force) : strength;
    };
    return force;
}
function accumulate2D(quad) {
    var _a;
    let r = 0;
    if (quad.length) {
        for (let i = 0; i < quad.length; i++) {
            const c = quad[i];
            if (c && c.r > r)
                r = c.r;
        }
    }
    else if (quad.data) {
        r = quad.data.r || 0;
        let next = quad.next;
        while (next) {
            r = Math.max(r, ((_a = next.data) === null || _a === void 0 ? void 0 : _a.r) || 0);
            next = next.next;
        }
    }
    quad.r = r;
}

export { forceCollide };
//# sourceMappingURL=collide.js.map
