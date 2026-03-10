import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Group, Path, Polygon } from '../../jsx/index.js';
import { ItemDesc, ItemIcon, ItemLabel } from '../components/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const LCornerCard = (props) => {
    const [{ indexes, datum, width = 140, iconSize = 24, themeColors }, restProps,] = getItemProps(props, ['width', 'iconSize']);
    const { label, desc } = datum;
    const lStroke = 8;
    const arrowSize = 16;
    const arrowGap = 12;
    const descX = arrowSize + arrowGap;
    const descWidth = width - descX;
    const descHeight = 60;
    const verticalLen = iconSize + 44;
    const arrowX1 = arrowSize;
    const arrowY1 = descHeight + arrowGap;
    const arrowY2 = descHeight + arrowSize + arrowGap;
    const arrowVertices = [
        { x: 0, y: arrowY2 },
        { x: arrowX1, y: arrowY1 },
        { x: arrowX1, y: arrowY2 },
    ];
    const innerWidth = width - arrowX1 - arrowGap;
    const lx1 = arrowX1 + arrowGap;
    const lx2 = lx1 + innerWidth;
    const ly1 = arrowY1 + lStroke / 2;
    const ly2 = ly1 + verticalLen;
    const d = `M ${lx1} ${ly2} L ${lx1} ${ly1} L ${lx2} ${ly1}`;
    const halfStroke = lStroke / 2;
    const x1 = lx1 + halfStroke;
    const y1 = ly1 + halfStroke;
    const gap = 8;
    return (_jsxs(Group, Object.assign({}, restProps, { children: [_jsx(ItemDesc, { indexes: indexes, x: descX, width: descWidth, height: descHeight, fontSize: 12, alignHorizontal: "left", alignVertical: "bottom", fill: themeColors.colorTextSecondary, children: desc }), _jsx(Polygon, { points: arrowVertices, fill: themeColors.colorPrimary, opacity: 0.9, width: arrowSize, height: arrowSize, "data-element-type": "shape" }), _jsx(Path, { d: d, stroke: themeColors.colorPrimary, strokeWidth: lStroke, fill: "none", "data-element-type": "shape" }), _jsx(ItemIcon, { indexes: indexes, x: x1 + innerWidth / 2 - iconSize / 2, y: y1 + gap, size: iconSize, fill: themeColors.colorPrimary }), _jsx(ItemLabel, { indexes: indexes, x: x1, y: y1 + iconSize + gap * 2, width: innerWidth, fontSize: 14, fontWeight: "bold", alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorText, children: label })] })));
};
registerItem('l-corner-card', {
    component: LCornerCard,
    composites: ['icon', 'label', 'desc'],
});
