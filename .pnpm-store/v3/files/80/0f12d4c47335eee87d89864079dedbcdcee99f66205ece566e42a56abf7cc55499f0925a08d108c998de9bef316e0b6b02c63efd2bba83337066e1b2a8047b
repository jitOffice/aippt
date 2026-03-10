"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hex = void 0;
const utils_1 = require("../../../utils");
const hex = ({ scale = 0.3, backgroundColor, foregroundColor, }) => {
    const pattern = (0, utils_1.createElement)('pattern', {
        id: 'pattern-hex',
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
        d: 'M10,0 L20,5 L20,15 L10,20 L0,15 L0,5 Z',
        fill: foregroundColor,
    });
    pattern.appendChild(rect);
    pattern.appendChild(path);
    return pattern;
};
exports.hex = hex;
