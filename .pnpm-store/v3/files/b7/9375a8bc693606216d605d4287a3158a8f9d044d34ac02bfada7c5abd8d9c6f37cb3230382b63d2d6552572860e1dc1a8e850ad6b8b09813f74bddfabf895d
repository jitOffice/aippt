"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleIllusItem = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const SimpleIllusItem = (props) => {
    const [{ indexes, datum, width = 180, illusSize = width, gap = 8, themeColors, usePaletteColor = false, }, restProps,] = (0, utils_1.getItemProps)(props, ['width', 'illusSize', 'gap', 'usePaletteColor']);
    const { label, desc } = datum;
    const labelColor = usePaletteColor
        ? themeColors.colorPrimary
        : themeColors.colorText;
    const labelContent = ((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { indexes: indexes, width: width, alignHorizontal: "center", alignVertical: "middle", fill: labelColor, children: label }));
    const labelBounds = (0, jsx_1.getElementBounds)(labelContent);
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, Object.assign({}, restProps, { width: width, height: illusSize + gap + labelBounds.height + gap + 48, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: gap, children: [(0, jsx_runtime_1.jsx)(components_1.Illus, { indexes: indexes, width: illusSize, height: illusSize }), labelContent, (0, jsx_runtime_1.jsx)(components_1.ItemDesc, { indexes: indexes, width: width, alignHorizontal: "center", alignVertical: "top", fill: themeColors.colorTextSecondary, lineNumber: 3, children: desc })] })));
};
exports.SimpleIllusItem = SimpleIllusItem;
(0, registry_1.registerItem)('simple-illus', {
    component: exports.SimpleIllusItem,
    composites: ['illus', 'label', 'desc'],
});
