"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoneList = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const DoneList = (props) => {
    const [{ datum, indexes, width = 300, height = 30, iconSize = 30, gap = 5, positionH = 'normal', positionV = 'middle', themeColors, }, restProps,] = (0, utils_1.getItemProps)(props, ['width', 'height', 'iconSize', 'gap']);
    const textWidth = width - iconSize - gap;
    const shapeY = positionV === 'middle'
        ? (height - iconSize) / 2
        : positionV === 'flipped'
            ? height - iconSize
            : 0;
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Path, { "data-element-type": "shape", x: positionH === 'flipped' ? textWidth + gap : 0, y: shapeY, fill: themeColors.colorPrimary, width: iconSize, height: iconSize, d: "M14.7273 30C6.54538 30 0 22.9077 0 14.7269C0 6.54617 6.54538 0 14.7273 0C22.9092 0 30 6.54617 30 14.7269C30 22.9077 22.9092 30 14.7273 30ZM24.5454 10.9077C22.9092 9.27307 22.9092 9.27307 22.9092 9.27307C22.3638 8.72692 22.3638 8.7269 21.8181 8.7269C21.2727 8.7269 21.2727 8.72692 20.7273 9.27307C13.0908 16.9077 13.0908 16.9077 13.0908 16.9077C8.72731 12.5461 8.72731 12.5462 8.72731 12.5462C8.18193 12.5462 8.18193 12 7.63654 12L7.09077 12.5462C4.90923 14.1808 4.90923 14.1808 4.90923 14.1808C4.90923 14.7269 4.90923 14.7269 4.90923 15.2731C4.90923 15.8192 4.90923 15.8192 4.90923 16.3654C12 23.4539 12 23.4538 12 23.4538C12.5454 23.4538 12.5454 23.4538 13.0908 23.4538C13.6365 23.4538 13.6365 23.4538 14.1819 23.4538C24.5454 12.5461 24.5454 12.5462 24.5454 12.5462L25.0908 12C25.0908 11.4538 24.5454 10.9077 24.5454 10.9077Z" }), (0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: positionH === 'flipped' ? 0 : iconSize + gap, width: textWidth, height: height, fontWeight: "normal", alignVertical: "middle", wordWrap: false, fill: "#666", children: datum.label || datum.desc })] })));
};
exports.DoneList = DoneList;
(0, registry_1.registerItem)('done-list', {
    component: exports.DoneList,
    composites: ['label'],
});
