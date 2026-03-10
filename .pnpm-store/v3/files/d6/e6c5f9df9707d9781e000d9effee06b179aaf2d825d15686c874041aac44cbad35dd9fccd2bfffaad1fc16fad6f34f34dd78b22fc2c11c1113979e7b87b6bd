import { greedyFAS } from './greedy-fas.js';

const run$2 = (g, acyclicer) => {
    const weightFn = (g) => {
        return (e) => e.data.weight || 1;
    };
    const fas = greedyFAS(g, weightFn()) ;
    fas === null || fas === void 0 ? void 0 : fas.forEach((e) => {
        const label = e.data;
        g.removeEdge(e.id);
        label.forwardName = e.data.name;
        label.reversed = true;
        g.addEdge({
            id: e.id,
            source: e.target,
            target: e.source,
            data: Object.assign({}, label),
        });
    });
};
const undo$2 = (g) => {
    g.getAllEdges().forEach((e) => {
        const label = e.data;
        if (label.reversed) {
            g.removeEdge(e.id);
            const forwardName = label.forwardName;
            delete label.reversed;
            delete label.forwardName;
            g.addEdge({
                id: e.id,
                source: e.target,
                target: e.source,
                data: Object.assign(Object.assign({}, label), { forwardName }),
            });
        }
    });
};

export { run$2 as run, undo$2 as undo };
//# sourceMappingURL=acyclic.js.map
