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
exports.BtnRemove = exports.BtnAdd = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const BtnAdd = (props) => {
    const { indexes } = props, restProps = __rest(props, ["indexes"]);
    const defaultProps = {
        fill: '#B9EBCA',
        fillOpacity: 0.3,
        width: 20,
        height: 20,
        'data-indexes': indexes,
        'data-element-type': "btn-add" /* ElementTypeEnum.BtnAdd */,
    };
    return (0, jsx_runtime_1.jsx)(jsx_1.Rect, Object.assign({}, defaultProps, restProps));
};
exports.BtnAdd = BtnAdd;
const BtnRemove = (props) => {
    const { indexes } = props, restProps = __rest(props, ["indexes"]);
    const defaultProps = {
        fill: '#F9C0C0',
        fillOpacity: 0.3,
        width: 20,
        height: 20,
        'data-indexes': indexes,
        'data-element-type': "btn-remove" /* ElementTypeEnum.BtnRemove */,
    };
    return (0, jsx_runtime_1.jsx)(jsx_1.Rect, Object.assign({}, defaultProps, restProps));
};
exports.BtnRemove = BtnRemove;
