"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.square = void 0;
const utils_1 = require("../../../utils");
const square = ({ scale = 0.3, backgroundColor, foregroundColor, }) => {
    const pattern = (0, utils_1.createElement)('pattern', {
        id: 'pattern-square',
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
    const path = (0, utils_1.createElement)('path', {
        d: 'M0,0 L20,0 L20,20 L0,20 Z',
        fill: foregroundColor,
    });
    pattern.appendChild(rect);
    pattern.appendChild(path);
    return pattern;
};
exports.square = square;
