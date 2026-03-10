import { GraphLib } from '../model/data.js';

class RuntimeContext {
    constructor(data, options = {}) {
        this.graph = new GraphLib(data, options);
    }
    export() {
        return this.graph.data();
    }
    replace(result) {
        this.graph.replace(result);
    }
    forEachNode(callback) {
        this.graph.forEachNode(callback);
    }
    forEachEdge(callback) {
        this.graph.forEachEdge((edge, i) => {
            edge.sourceNode = this.graph.node(edge.source);
            edge.targetNode = this.graph.node(edge.target);
            callback(edge, i);
        });
    }
    destroy() {
        this.graph.destroy();
    }
}

export { RuntimeContext };
//# sourceMappingURL=context.js.map
