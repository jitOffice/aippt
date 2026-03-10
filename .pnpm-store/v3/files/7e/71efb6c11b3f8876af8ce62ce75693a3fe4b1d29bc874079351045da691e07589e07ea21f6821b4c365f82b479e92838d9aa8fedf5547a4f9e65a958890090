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
import { jsx as _jsx } from "../../jsx-runtime.js";
import { Polygon } from '../../jsx/index.js';
export const Triangle = (_a) => {
    var { width = 25, height = 25, colorPrimary = '#6699FF', rotation = 0, strokeWidth = 4 } = _a, rest = __rest(_a, ["width", "height", "colorPrimary", "rotation", "strokeWidth"]);
    // 定义三角形的三个顶点
    const points = [
        { x: width / 2, y: 0 }, // 顶点
        { x: width, y: height }, // 右下角
        { x: 0, y: height }, // 左下角
    ];
    const centerX = width / 2;
    const centerY = height / 2;
    const transform = `rotate(${rotation} ${centerX} ${centerY})`;
    return (_jsx(Polygon, Object.assign({}, rest, { width: width, height: height, points: points, fill: colorPrimary, stroke: colorPrimary, strokeWidth: strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", transform: transform })));
};
