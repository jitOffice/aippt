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
export const DropShadow = (props) => {
    const { color = 'black', opacity = 0.8 } = props, restProps = __rest(props, ["color", "opacity"]);
    return (_jsx("filter", Object.assign({ id: "drop-shadow", x: "-25%", y: "-25%", width: "200%", height: "200%" }, restProps, { children: _jsx("feDropShadow", { dx: "4", dy: "4", stdDeviation: "4", "flood-color": color, "flood-opacity": opacity }) })));
};
