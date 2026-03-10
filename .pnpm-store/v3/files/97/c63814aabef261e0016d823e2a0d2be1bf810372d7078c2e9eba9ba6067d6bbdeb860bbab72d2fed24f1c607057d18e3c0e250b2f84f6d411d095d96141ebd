import { D3ForceLayout, apply } from '../d3-force/index.js';
import forceZ from '../../node_modules/d3-force-3d/src/z.js';
import forceY from '../../node_modules/d3-force-3d/src/y.js';
import forceX from '../../node_modules/d3-force-3d/src/x.js';
import forceRadial from '../../node_modules/d3-force-3d/src/radial.js';
import forceCollide from '../../node_modules/d3-force-3d/src/collide.js';
import forceCenter from '../../node_modules/d3-force-3d/src/center.js';
import forceManyBody from '../../node_modules/d3-force-3d/src/manyBody.js';
import forceLink from '../../node_modules/d3-force-3d/src/link.js';
import forceSimulation from '../../node_modules/d3-force-3d/src/simulation.js';

class D3Force3DLayout extends D3ForceLayout {
    constructor() {
        super(...arguments);
        this.id = 'd3-force-3d';
        this.config = {
            simulationAttrs: [
                'alpha',
                'alphaMin',
                'alphaDecay',
                'alphaTarget',
                'velocityDecay',
                'randomSource',
                'numDimensions',
            ],
        };
        this.forceMap = {
            link: forceLink,
            manyBody: forceManyBody,
            center: forceCenter,
            collide: forceCollide,
            radial: forceRadial,
            x: forceX,
            y: forceY,
            z: forceZ,
        };
    }
    getDefaultOptions() {
        return {
            numDimensions: 3,
            link: {
                id: (edge) => edge.id,
            },
            manyBody: {},
            center: {
                x: 0,
                y: 0,
                z: 0,
            },
        };
    }
    initSimulation() {
        return forceSimulation();
    }
    setupForces(simulation, options) {
        Object.entries(this.forceMap).forEach(([name, Ctor]) => {
            const forceName = name;
            if (options[name]) {
                let force = simulation.force(forceName);
                if (!force) {
                    force = Ctor();
                    simulation.force(forceName, force);
                }
                apply(force, Object.entries(options[forceName]));
            }
            else
                simulation.force(forceName, null);
        });
    }
}

export { D3Force3DLayout };
//# sourceMappingURL=index.js.map
