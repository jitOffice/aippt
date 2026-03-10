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
exports.Polygon = Polygon;
function Polygon(_a) {
    var { points = [] } = _a, props = __rest(_a, ["points"]);
    const { x, y } = props;
    const pointsStr = points.map(({ x, y }) => `${x},${y}`).join(' ');
    const finalProps = Object.assign(Object.assign({}, props), { points: pointsStr });
    if (x !== undefined || y !== undefined) {
        finalProps.transform =
            `translate(${x !== null && x !== void 0 ? x : 0}, ${y !== null && y !== void 0 ? y : 0})` + (finalProps.transform || '');
    }
    const node = {
        type: 'polygon',
        props: finalProps,
    };
    return node;
}
