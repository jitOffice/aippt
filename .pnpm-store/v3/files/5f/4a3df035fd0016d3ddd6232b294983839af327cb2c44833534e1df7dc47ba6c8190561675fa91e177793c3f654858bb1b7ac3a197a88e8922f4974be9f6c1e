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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "../../jsx-runtime.js";
import { Defs, Polygon } from '../../jsx/index.js';
export const SimpleArrow = (_a) => {
    var { width = 25, height = 25, colorPrimary = '#6699FF', rotation = 0 } = _a, rest = __rest(_a, ["width", "height", "colorPrimary", "rotation"]);
    const strokeId = `gradient-arrow-stroke-${colorPrimary.replace('#', '')}`;
    const fillId = `gradient-arrow-fill-${colorPrimary.replace('#', '')}`;
    const shaftWidth = Math.round(width * 0.515);
    const shaftTop = Math.round(height * 0.275);
    const shaftBottom = Math.round(height * 0.875);
    const points = [
        { x: 0, y: shaftTop },
        { x: shaftWidth, y: shaftTop },
        { x: shaftWidth, y: height * 0.075 },
        { x: width, y: height * 0.575 },
        { x: shaftWidth, y: height * 1.075 },
        { x: shaftWidth, y: shaftBottom },
        { x: 0, y: shaftBottom },
    ];
    const centerX = width / 2;
    const centerY = height / 2;
    const transform = `rotate(${rotation} ${centerX} ${centerY})`;
    return (_jsxs(_Fragment, { children: [_jsx(Polygon, Object.assign({}, rest, { width: width, height: height, points: points, fill: `url(#${fillId})`, stroke: `url(#${strokeId})`, transform: transform, "data-element-type": "shape" })), _jsxs(Defs, { children: [_jsxs("linearGradient", { id: fillId, x1: "100%", y1: "0%", x2: "0%", y2: "0%", children: [_jsx("stop", { offset: "0%", "stop-color": colorPrimary, "stop-opacity": "0.36" }), _jsx("stop", { offset: "100%", "stop-color": colorPrimary, "stop-opacity": "0" })] }), _jsxs("linearGradient", { id: strokeId, x1: "100%", y1: "0%", x2: "0%", y2: "0%", children: [_jsx("stop", { offset: "0%", "stop-color": colorPrimary }), _jsx("stop", { offset: "58%", "stop-color": colorPrimary, "stop-opacity": "0" })] })] })] }));
};
