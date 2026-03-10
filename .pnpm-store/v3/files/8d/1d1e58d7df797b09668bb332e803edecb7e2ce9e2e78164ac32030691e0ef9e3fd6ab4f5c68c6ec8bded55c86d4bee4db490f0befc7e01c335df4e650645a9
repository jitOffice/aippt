"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartWordCloud = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const DEFAULT_ROTATE_ANGLES = [0, 30, -30, 60, -60];
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
function getRotatedSize(width, height, angle) {
    const rad = (Math.PI / 180) * angle;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
        width: Math.abs(width * cos) + Math.abs(height * sin),
        height: Math.abs(width * sin) + Math.abs(height * cos),
    };
}
function hasCollision(x, y, width, height, placed, padding) {
    const left = x - padding;
    const right = x + width + padding;
    const top = y - padding;
    const bottom = y + height + padding;
    return placed.some((word) => {
        const wLeft = word.box.x - padding;
        const wRight = word.box.x + word.box.width + padding;
        const wTop = word.box.y - padding;
        const wBottom = word.box.y + word.box.height + padding;
        return !(right <= wLeft ||
            left >= wRight ||
            bottom <= wTop ||
            top >= wBottom);
    });
}
function placeWords(words, enableRotate, padding, spiralStep, radiusStep) {
    const placed = [];
    const rotationAngles = enableRotate ? DEFAULT_ROTATE_ANGLES : [0];
    const maxAttempts = Math.max(1600, words.length * 28);
    words.forEach((word, wordIndex) => {
        const sizeBias = Math.max(word.width, word.height);
        const angleOffset = wordIndex * GOLDEN_ANGLE;
        let extraRadius = 0;
        let placedWord = null;
        for (let attempt = 0; attempt < maxAttempts && !placedWord; attempt++) {
            if (attempt === Math.floor(maxAttempts * 0.6)) {
                // Gradually expand the search radius for dense layouts
                extraRadius = sizeBias;
            }
            const theta = angleOffset + attempt * spiralStep;
            const radius = radiusStep * Math.sqrt(attempt + 1) + extraRadius + sizeBias * 0.25;
            const centerX = radius * Math.cos(theta);
            const centerY = radius * Math.sin(theta);
            for (const angle of rotationAngles) {
                const rotated = getRotatedSize(word.width, word.height, angle);
                const x = centerX - rotated.width / 2;
                const y = centerY - rotated.height / 2;
                if (!hasCollision(x, y, rotated.width, rotated.height, placed, padding)) {
                    placedWord = Object.assign(Object.assign({}, word), { angle,
                        centerX,
                        centerY, box: { x, y, width: rotated.width, height: rotated.height } });
                    break;
                }
            }
        }
        if (!placedWord) {
            const fallbackAngle = rotationAngles[wordIndex % rotationAngles.length];
            const farRadius = radiusStep * Math.sqrt(maxAttempts + 1) + sizeBias;
            const theta = angleOffset;
            const centerX = farRadius * Math.cos(theta);
            const centerY = farRadius * Math.sin(theta);
            const rotated = getRotatedSize(word.width, word.height, fallbackAngle);
            placedWord = Object.assign(Object.assign({}, word), { angle: fallbackAngle, centerX,
                centerY, box: {
                    x: centerX - rotated.width / 2,
                    y: centerY - rotated.height / 2,
                    width: rotated.width,
                    height: rotated.height,
                } });
        }
        placed.push(placedWord);
    });
    return placed;
}
const ChartWordCloud = (props) => {
    const { data, options, minFontSize = 16, maxFontSize = 48, enableRotate = true, padding = 6, spiralStep = 0.45, radiusStep = 10, } = props;
    const { items = [] } = data;
    const validItems = items
        .map((datum, index) => ({ datum, index }))
        .filter(({ datum }) => datum.label);
    if (validItems.length === 0) {
        return ((0, jsx_runtime_1.jsx)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, {}) }) }));
    }
    const values = validItems
        .map(({ datum }) => datum.value)
        .filter((v) => typeof v === 'number');
    const hasValues = values.length > 0;
    const minValue = hasValues ? Math.min(...values) : 0;
    const maxValue = hasValues ? Math.max(...values) : 0;
    const sameValue = hasValues && minValue === maxValue;
    const uniformSize = (minFontSize + maxFontSize) / 2;
    const mapFontSize = (value) => {
        if (!hasValues || sameValue)
            return uniformSize;
        if (value == null)
            return minFontSize;
        const ratio = (value - minValue) / (maxValue - minValue || 1);
        return minFontSize + ratio * (maxFontSize - minFontSize);
    };
    const words = validItems
        .map(({ datum, index }) => {
        const fontSize = mapFontSize(datum.value);
        const measured = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(jsx_1.Text, { fontSize: fontSize, fontWeight: "bold", children: datum.label }));
        const color = (0, utils_1.getPaletteColor)(options, [index]) ||
            (0, utils_1.getColorPrimary)(options) ||
            '#333333';
        return {
            label: datum.label,
            value: datum.value,
            color,
            fontSize,
            width: measured.width * 1.05,
            height: measured.height,
        };
    })
        .sort((a, b) => b.fontSize - a.fontSize);
    const placedWords = placeWords(words, enableRotate, padding, spiralStep, radiusStep);
    const minX = Math.min(...placedWords.map((w) => w.box.x));
    const minY = Math.min(...placedWords.map((w) => w.box.y));
    const maxX = Math.max(...placedWords.map((w) => w.box.x + w.box.width));
    const maxY = Math.max(...placedWords.map((w) => w.box.y + w.box.height));
    const offsetX = -minX + padding;
    const offsetY = -minY + padding;
    const containerWidth = maxX - minX + padding * 2;
    const containerHeight = maxY - minY + padding * 2;
    const wordElements = placedWords.map((word, index) => {
        const translateX = word.centerX - word.width / 2 + offsetX;
        const translateY = word.centerY - word.height / 2 + offsetY;
        const rotationOriginX = word.width / 2;
        const rotationOriginY = word.height / 2;
        const transform = `translate(${translateX}, ${translateY}) rotate(${word.angle}, ${rotationOriginX}, ${rotationOriginY})`;
        return ((0, jsx_runtime_1.jsx)(jsx_1.Group, { transform: transform, children: (0, jsx_runtime_1.jsx)(jsx_1.Text, { width: word.width, height: word.height, fontSize: word.fontSize, fontWeight: "bold", alignHorizontal: "center", alignVertical: "middle", fill: word.color, "data-indexes": index, "data-element-type": "item-label" /* ElementTypeEnum.ItemLabel */, children: word.label }) }));
    });
    return ((0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { id: "infographic-container", width: containerWidth, height: containerHeight, children: wordElements }));
};
exports.ChartWordCloud = ChartWordCloud;
(0, registry_1.registerStructure)('chart-wordcloud', {
    component: exports.ChartWordCloud,
    composites: [],
});
