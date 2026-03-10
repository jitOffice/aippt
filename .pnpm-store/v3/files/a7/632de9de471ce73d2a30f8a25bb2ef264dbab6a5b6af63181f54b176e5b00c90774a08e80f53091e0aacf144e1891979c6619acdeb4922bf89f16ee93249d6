"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diamond = void 0;
const utils_1 = require("../../../utils");
const diamond = ({ scale = 0.5, backgroundColor, foregroundColor, }) => {
    const pattern = (0, utils_1.createElement)('pattern', {
        id: 'pattern-diamond',
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
        d: 'M0,0 L20,20 M20,0 L0,20',
        stroke: foregroundColor,
        'stroke-width': '1',
    });
    pattern.appendChild(rect);
    pattern.appendChild(path);
    return pattern;
};
exports.diamond = diamond;
