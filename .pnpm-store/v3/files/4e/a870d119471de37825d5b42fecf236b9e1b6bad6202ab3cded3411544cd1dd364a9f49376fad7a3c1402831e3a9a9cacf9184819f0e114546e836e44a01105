"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyGradientStyle = applyGradientStyle;
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const utils_1 = require("../../utils");
const utils_2 = require("../utils");
function applyGradientStyle(node, svg, config, attr) {
    const currentColor = node.getAttribute(attr);
    const actualConfig = inferGradientConfig(currentColor, config);
    const { type, colors = [] } = actualConfig;
    const size = colors.length - 1;
    const stops = colors.map((color, index) => {
        if (typeof color === 'string') {
            return (0, utils_1.createElement)('stop', {
                offset: `${index / size}`,
                'stop-color': color,
            });
        }
        else {
            return (0, utils_1.createElement)('stop', {
                offset: `${color.offset}`,
                'stop-color': color.color,
            });
        }
    });
    const id = getGradientId(actualConfig);
    if (type === 'linear-gradient') {
        const { angle = 0 } = actualConfig;
        const [[x1, y1], [x2, y2]] = angleToUnitVector(angle);
        const linearGradient = (0, utils_1.createElement)('linearGradient', {
            id,
            x1,
            y1,
            x2,
            y2,
        });
        stops.forEach((stop) => linearGradient.appendChild(stop));
        upsertGradient(svg, id, linearGradient);
    }
    else if (type === 'radial-gradient') {
        const radialGradient = (0, utils_1.createElement)('radialGradient', {
            id,
        });
        stops.forEach((stop) => radialGradient.appendChild(stop));
        upsertGradient(svg, id, radialGradient);
    }
    const fill = node.getAttribute('fill');
    const stroke = node.getAttribute('stroke');
    if ((0, utils_1.hasColor)(fill))
        node.setAttribute('fill', `url(#${id})`);
    if ((0, utils_1.hasColor)(stroke))
        node.setAttribute('stroke', `url(#${id})`);
}
function upsertGradient(svg, id, gradient) {
    const defs = (0, utils_1.getOrCreateDefs)(svg);
    gradient.setAttribute('id', id);
    const exist = defs.querySelector(`#${id}`);
    if (exist)
        exist.replaceWith(gradient);
    else
        defs.appendChild(gradient);
}
function inferGradientConfig(currentColor, config) {
    var _a;
    if (((_a = config.colors) === null || _a === void 0 ? void 0 : _a.length) || !currentColor)
        return config;
    const tc = (0, tinycolor2_1.default)(currentColor);
    const inferConfig = Object.assign({}, config);
    inferConfig.colors = tc.isDark()
        ? [currentColor, tc.lighten(20).toHexString()]
        : [tc.darken(20).toHexString(), currentColor];
    if (!('angle' in config) && inferConfig.type === 'linear-gradient') {
        inferConfig.angle = 225;
    }
    return inferConfig;
}
function getGradientId(config) {
    const { type, colors = [] } = config;
    const colorId = (0, utils_2.getSafetyId)(colors
        .map((color) => {
        if (typeof color === 'string')
            return color;
        return `${color.color}_${color.offset}`;
    })
        .join('-'));
    if (type === 'linear-gradient') {
        const { angle = 0 } = config;
        return `${type}-${colorId}-${angle}`;
    }
    return `${type}-${colorId}`;
}
/**
 * 将角度转为单位向量（屏幕坐标系）
 * 0 度为 x 轴正方向
 * 90 度为 y 轴正方向
 * 返回 x1,y1,x2,y2 供 <linearGradient> 使用
 */
function angleToUnitVector(angle) {
    const radians = (Math.PI / 180) * angle;
    const x = Math.cos(radians);
    const y = Math.sin(radians);
    return [
        [0.5 - x / 2, 0.5 - y / 2], // 起点
        [0.5 + x / 2, 0.5 + y / 2], // 终点
    ];
}
