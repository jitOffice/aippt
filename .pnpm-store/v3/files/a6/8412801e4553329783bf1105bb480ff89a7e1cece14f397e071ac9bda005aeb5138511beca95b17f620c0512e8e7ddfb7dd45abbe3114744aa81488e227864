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
exports.Illus = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const Illus = (_a) => {
    var { indexes } = _a, props = __rest(_a, ["indexes"]);
    const defaultProps = {
        fill: 'lightgray',
    };
    const finalProps = Object.assign(Object.assign({}, defaultProps), props);
    if (indexes) {
        finalProps['data-indexes'] = indexes;
        finalProps['data-element-type'] = "item-illus" /* ElementTypeEnum.ItemIllus */;
    }
    else {
        finalProps['data-element-type'] = "illus" /* ElementTypeEnum.Illus */;
    }
    return (0, jsx_runtime_1.jsx)(jsx_1.Rect, Object.assign({}, finalProps));
};
exports.Illus = Illus;
