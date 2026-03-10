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
exports.ItemValue = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const ItemValue = (_a) => {
    var _b;
    var { indexes, value, formatter = (v) => String(v) } = _a, props = __rest(_a, ["indexes", "value", "formatter"]);
    const finalProps = Object.assign({ fontSize: 14, fill: '#666', wordWrap: true, lineHeight: 1.4, children: formatter(value), 'data-value': value }, props);
    (_b = finalProps.height) !== null && _b !== void 0 ? _b : (finalProps.height = Math.ceil(+finalProps.lineHeight * +finalProps.fontSize));
    return ((0, jsx_runtime_1.jsx)(jsx_1.Text, Object.assign({}, finalProps, { "data-indexes": indexes, "data-element-type": "item-value" /* ElementTypeEnum.ItemValue */ })));
};
exports.ItemValue = ItemValue;
