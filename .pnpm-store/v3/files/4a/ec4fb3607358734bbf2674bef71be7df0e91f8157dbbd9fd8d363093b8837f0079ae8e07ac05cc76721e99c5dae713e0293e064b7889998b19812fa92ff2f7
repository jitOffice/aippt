import { __awaiter } from '../../node_modules/tslib/tslib.es6.js';
import dagre, { d as dagreExports } from '../../_virtual/index.js';
import '../../node_modules/@antv/expr/dist/index.esm.js';
import { formatSizeFn, formatNumberFn, formatFn } from '../../util/format.js';
import { parsePoint } from '../../util/point.js';
import { parseSize } from '../../util/size.js';
import { BaseLayout } from '../base-layout.js';
import isBoolean from '../../node_modules/@antv/util/esm/lodash/is-boolean.js';
import isNil from '../../node_modules/@antv/util/esm/lodash/is-nil.js';
import pick from '../../node_modules/@antv/util/esm/lodash/pick.js';

/**
 * <zh/> Dagre 布局
 *
 * <en/> Dagre layout
 */
class DagreLayout extends BaseLayout {
    constructor() {
        super(...arguments);
        this.id = 'dagre';
        this.isCompoundGraph = null;
        this.config = {
            graphAttributes: [
                'rankdir',
                'align',
                'nodesep',
                'edgesep',
                'ranksep',
                'marginx',
                'marginy',
                'acyclicer',
                'ranker',
            ],
            nodeAttributes: ['width', 'height'],
            edgeAttributes: [
                'minlen',
                'weight',
                'width',
                'height',
                'labelpos',
                'labeloffset',
            ],
        };
    }
    getDefaultOptions() {
        return {
            directed: true,
            multigraph: true,
            rankdir: 'TB',
            align: undefined,
            nodesep: 50,
            edgesep: 10,
            ranksep: 50,
            marginx: 0,
            marginy: 0,
            acyclicer: undefined,
            ranker: 'network-simplex',
            nodeSize: [0, 0],
            edgeMinLen: 1,
            edgeWeight: 1,
            edgeLabelSize: [0, 0],
            edgeLabelPos: 'r',
            edgeLabelOffset: 10,
        };
    }
    layout() {
        return __awaiter(this, void 0, void 0, function* () {
            const g = new dagreExports.graphlib.Graph({
                directed: !!this.options.directed,
                multigraph: !!this.options.multigraph,
                compound: this.isCompound(),
            });
            g.setGraph(pick(this.options, this.config.graphAttributes));
            g.setDefaultEdgeLabel(() => ({}));
            const nodeSizeFn = formatSizeFn(this.options.nodeSize, 0);
            this.model.forEachNode((node) => {
                const raw = node._original;
                const [width, height] = parseSize(nodeSizeFn(raw));
                const label = { width, height };
                g.setNode(String(node.id), label);
                if (this.isCompound()) {
                    if (isNil(node.parentId))
                        return;
                    g.setParent(String(node.id), String(node.parentId));
                }
            });
            const { edgeLabelSize, edgeLabelOffset, edgeLabelPos, edgeMinLen, edgeWeight, } = this.options;
            const edgeLabelSizeFn = formatSizeFn(edgeLabelSize, 0, 'edge');
            const edgeLabelOffsetFn = formatNumberFn(edgeLabelOffset, 10, 'edge');
            const edgeLabelPosFn = typeof edgeLabelPos === 'string'
                ? () => edgeLabelPos
                : formatFn(edgeLabelPos, ['edge']);
            const edgeMinLenFn = formatNumberFn(edgeMinLen, 1, 'edge');
            const edgeWeightFn = formatNumberFn(edgeWeight, 1, 'edge');
            this.model.forEachEdge((edge) => {
                const raw = edge._original;
                const [lw, lh] = parseSize(edgeLabelSizeFn(raw));
                const label = {
                    width: lw,
                    height: lh,
                    labelpos: edgeLabelPosFn(raw),
                    labeloffset: edgeLabelOffsetFn(raw),
                    minlen: edgeMinLenFn(raw),
                    weight: edgeWeightFn(raw),
                };
                g.setEdge(String(edge.source), String(edge.target), label, String(edge.id));
            });
            dagre.layout(g);
            this.model.forEachNode((node) => {
                const data = g.node(String(node.id));
                if (!data)
                    return;
                node.x = data.x;
                node.y = data.y;
                node.size = [data.width, data.height];
            });
            this.model.forEachEdge((edge) => {
                const data = g.edge(String(edge.source), String(edge.target), String(edge.id));
                if (!data)
                    return;
                const { width, height, weight, minlen, labelpos, labeloffset, points } = data;
                edge.labelSize = [width, height];
                edge.weight = weight;
                edge.minLen = minlen;
                edge.labelPos = labelpos;
                edge.labelOffset = labeloffset;
                edge.points = points.map(parsePoint);
            });
        });
    }
    isCompound() {
        if (this.isCompoundGraph !== null)
            return this.isCompoundGraph;
        if (isBoolean(this.options.compound)) {
            return (this.isCompoundGraph = this.options.compound);
        }
        this.isCompoundGraph = this.model
            .nodes()
            .some((node) => !isNil(node.parentId));
        return this.isCompoundGraph;
    }
}

export { DagreLayout };
//# sourceMappingURL=index.js.map
