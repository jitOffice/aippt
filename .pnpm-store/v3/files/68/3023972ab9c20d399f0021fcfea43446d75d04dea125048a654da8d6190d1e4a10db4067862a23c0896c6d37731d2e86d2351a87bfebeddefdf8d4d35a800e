"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Title = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const layouts_1 = require("../layouts");
const Title = (props) => {
    const { x = 0, y = 0, alignHorizontal = 'center', title, desc, descLineNumber: subTitleLineNumber = 2, themeColors, } = props;
    const MainTitle = (props) => {
        const defaultProps = {
            fontSize: 24,
            fill: themeColors.colorPrimaryText,
            lineHeight: 1.4,
            alignHorizontal,
        };
        return ((0, jsx_runtime_1.jsx)(jsx_1.Text, Object.assign({}, defaultProps, props, { "data-element-type": "title", children: title })));
    };
    const Desc = (props) => {
        const defaultProps = {
            fontSize: 16,
            fill: themeColors.colorTextSecondary,
            alignHorizontal,
            lineHeight: 1.4,
            height: subTitleLineNumber * 24,
        };
        return ((0, jsx_runtime_1.jsx)(jsx_1.Text, Object.assign({}, defaultProps, props, { "data-element-type": "desc", children: desc })));
    };
    if (!title && !desc)
        return null;
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { flexDirection: "column", justifyContent: "center", alignItems: "center", x: x, y: y, gap: 8, children: [title && (0, jsx_runtime_1.jsx)(MainTitle, {}), desc && (0, jsx_runtime_1.jsx)(Desc, {})] }));
};
exports.Title = Title;
