import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Group, Path } from '../../jsx/index.js';
import { ItemDesc, ItemIcon, ItemLabel } from '../components/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const CandyCardLite = (props) => {
    const [{ indexes, datum, width = 280, height = 140, themeColors }, restProps,] = getItemProps(props, ['width', 'height']);
    return (_jsxs(Group, Object.assign({}, restProps, { children: [_jsx("rect", { x: 0, y: 0, width: width, height: height, rx: 22, ry: 22, fill: themeColors.colorPrimaryBg, stroke: themeColors.colorPrimary, "data-element-type": "shape" }), _jsx(Path, { x: width - 85, y: 0.5, width: 85, height: 65, d: "M0 0H62.4495C74.9557 0 85.4549 10.8574 84.4557 23.1875V60.1875L77.8772 62.5839C64.3776 67.6876 48.51 64.6893 37.8662 53.7441L10.2361 25.3312C4.91402 19.8571 1.65356 13.1736 0.435652 6.21819L0 0Z", fill: themeColors.colorBg, "data-element-type": "shape" }), _jsx(ItemLabel, { indexes: indexes, x: 20, y: 24, width: 200, alignHorizontal: "left", alignVertical: "middle", fill: themeColors.colorText, children: datum.label }), _jsx(ItemDesc, { indexes: indexes, x: 20, y: 58, width: 220, height: 70, fill: themeColors.colorTextSecondary, alignHorizontal: "left", alignVertical: "top", children: datum.desc }), _jsx(ItemIcon, { indexes: indexes, x: width - 48, y: 12, width: 32, height: 32, fill: themeColors.colorPrimary })] })));
};
registerItem('candy-card-lite', {
    component: CandyCardLite,
    composites: ['icon', 'label', 'desc'],
});
