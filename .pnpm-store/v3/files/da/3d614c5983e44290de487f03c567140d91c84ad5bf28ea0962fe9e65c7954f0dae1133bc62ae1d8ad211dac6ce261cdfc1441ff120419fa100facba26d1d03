"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderBackground = renderBackground;
const utils_1 = require("../../utils");
function renderBackground(svg, options) {
    var _a, _b;
    if (((_a = options.svg) === null || _a === void 0 ? void 0 : _a.background) === false)
        return;
    const { themeConfig: { colorBg: background }, } = options;
    if (!background)
        return;
    const container = svg.parentElement;
    if (container)
        container.style.backgroundColor = background || 'none';
    const element = (0, utils_1.getElementByRole)(svg, "background" /* ElementTypeEnum.Background */);
    svg.style.backgroundColor = background;
    if (element) {
        element.setAttribute('fill', background);
    }
    else if ((_b = svg.viewBox) === null || _b === void 0 ? void 0 : _b.baseVal) {
        const { x, y, width, height } = svg.viewBox.baseVal;
        const rect = (0, utils_1.createElement)('rect', {
            x,
            y,
            width,
            height,
            fill: background,
            'data-element-type': "background" /* ElementTypeEnum.Background */,
        });
        svg.prepend(rect);
    }
}
