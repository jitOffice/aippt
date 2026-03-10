"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.line = void 0;
const utils_1 = require("../../../utils");
const line = ({ scale = 1, backgroundColor, foregroundColor, }) => {
    const strokeWidth = 6;
    const hSW = strokeWidth / 2;
    const pattern = (0, utils_1.createElement)('pattern', {
        id: 'pattern-line',
        width: '20',
        height: '20',
        patternTransform: `scale(${scale})`,
        patternUnits: 'userSpaceOnUse',
    });
    const rect = (0, utils_1.createElement)('rect', {
        width: '100%',
        height: '100%',
        fill: backgroundColor,
    });
    const line1 = (0, utils_1.createElement)('line', {
        x1: `${10 - hSW}`,
        y1: `${0 - hSW}`,
        x2: `${20 + hSW}`,
        y2: `${10 + hSW}`,
        stroke: foregroundColor,
        'stroke-width': strokeWidth,
        'stroke-opacity': '0.5',
    });
    const line2 = (0, utils_1.createElement)('line', {
        x1: `${0 - hSW}`,
        y1: `${10 - hSW}`,
        x2: `${10 + hSW}`,
        y2: `${20 + hSW}`,
        stroke: foregroundColor,
        'stroke-width': strokeWidth,
        'stroke-opacity': '0.5',
    });
    pattern.appendChild(rect);
    pattern.appendChild(line1);
    pattern.appendChild(line2);
    return pattern;
};
exports.line = line;
