"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dot = void 0;
const utils_1 = require("../../../utils");
const dot = ({ scale = 1, backgroundColor, foregroundColor, }) => {
    const pattern = (0, utils_1.createElement)('pattern', {
        id: 'pattern-dot',
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
    const circle1 = (0, utils_1.createElement)('circle', {
        cx: '5',
        cy: '5',
        r: '3',
        fill: foregroundColor,
    });
    const circle2 = (0, utils_1.createElement)('circle', {
        cx: '15',
        cy: '15',
        r: '3',
        fill: foregroundColor,
    });
    pattern.appendChild(rect);
    pattern.appendChild(circle1);
    pattern.appendChild(circle2);
    return pattern;
};
exports.dot = dot;
