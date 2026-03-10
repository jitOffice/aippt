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
import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Ellipse, Group, Rect } from '../../jsx/index.js';
export const ItemIcon = (props) => {
    const { indexes, size = 32 } = props, restProps = __rest(props, ["indexes", "size"]);
    const finalProps = Object.assign({ fill: 'lightgray', width: size, height: size }, restProps);
    return (_jsx(Rect, Object.assign({}, finalProps, { "data-indexes": indexes, "data-element-type": "item-icon" })));
};
export const ItemIconCircle = (props) => {
    const { indexes, size = 50, fill, colorBg = 'white' } = props, restProps = __rest(props, ["indexes", "size", "fill", "colorBg"]);
    // 圆形内最大内切正方形的边长 = 圆的直径 / √2
    const innerSize = (size / Math.SQRT2) * 0.9;
    const offset = (size - innerSize) / 2;
    const iconProps = Object.assign(Object.assign({ fill: colorBg }, restProps), { x: offset, y: offset, width: innerSize, height: innerSize });
    return (_jsxs(Group, Object.assign({}, restProps, { width: size, height: size, "data-element-type": "item-icon-group" /* ElementTypeEnum.ItemIconGroup */, children: [_jsx(Ellipse, { width: size, height: size, fill: fill, "data-element-type": "shape" }), _jsx(Rect, Object.assign({}, iconProps, { "data-indexes": indexes, "data-element-type": "item-icon" /* ElementTypeEnum.ItemIcon */ }))] })));
};
