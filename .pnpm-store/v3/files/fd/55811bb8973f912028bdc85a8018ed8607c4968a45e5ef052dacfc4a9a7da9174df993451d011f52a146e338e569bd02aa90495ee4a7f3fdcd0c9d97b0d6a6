import { Simulation } from 'd3-force';
import { forceLink, forceManyBody, forceCenter, forceCollide, forceRadial, forceX, forceY, forceZ } from 'd3-force-3d';
import { D3ForceLayout } from '../d3-force/index.js';
import { D3Force3DLayoutOptions, NodeDatum, EdgeDatum } from './types.js';

declare class D3Force3DLayout extends D3ForceLayout<D3Force3DLayoutOptions, NodeDatum, EdgeDatum> {
    id: string;
    protected config: {
        simulationAttrs: string[];
    };
    protected forceMap: {
        link: typeof forceLink;
        manyBody: typeof forceManyBody;
        center: typeof forceCenter;
        collide: typeof forceCollide;
        radial: typeof forceRadial;
        x: typeof forceX;
        y: typeof forceY;
        z: typeof forceZ;
    };
    protected getDefaultOptions(): Partial<D3Force3DLayoutOptions>;
    protected initSimulation(): Simulation<NodeDatum, EdgeDatum>;
    protected setupForces(simulation: Simulation<NodeDatum, EdgeDatum>, options: D3Force3DLayoutOptions): void;
}

export { D3Force3DLayout, D3Force3DLayoutOptions };
