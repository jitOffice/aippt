"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LCornerCard = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const LCornerCard = (props) => {
    const [{ indexes, datum, width = 140, iconSize = 24, themeColors }, restProps,] = (0, utils_1.getItemProps)(props, ['width', 'iconSize']);
    const { label, desc } = datum;
    const lStroke = 8;
    const arrowSize = 16;
    const arrowGap = 12;
    const descX = arrowSize + arrowGap;
    const descWidth = width - descX;
    const descHeight = 60;
    const verticalLen = iconSize + 44;
    const arrowX1 = arrowSize;
    const arrowY1 = descHeight + arrowGap;
    const arrowY2 = descHeight + arrowSize + arrowGap;
    const arrowVertices = [
        { x: 0, y: arrowY2 },
        { x: arrowX1, y: arrowY1 },
        { x: arrowX1, y: arrowY2 },
    ];
    const innerWidth = width - arrowX1 - arrowGap;
    const lx1 = arrowX1 + arrowGap;
    const lx2 = lx1 + innerWidth;
    const ly1 = arrowY1 + lStroke / 2;
    const ly2 = ly1 + verticalLen;
    const d = `M ${lx1} ${ly2} L ${lx1} ${ly1} L ${lx2} ${ly1}`;
    const halfStroke = lStroke / 2;
    const x1 = lx1 + halfStroke;
    const y1 = ly1 + halfStroke;
    const gap = 8;
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { children: [(0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, x: descX, width: descWidth, height: descHeight, fontSize: 12, alignHorizontal: "left", alignVertical: "bottom", fill: themeColors.colorTextSecondary, children: desc }), (0, jsx_runtime_1.jsx)(jsx_1.Polygon, { points: arrowVertices, fill: themeColors.colorPrimary, opacity: 0.9, width: arrowSize, height: arrowSize, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: d, stroke: themeColors.colorPrimary, strokeWidth: lStroke, fill: "none", "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(components_1.ItemIcon, { indexes: indexes, x: x1 + innerWidth / 2 - iconSize / 2, y: y1 + gap, size: iconSize, fill: themeColors.colorPrimary }), (0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, x: x1, y: y1 + iconSize + gap * 2, width: innerWidth, fontSize: 14, fontWeight: "bold", alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorText, children: label })] })));
};
exports.LCornerCard = LCornerCard;
(0, registry_1.registerItem)('l-corner-card', {
    component: exports.LCornerCard,
    composites: ['icon', 'label', 'desc'],
});
