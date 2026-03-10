import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Ellipse, Group, Path, Rect } from '../../jsx/index.js';
import { ItemLabel, ItemValue } from '../components/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const CircularProgress = (props) => {
    var _a;
    const [{ datum, indexes, size = 120, strokeWidth = 12, gap = 8, themeColors, valueFormatter = (value) => `${Math.round(value)}%`, }, restProps,] = getItemProps(props, ['size', 'strokeWidth', 'gap']);
    const value = (_a = datum.value) !== null && _a !== void 0 ? _a : 0;
    const maxValue = 100;
    const percentage = Math.min(Math.max(value / maxValue, 0), 1);
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const start = strokeWidth / 2;
    const d = size - strokeWidth;
    const isFullCircle = percentage >= 1;
    const angle = percentage * 360;
    const pathData = describeArc(center, center, radius, 0, angle);
    const bounds = { x: start, y: start, width: d, height: d };
    return (_jsxs(Group, Object.assign({}, restProps, { width: size, height: size + gap + 20, children: [_jsx(Rect, { width: size, height: size, fill: "none" }), _jsx(Ellipse, Object.assign({}, bounds, { fill: "none", stroke: "#f0f0f0", strokeWidth: strokeWidth, "data-element-type": "shape" })), isFullCircle ? (_jsx(Ellipse, Object.assign({}, bounds, { fill: "none", stroke: themeColors.colorPrimary, strokeWidth: strokeWidth, "data-element-type": "shape" }))) : (_jsx(Path, { d: pathData, fill: "none", stroke: themeColors.colorPrimary, strokeWidth: strokeWidth, strokeLinecap: "round", "data-element-type": "shape" })), _jsx(ItemValue, { indexes: indexes, x: strokeWidth, y: strokeWidth, width: d - strokeWidth, height: d - strokeWidth, fontSize: 24, fontWeight: "bold", fill: themeColors.colorPrimary, alignHorizontal: "center", alignVertical: "middle", value: value, formatter: valueFormatter }), _jsx(ItemLabel, { indexes: indexes, x: 0, y: size + gap, width: size, alignHorizontal: "center", fontSize: 12, fill: themeColors.colorTextSecondary, children: datum.label })] })));
};
function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}
function polarToCartesian(cx, cy, radius, angleInDegrees) {
    const rad = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
        x: cx + radius * Math.cos(rad),
        y: cy + radius * Math.sin(rad),
    };
}
registerItem('circular-progress', {
    component: CircularProgress,
    composites: ['label', 'value'],
});
