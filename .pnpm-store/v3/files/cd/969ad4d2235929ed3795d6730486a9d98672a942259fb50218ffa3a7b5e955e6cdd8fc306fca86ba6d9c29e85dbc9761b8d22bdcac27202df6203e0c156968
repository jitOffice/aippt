import { getAttributes, hasColor, setAttributes } from '../../utils/index.js';
import { applyGradientStyle, applyPatternStyle, applyRoughStyle, } from '../stylize/index.js';
import { parseDynamicAttributes } from '../utils/index.js';
export function renderShape(svg, node, options) {
    var _a;
    const { themeConfig } = options;
    const attrs = Object.assign({}, (_a = themeConfig.base) === null || _a === void 0 ? void 0 : _a.shape, themeConfig.shape);
    const parsedAttrs = parseDynamicAttributes(node, attrs);
    setAttributes(node, parsedAttrs);
    stylizeShape(node, svg, options);
    return node;
}
export function renderStaticShape(node, options) {
    var _a;
    setAttributes(node, ((_a = options.themeConfig.base) === null || _a === void 0 ? void 0 : _a.shape) || {});
}
function stylizeShape(node, svg, options) {
    const config = options.themeConfig.stylize;
    if (!config)
        return node;
    const { type } = config;
    if (!type)
        return node;
    if (type === 'rough') {
        return applyRoughStyle(node, svg, config);
    }
    if (type === 'pattern') {
        return applyPatternStyle(node, svg, options);
    }
    if (type === 'linear-gradient' || type === 'radial-gradient') {
        const { fill, stroke } = getAttributes(node, ['fill', 'stroke']);
        if (hasColor(fill)) {
            applyGradientStyle(node, svg, config, 'fill');
        }
        if (hasColor(stroke)) {
            applyGradientStyle(node, svg, config, 'stroke');
        }
        return;
    }
}
