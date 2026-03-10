"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemIconCircle = exports.ItemIcon = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const ItemIcon = (props) => {
    const { indexes, size = 32 } = props, restProps = __rest(props, ["indexes", "size"]);
    const finalProps = Object.assign({ fill: 'lightgray', width: size, height: size }, restProps);
    return ((0, jsx_runtime_1.jsx)(jsx_1.Rect, Object.assign({}, finalProps, { "data-indexes": indexes, "data-element-type": "item-icon" })));
};
exports.ItemIcon = ItemIcon;
const ItemIconCircle = (props) => {
    const { indexes, size = 50, fill, colorBg = 'white' } = props, restProps = __rest(props, ["indexes", "size", "fill", "colorBg"]);
    // 圆形内最大内切正方形的边长 = 圆的直径 / √2
    const innerSize = (size / Math.SQRT2) * 0.9;
    const offset = (size - innerSize) / 2;
    const iconProps = Object.assign(Object.assign({ fill: colorBg }, restProps), { x: offset, y: offset, width: innerSize, height: innerSize });
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, Object.assign({}, restProps, { width: size, height: size, "data-element-type": "item-icon-group" /* ElementTypeEnum.ItemIconGroup */, children: [(0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { width: size, height: size, fill: fill, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, Object.assign({}, iconProps, { "data-indexes": indexes, "data-element-type": "item-icon" /* ElementTypeEnum.ItemIcon */ }))] })));
};
exports.ItemIconCircle = ItemIconCircle;
