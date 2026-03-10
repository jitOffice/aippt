import { BaseSimulation } from '../base-simulation.js';
import isNumber from '../../node_modules/@antv/util/esm/lodash/is-number.js';

class ForceSimulation extends BaseSimulation {
    constructor() {
        super(...arguments);
        this.forces = new Map();
        this.velMap = {};
    }
    data(model) {
        this.model = model;
        model.forEachNode((node) => {
            this.velMap[node.id] = { x: 0, y: 0, z: 0 };
        });
        return this;
    }
    force(name, force) {
        if (arguments.length === 1)
            return this.forces.get(name) || null;
        if (force === null)
            this.forces.delete(name);
        else if (force)
            this.forces.set(name, force);
        return force || null;
    }
    runOneStep() {
        const accMap = {};
        const nodes = this.model.nodes();
        if (!nodes.length)
            return 0;
        nodes.forEach((n) => {
            accMap[n.id] = { x: 0, y: 0, z: 0 };
        });
        this.forces.forEach((force) => {
            force(this.model, accMap);
        });
        this.updateVelocity(accMap);
        const distance = this.updatePosition();
        this.monitor(accMap, nodes);
        return distance;
    }
    setFixedPosition(nodeId, position) {
        const node = this.model.node(nodeId);
        if (!node)
            return;
        const keys = ['fx', 'fy', 'fz'];
        if (position === null) {
            keys.forEach((k) => delete node[k]);
            return;
        }
        position.forEach((v, i) => {
            if (i < keys.length && (typeof v === 'number' || v === null)) {
                node[keys[i]] = v;
            }
        });
        const vel = this.velMap[nodeId];
        if (vel) {
            vel.x = 0;
            vel.y = 0;
            vel.z = 0;
        }
    }
    updateVelocity(accMap) {
        const { damping = 0.9, maxSpeed = 100, interval = 0.02, dimensions = 2, } = this.options;
        this.model.nodes().forEach((node) => {
            const id = node.id;
            let vx = (this.velMap[id].x + accMap[id].x * interval) * damping;
            let vy = (this.velMap[id].y + accMap[id].y * interval) * damping;
            let vz = dimensions === 3
                ? (this.velMap[id].z + accMap[id].z * interval) * damping
                : 0;
            const vLen = Math.sqrt(vx * vx + vy * vy + vz * vz);
            if (vLen > maxSpeed) {
                const k = maxSpeed / vLen;
                vx *= k;
                vy *= k;
                vz *= k;
            }
            this.velMap[id] = { x: vx, y: vy, z: vz };
        });
    }
    updatePosition() {
        const { distanceThresholdMode = 'mean', interval = 0.02, dimensions = 2, } = this.options;
        const nodes = this.model.nodes();
        let sum = 0;
        let judge = distanceThresholdMode === 'max'
            ? -Infinity
            : distanceThresholdMode === 'min'
                ? Infinity
                : 0;
        nodes.forEach((node) => {
            const id = node.id;
            if (isNumber(node.fx) && isNumber(node.fy)) {
                node.x = node.fx;
                node.y = node.fy;
                if (dimensions === 3 && isNumber(node.fz))
                    node.z = node.fz;
                return;
            }
            const dx = this.velMap[id].x * interval;
            const dy = this.velMap[id].y * interval;
            const dz = dimensions === 3 ? this.velMap[id].z * interval : 0;
            node.x += dx;
            node.y += dy;
            if (dimensions === 3)
                node.z = (node.z || 0) + dz;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (distanceThresholdMode === 'max')
                judge = Math.max(judge, dist);
            else if (distanceThresholdMode === 'min')
                judge = Math.min(judge, dist);
            else
                sum += dist;
        });
        return distanceThresholdMode === 'mean' ? sum / nodes.length : judge;
    }
    monitor(accMap, nodes) {
        const { monitor, dimensions = 2 } = this.options;
        if (!monitor)
            return;
        let energy = 0;
        nodes.forEach((node) => {
            const a = accMap[node.id];
            const v2 = a.x * a.x + a.y * a.y + (dimensions === 3 ? a.z * a.z : 0);
            energy += (node.mass || 1) * v2 * 0.5;
        });
        monitor({
            energy,
            nodes,
            edges: this.model.edges(),
            iterations: this.iteration,
        });
    }
}

export { ForceSimulation };
//# sourceMappingURL=simulation.js.map
