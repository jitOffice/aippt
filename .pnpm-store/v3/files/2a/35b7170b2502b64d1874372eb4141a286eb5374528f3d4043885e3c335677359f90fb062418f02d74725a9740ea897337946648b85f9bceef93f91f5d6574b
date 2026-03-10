import { __awaiter } from '../../node_modules/tslib/tslib.es6.js';
import '../../node_modules/@antv/expr/dist/index.esm.js';
import { formatNodeSizeFn, formatNumberFn } from '../../util/format.js';
import { parsePoint } from '../../util/point.js';
import { BaseLayout } from '../base-layout.js';
import { DagreGraph } from './graph.js';
import { layout } from './layout.js';
import isNumber from '../../node_modules/@antv/util/esm/lodash/is-number.js';

const DEFAULTS_LAYOUT_OPTIONS$8 = {
    nodeSize: 10,
    nodeSpacing: 0,
    rankdir: 'TB',
    nodesep: 50,
    ranksep: 50,
    edgeLabelSpace: true,
    ranker: 'tight-tree',
    controlPoints: false,
    radial: false,
    focusNode: null, // radial 为 true 时生效，关注的节点
};
/**
 * <zh/> AntV 实现的 Dagre 布局
 *
 * <en/> AntV implementation of Dagre layout
 */
class AntVDagreLayout extends BaseLayout {
    constructor() {
        super(...arguments);
        this.id = 'antv-dagre';
    }
    getDefaultOptions() {
        return DEFAULTS_LAYOUT_OPTIONS$8;
    }
    layout(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nodeSize, nodeSpacing, align, rankdir = 'TB', ranksep, nodesep, edgeLabelSpace, ranker = 'tight-tree', nodeOrder, begin, controlPoints, radial, sortByCombo, 
            // focusNode,
            preset, ranksepFunc, nodesepFunc, } = options;
            const ranksepfunc = formatNumberFn(ranksepFunc, ranksep !== null && ranksep !== void 0 ? ranksep : 50, 'node');
            const nodesepfunc = formatNumberFn(nodesepFunc, nodesep !== null && nodesep !== void 0 ? nodesep : 50, 'node');
            let horisep = nodesepfunc;
            let vertisep = ranksepfunc;
            if (rankdir === 'LR' || rankdir === 'RL') {
                horisep = ranksepfunc;
                vertisep = nodesepfunc;
            }
            // Create internal graph
            const g = new DagreGraph({ tree: [] });
            // copy graph to g
            const nodes = this.model.nodes();
            const edges = this.model.edges();
            const sizeFn = formatNodeSizeFn(nodeSize, nodeSpacing, DEFAULTS_LAYOUT_OPTIONS$8.nodeSize, DEFAULTS_LAYOUT_OPTIONS$8.nodeSpacing);
            nodes.forEach((node) => {
                var _a;
                const raw = node._original;
                const size = sizeFn(raw);
                const verti = vertisep(raw);
                const hori = horisep(raw);
                const width = size[0] + 2 * hori;
                const height = size[1] + 2 * verti;
                const layer = (_a = node.data) === null || _a === void 0 ? void 0 : _a.layer;
                if (isNumber(layer)) {
                    // 如果有layer属性，加入到node的label中
                    g.addNode({
                        id: node.id,
                        data: {
                            width,
                            height,
                            layer,
                            originalWidth: size[0],
                            originalHeight: size[1],
                        },
                    });
                }
                else {
                    g.addNode({
                        id: node.id,
                        data: {
                            width,
                            height,
                            originalWidth: size[0],
                            originalHeight: size[1],
                        },
                    });
                }
            });
            edges.forEach((edge) => {
                g.addEdge({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    data: {},
                });
            });
            if (sortByCombo) {
                g.attachTreeStructure('combo');
                nodes.forEach((node) => {
                    const parentId = node === null || node === void 0 ? void 0 : node.parentId;
                    if (parentId === undefined)
                        return;
                    if (g.hasNode(parentId)) {
                        g.setParent(node.id, parentId, 'combo');
                    }
                });
            }
            let prevGraph = null;
            if (preset === null || preset === void 0 ? void 0 : preset.length) {
                prevGraph = new DagreGraph();
                preset.forEach((node) => {
                    prevGraph.addNode({
                        id: node.id,
                        data: node.data,
                    });
                });
            }
            layout(g, {
                prevGraph,
                edgeLabelSpace,
                keepNodeOrder: !!nodeOrder,
                nodeOrder: nodeOrder || [],
                acyclicer: 'greedy',
                ranker,
                rankdir,
                nodesep,
                align,
            });
            const layoutTopLeft = [0, 0];
            if (begin) {
                let minX = Infinity;
                let minY = Infinity;
                g.getAllNodes().forEach((node) => {
                    if (minX > node.data.x)
                        minX = node.data.x;
                    if (minY > node.data.y)
                        minY = node.data.y;
                });
                g.getAllEdges().forEach((edge) => {
                    var _a;
                    (_a = edge.data.points) === null || _a === void 0 ? void 0 : _a.forEach((point) => {
                        if (minX > point.x)
                            minX = point.x;
                        if (minY > point.y)
                            minY = point.y;
                    });
                });
                layoutTopLeft[0] = begin[0] - minX;
                layoutTopLeft[1] = begin[1] - minY;
            }
            const isHorizontal = rankdir === 'LR' || rankdir === 'RL';
            if (radial) ;
            else {
                const layerCoords = new Set();
                const isInvert = rankdir === 'BT' || rankdir === 'RL';
                const layerCoordSort = isInvert
                    ? (a, b) => b - a
                    : (a, b) => a - b;
                g.getAllNodes().forEach((node) => {
                    // let ndata: any = this.nodeMap[node];
                    // if (!ndata) {
                    //   ndata = combos?.find((it) => it.id === node);
                    // }
                    // if (!ndata) return;
                    // ndata.x = node.data.x! + dBegin[0];
                    // ndata.y = node.data.y! + dBegin[1];
                    // //  pass layer order to data for increment layout use
                    // ndata._order = node.data._order;
                    // layerCoords.add(isHorizontal ? ndata.x : ndata.y);
                    node.data.x = node.data.x + layoutTopLeft[0];
                    node.data.y = node.data.y + layoutTopLeft[1];
                    layerCoords.add(isHorizontal ? node.data.x : node.data.y);
                });
                const layerCoordsArr = Array.from(layerCoords).sort(layerCoordSort);
                // pre-define the isHorizontal related functions to avoid redundant calc in interations
                const isDifferentLayer = isHorizontal
                    ? (point1, point2) => point1.x !== point2.x
                    : (point1, point2) => point1.y !== point2.y;
                const filterControlPointsOutOfBoundary = isHorizontal
                    ? (ps, point1, point2) => {
                        const max = Math.max(point1.y, point2.y);
                        const min = Math.min(point1.y, point2.y);
                        return ps.filter((point) => point.y <= max && point.y >= min);
                    }
                    : (ps, point1, point2) => {
                        const max = Math.max(point1.x, point2.x);
                        const min = Math.min(point1.x, point2.x);
                        return ps.filter((point) => point.x <= max && point.x >= min);
                    };
                g.getAllEdges().forEach((edge, i) => {
                    var _a;
                    // const i = edges.findIndex((it) => {
                    //   return it.source === edge.source && it.target === edge.target;
                    // });
                    // if (i <= -1) return;
                    if (edgeLabelSpace && controlPoints && edge.data.type !== 'loop') {
                        edge.data.controlPoints = getControlPoints((_a = edge.data.points) === null || _a === void 0 ? void 0 : _a.map(({ x, y }) => ({
                            x: x + layoutTopLeft[0],
                            y: y + layoutTopLeft[1],
                        })), g.getNode(edge.source), g.getNode(edge.target), layerCoordsArr, isHorizontal, isDifferentLayer, filterControlPointsOutOfBoundary);
                    }
                });
            }
            this.model.forEachNode((node) => {
                const layoutNode = g.getNode(node.id);
                if (layoutNode) {
                    const { x, y, width, height, originalWidth, originalHeight } = layoutNode.data;
                    const children = sortByCombo
                        ? g.getChildren(node.id, 'combo')
                        : g.getChildren(node.id);
                    const hasChildren = children.length > 0;
                    if (hasChildren) {
                        let minX = Infinity, maxX = -Infinity;
                        let minY = Infinity, maxY = -Infinity;
                        children.forEach((child) => {
                            const childId = child.id;
                            const childNode = g.getNode(childId);
                            if (childNode === null || childNode === void 0 ? void 0 : childNode.data) {
                                const childX = childNode.data.x;
                                const childY = childNode.data.y;
                                const childWidth = childNode.data.originalWidth || childNode.data.width || 0;
                                const childHeight = childNode.data.originalHeight || childNode.data.height || 0;
                                minX = Math.min(minX, childX - childWidth / 2);
                                maxX = Math.max(maxX, childX + childWidth / 2);
                                minY = Math.min(minY, childY - childHeight / 2);
                                maxY = Math.max(maxY, childY + childHeight / 2);
                            }
                        });
                        const padding = 20;
                        const groupWidth = (maxX - minX || 0) + padding * 2;
                        const groupHeight = (maxY - minY || 0) + padding * 2;
                        node.x = (minX + maxX) / 2;
                        node.y = (minY + maxY) / 2;
                        node.size = [groupWidth, groupHeight];
                    }
                    else {
                        node.x = x;
                        node.y = y;
                        node.size = [originalWidth, originalHeight];
                    }
                }
            });
            this.model.forEachEdge((edge) => {
                const layoutEdge = g.getEdge(edge.id);
                if (layoutEdge && layoutEdge.data.controlPoints) {
                    edge.points = layoutEdge.data.controlPoints.map(parsePoint);
                }
            });
        });
    }
}
/**
 * Format controlPoints to avoid polylines crossing nodes
 * @param points
 * @param sourceNode
 * @param targetNode
 * @param layerCoordsArr
 * @param isHorizontal
 * @returns
 */
const getControlPoints = (points, sourceNode, targetNode, layerCoordsArr, isHorizontal, isDifferentLayer, filterControlPointsOutOfBoundary) => {
    let controlPoints = (points === null || points === void 0 ? void 0 : points.slice(1, points.length - 1)) || []; // 去掉头尾
    // 酌情增加控制点，使折线不穿过跨层的节点
    if (sourceNode && targetNode) {
        let { x: sourceX, y: sourceY } = sourceNode.data;
        let { x: targetX, y: targetY } = targetNode.data;
        if (isHorizontal) {
            sourceX = sourceNode.data.y;
            sourceY = sourceNode.data.x;
            targetX = targetNode.data.y;
            targetY = targetNode.data.x;
        }
        // 为跨层级的边增加第一个控制点。忽略垂直的/横向的边。
        // 新控制点 = {
        //   x: 终点x,
        //   y: (起点y + 下一层y) / 2,   #下一层y可能不等于终点y
        // }
        if (targetY !== sourceY && sourceX !== targetX) {
            const sourceLayer = layerCoordsArr.indexOf(sourceY);
            const sourceNextLayerCoord = layerCoordsArr[sourceLayer + 1];
            if (sourceNextLayerCoord) {
                const firstControlPoint = controlPoints[0];
                const insertStartControlPoint = (isHorizontal
                    ? {
                        x: (sourceY + sourceNextLayerCoord) / 2,
                        y: (firstControlPoint === null || firstControlPoint === void 0 ? void 0 : firstControlPoint.y) || targetX,
                    }
                    : {
                        x: (firstControlPoint === null || firstControlPoint === void 0 ? void 0 : firstControlPoint.x) || targetX,
                        y: (sourceY + sourceNextLayerCoord) / 2,
                    });
                // 当新增的控制点不存在（!=当前第一个控制点）时添加
                if (!firstControlPoint ||
                    isDifferentLayer(firstControlPoint, insertStartControlPoint)) {
                    controlPoints.unshift(insertStartControlPoint);
                }
            }
            const targetLayer = layerCoordsArr.indexOf(targetY);
            const layerDiff = Math.abs(targetLayer - sourceLayer);
            if (layerDiff === 1) {
                controlPoints = filterControlPointsOutOfBoundary(controlPoints, sourceNode.data, targetNode.data);
                // one controlPoint at least
                if (!controlPoints.length) {
                    controlPoints.push((isHorizontal
                        ? {
                            x: (sourceY + targetY) / 2,
                            y: sourceX,
                        }
                        : {
                            x: sourceX,
                            y: (sourceY + targetY) / 2,
                        }));
                }
            }
            else if (layerDiff > 1) {
                const targetLastLayerCoord = layerCoordsArr[targetLayer - 1];
                if (targetLastLayerCoord) {
                    const lastControlPoints = controlPoints[controlPoints.length - 1];
                    const insertEndControlPoint = (isHorizontal
                        ? {
                            x: (targetY + targetLastLayerCoord) / 2,
                            y: (lastControlPoints === null || lastControlPoints === void 0 ? void 0 : lastControlPoints.y) || targetX,
                        }
                        : {
                            x: (lastControlPoints === null || lastControlPoints === void 0 ? void 0 : lastControlPoints.x) || sourceX,
                            y: (targetY + targetLastLayerCoord) / 2,
                        });
                    // 当新增的控制点不存在（!=当前最后一个控制点）时添加
                    if (!lastControlPoints ||
                        isDifferentLayer(lastControlPoints, insertEndControlPoint)) {
                        controlPoints.push(insertEndControlPoint);
                    }
                }
            }
        }
    }
    return controlPoints;
};

export { AntVDagreLayout };
//# sourceMappingURL=index.js.map
