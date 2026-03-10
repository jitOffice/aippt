import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Text } from '../../jsx/index.js';
import { FlexLayout } from '../layouts/index.js';
export const Title = (props) => {
    const { x = 0, y = 0, alignHorizontal = 'center', title, desc, descLineNumber: subTitleLineNumber = 2, themeColors, } = props;
    const MainTitle = (props) => {
        const defaultProps = {
            fontSize: 24,
            fill: themeColors.colorPrimaryText,
            lineHeight: 1.4,
            alignHorizontal,
        };
        return (_jsx(Text, Object.assign({}, defaultProps, props, { "data-element-type": "title", children: title })));
    };
    const Desc = (props) => {
        const defaultProps = {
            fontSize: 16,
            fill: themeColors.colorTextSecondary,
            alignHorizontal,
            lineHeight: 1.4,
            height: subTitleLineNumber * 24,
        };
        return (_jsx(Text, Object.assign({}, defaultProps, props, { "data-element-type": "desc", children: desc })));
    };
    if (!title && !desc)
        return null;
    return (_jsxs(FlexLayout, { flexDirection: "column", justifyContent: "center", alignItems: "center", x: x, y: y, gap: 8, children: [title && _jsx(MainTitle, {}), desc && _jsx(Desc, {})] }));
};
