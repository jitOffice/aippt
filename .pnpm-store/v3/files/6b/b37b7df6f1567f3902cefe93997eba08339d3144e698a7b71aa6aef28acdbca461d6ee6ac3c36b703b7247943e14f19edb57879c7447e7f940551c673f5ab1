"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mosaic = void 0;
const utils_1 = require("../../../utils");
const mosaic = ({ scale = 1, backgroundColor = '#ffffff', foregroundColor = '#000000', }) => {
    const patternSize = 20;
    const tileSize = 5;
    const rows = patternSize / tileSize;
    const cols = patternSize / tileSize;
    const pattern = (0, utils_1.createElement)('pattern', {
        id: 'pattern-mosaic',
        width: patternSize,
        height: patternSize,
        patternUnits: 'userSpaceOnUse',
        patternTransform: `scale(${scale})`,
    });
    // 背景填充
    const background = (0, utils_1.createElement)('rect', {
        width: '100%',
        height: '100%',
        fill: backgroundColor,
    });
    pattern.appendChild(background);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if ((x + y) % 2 === 0) {
                const rect = (0, utils_1.createElement)('rect', {
                    x: x * tileSize,
                    y: y * tileSize,
                    width: tileSize,
                    height: tileSize,
                    fill: foregroundColor,
                });
                pattern.appendChild(rect);
            }
        }
    }
    return pattern;
};
exports.mosaic = mosaic;
