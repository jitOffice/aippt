"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEdgePathD = exports.getLabelPosition = exports.getPointAtT = exports.getTangentAngle = exports.getNodesAnchors = exports.createArrowElements = exports.createRoundedPath = exports.createStraightPath = exports.getMidPoint = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const getMidPoint = (points) => {
    if (points.length === 0)
        return null;
    if (points.length === 1)
        return points[0];
    let total = 0;
    const segments = [];
    for (let i = 0; i < points.length - 1; i += 1) {
        const start = points[i];
        const end = points[i + 1];
        const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
        segments.push({ length, start, end });
        total += length;
    }
    if (total === 0)
        return points[0];
    let target = total / 2;
    for (let i = 0; i < segments.length; i += 1) {
        const segment = segments[i];
        if (target <= segment.length || i === segments.length - 1) {
            const ratio = segment.length === 0
                ? 0
                : Math.max(0, Math.min(1, target / segment.length));
            return [
                segment.start[0] + (segment.end[0] - segment.start[0]) * ratio,
                segment.start[1] + (segment.end[1] - segment.start[1]) * ratio,
            ];
        }
        target -= segment.length;
    }
    return points[Math.floor(points.length / 2)];
};
exports.getMidPoint = getMidPoint;
const createStraightPath = (points, dx, dy) => points
    .map(([x, y], index) => {
    const prefix = index === 0 ? 'M' : 'L';
    return `${prefix} ${x + dx} ${y + dy}`;
})
    .join(' ');
exports.createStraightPath = createStraightPath;
const createRoundedPath = (points, radius, dx, dy) => {
    if (points.length < 2)
        return '';
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const toPoint = ([x, y]) => ({
        x: x + dx,
        y: y + dy,
    });
    const output = [];
    const first = toPoint(points[0]);
    output.push(`M ${first.x} ${first.y}`);
    if (points.length === 2) {
        const last = toPoint(points[1]);
        output.push(`L ${last.x} ${last.y}`);
        return output.join(' ');
    }
    for (let i = 1; i < points.length - 1; i += 1) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];
        const v0x = curr[0] - prev[0];
        const v0y = curr[1] - prev[1];
        const v1x = next[0] - curr[0];
        const v1y = next[1] - curr[1];
        const d0 = Math.hypot(v0x, v0y);
        const d1 = Math.hypot(v1x, v1y);
        if (d0 === 0 || d1 === 0) {
            const currPoint = toPoint(curr);
            output.push(`L ${currPoint.x} ${currPoint.y}`);
            continue;
        }
        const r = clamp(radius, 0, Math.min(d0, d1) / 2);
        if (r === 0) {
            const currPoint = toPoint(curr);
            output.push(`L ${currPoint.x} ${currPoint.y}`);
            continue;
        }
        const u0x = v0x / d0;
        const u0y = v0y / d0;
        const u1x = v1x / d1;
        const u1y = v1y / d1;
        const start = toPoint([curr[0] - u0x * r, curr[1] - u0y * r]);
        const end = toPoint([curr[0] + u1x * r, curr[1] + u1y * r]);
        output.push(`L ${start.x} ${start.y}`);
        const currPoint = toPoint(curr);
        output.push(`Q ${currPoint.x} ${currPoint.y} ${end.x} ${end.y}`);
    }
    const last = toPoint(points[points.length - 1]);
    output.push(`L ${last.x} ${last.y}`);
    return output.join(' ');
};
exports.createRoundedPath = createRoundedPath;
const createArrowElements = (x, y, angle, type, fillColor, edgeWidth, arrowSize) => {
    const ux = Math.cos(angle);
    const uy = Math.sin(angle);
    const px = -uy;
    const py = ux;
    const length = arrowSize;
    const halfWidth = arrowSize * 0.55;
    if (type === 'arrow') {
        const leftX = x - ux * length + px * halfWidth;
        const leftY = y - uy * length + py * halfWidth;
        const rightX = x - ux * length - px * halfWidth;
        const rightY = y - uy * length - py * halfWidth;
        return [
            (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M ${leftX} ${leftY} L ${x} ${y} L ${rightX} ${rightY}`, stroke: fillColor, strokeWidth: Math.max(1.5, edgeWidth), strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }),
        ];
    }
    if (type === 'diamond') {
        const diamondLength = length * 1.25;
        const diamondWidth = halfWidth * 0.75;
        const midX = x - ux * diamondLength * 0.5;
        const midY = y - uy * diamondLength * 0.5;
        const diamondPoints = [
            { x, y },
            { x: midX + px * diamondWidth, y: midY + py * diamondWidth },
            { x: x - ux * diamondLength, y: y - uy * diamondLength },
            { x: midX - px * diamondWidth, y: midY - py * diamondWidth },
        ];
        return [
            (0, jsx_runtime_1.jsx)(jsx_1.Polygon, { points: diamondPoints, fill: fillColor, stroke: fillColor, strokeWidth: Math.max(1, edgeWidth * 0.8) }),
        ];
    }
    const trianglePoints = [
        { x, y },
        {
            x: x - ux * length + px * halfWidth,
            y: y - uy * length + py * halfWidth,
        },
        {
            x: x - ux * length - px * halfWidth,
            y: y - uy * length - py * halfWidth,
        },
    ];
    return [
        (0, jsx_runtime_1.jsx)(jsx_1.Polygon, { points: trianglePoints, fill: fillColor, stroke: fillColor, strokeWidth: Math.max(1, edgeWidth * 0.8) }),
    ];
};
exports.createArrowElements = createArrowElements;
// LT: Left Top (radio), LC: Left Center (1/2), LB: Left Bottom (1 - radio)
// RT: Right Top (radio), RC: Right Center (1/2), RB: Right Bottom (1 - radio)
const getNodesAnchors = (node) => {
    const { x, y, width, height, radio = 0.25 } = node;
    const q1H = height * radio;
    const halfH = height * 0.5;
    const q3H = height * (1 - radio);
    return {
        LT: { x, y: y + q1H },
        LC: { x, y: y + halfH },
        LB: { x, y: y + q3H },
        RT: { x: x + width, y: y + q1H },
        RC: { x: x + width, y: y + halfH },
        RB: { x: x + width, y: y + q3H },
    };
};
exports.getNodesAnchors = getNodesAnchors;
const getTangentAngle = (points, t) => {
    const len = points.length;
    // Cubic Bezier (Self loop)
    if (len === 4) {
        const p0 = points[0], p1 = points[1], p2 = points[2], p3 = points[3];
        if (t === 0) {
            return Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
        }
        else {
            return Math.atan2(p3[1] - p2[1], p3[0] - p2[0]);
        }
    }
    // Quad Bezier (Curved)
    if (len === 3) {
        const p0 = points[0], p1 = points[1], p2 = points[2];
        if (t === 0) {
            return Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
        }
        else {
            return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
        }
    }
    // Line
    if (len === 2) {
        const p0 = points[0], p1 = points[1];
        const angle = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
        return angle;
    }
    return 0;
};
exports.getTangentAngle = getTangentAngle;
/**
 * 计算贝塞尔曲线上任意 t (0-1) 位置的点
 */
const getPointAtT = (points, t = 0.5) => {
    const len = points.length;
    if (len === 4) {
        const [p0, p1, p2, p3] = points;
        const mt = 1 - t;
        // B(t) = (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3(1-t)*t^2*P2 + t^3*P3
        return [
            Math.pow(mt, 3) * p0[0] +
                3 * Math.pow(mt, 2) * t * p1[0] +
                3 * mt * Math.pow(t, 2) * p2[0] +
                Math.pow(t, 3) * p3[0],
            Math.pow(mt, 3) * p0[1] +
                3 * Math.pow(mt, 2) * t * p1[1] +
                3 * mt * Math.pow(t, 2) * p2[1] +
                Math.pow(t, 3) * p3[1],
        ];
    }
    if (len === 3) {
        const [p0, p1, p2] = points;
        const mt = 1 - t;
        // B(t) = (1-t)^2*P0 + 2(1-t)*t*P1 + t^2*P2
        return [
            Math.pow(mt, 2) * p0[0] + 2 * mt * t * p1[0] + Math.pow(t, 2) * p2[0],
            Math.pow(mt, 2) * p0[1] + 2 * mt * t * p1[1] + Math.pow(t, 2) * p2[1],
        ];
    }
    if (len === 2) {
        const [p0, p1] = points;
        return [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t];
    }
    return points[0] || [0, 0];
};
exports.getPointAtT = getPointAtT;
const getLabelPosition = (points, selfLoopOffset = 10) => {
    const len = points.length;
    // 默认取中点
    const labelPoint = (0, exports.getPointAtT)(points);
    if (len === 4) {
        // 针对自连接(len=4)的特殊偏移处理
        labelPoint[0] += selfLoopOffset;
    }
    return labelPoint;
};
exports.getLabelPosition = getLabelPosition;
const getEdgePathD = (points) => {
    const len = points.length;
    if (len === 4) {
        const [p0, p1, p2, p3] = points;
        return `M ${p0[0]} ${p0[1]} C ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`;
    }
    if (len === 3) {
        const [p0, p1, p2] = points;
        return `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`;
    }
    if (len === 2) {
        const [p0, p1] = points;
        return `M ${p0[0]} ${p0[1]} L ${p1[0]} ${p1[1]}`;
    }
    return '';
};
exports.getEdgePathD = getEdgePathD;
