import { asNonCompoundGraph, buildLayerMatrix } from '../util.js';
import { findType1Conflicts, findType2Conflicts, verticalAlignment, horizontalCompaction, findSmallestWidthAlignment, alignCoordinates, balance } from './bk.js';

const positionY = (g, options) => {
    const { ranksep = 0 } = options || {};
    const layering = buildLayerMatrix(g);
    let prevY = 0;
    layering === null || layering === void 0 ? void 0 : layering.forEach((layer) => {
        const heights = layer.map((v) => g.getNode(v).data.height);
        const maxHeight = Math.max(...heights, 0);
        layer === null || layer === void 0 ? void 0 : layer.forEach((v) => {
            g.getNode(v).data.y = prevY + maxHeight / 2;
        });
        prevY += maxHeight + ranksep;
    });
};
const positionX = (g, options) => {
    const { align: graphAlign, nodesep = 0, edgesep = 0 } = options || {};
    const layering = buildLayerMatrix(g);
    const conflicts = Object.assign(findType1Conflicts(g, layering), findType2Conflicts(g, layering));
    const xss = {};
    let adjustedLayering = [];
    ['u', 'd'].forEach((vert) => {
        adjustedLayering =
            vert === 'u' ? layering : Object.values(layering).reverse();
        ['l', 'r'].forEach((horiz) => {
            if (horiz === 'r') {
                adjustedLayering = adjustedLayering.map((inner) => Object.values(inner).reverse());
            }
            const neighborFn = (vert === 'u' ? g.getPredecessors : g.getSuccessors).bind(g);
            const align = verticalAlignment(g, adjustedLayering, conflicts, neighborFn);
            const xs = horizontalCompaction(g, adjustedLayering, align.root, align.align, nodesep, edgesep, horiz === 'r');
            if (horiz === 'r') {
                Object.keys(xs).forEach((xsKey) => (xs[xsKey] = -xs[xsKey]));
            }
            xss[vert + horiz] = xs;
        });
    });
    const smallestWidth = findSmallestWidthAlignment(g, xss);
    smallestWidth && alignCoordinates(xss, smallestWidth);
    return balance(xss, graphAlign);
};
const position = (g, options) => {
    var _a;
    const ng = asNonCompoundGraph(g);
    positionY(ng, options);
    const xs = positionX(ng, options);
    (_a = Object.keys(xs)) === null || _a === void 0 ? void 0 : _a.forEach((key) => {
        ng.getNode(key).data.x = xs[key];
    });
};

export { position };
//# sourceMappingURL=index.js.map
