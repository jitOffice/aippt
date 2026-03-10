import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { Group, Rect, getElementBounds } from '../../jsx/index.js';
import { ItemDesc, ItemLabel } from '../components/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
const underlineWidth = 80;
const underlineHeight = 3;
export const UnderlineText = (props) => {
    const [{ datum, indexes, width = 200, gap = 4, positionH = 'center', themeColors }, restProps,] = getItemProps(props, ['width', 'height', 'gap']);
    // 获取各元素的尺寸
    const labelBounds = getElementBounds(_jsx(ItemLabel, { indexes: indexes, fontSize: 18, fontWeight: "bold", width: width, children: datum.label }));
    const descBounds = datum.desc
        ? getElementBounds(_jsx(ItemDesc, { indexes: indexes, width: width, wordWrap: true, children: datum.desc }))
        : { width: 0, height: 0 };
    // 计算内容总高度
    const contentHeight = labelBounds.height +
        gap +
        underlineHeight +
        (datum.desc ? gap * 2 + descBounds.height : 0);
    // 标题位置
    const titleX = 0; // 使用 alignHorizontal 控制对齐
    const titleY = 0;
    // 对齐方式
    const alignHorizontal = positionH === 'center'
        ? 'center'
        : positionH === 'flipped'
            ? 'right'
            : 'left';
    // 下划线位置（受 positionH 控制）
    const underlineX = positionH === 'center'
        ? (width - underlineWidth) / 2
        : positionH === 'flipped'
            ? width - underlineWidth
            : 0;
    const underlineY = titleY + labelBounds.height + gap;
    // 描述文本位置
    const descX = 0; // 使用 alignHorizontal 控制对齐
    const descY = underlineY + underlineHeight + gap * 2;
    return (_jsxs(Group, Object.assign({ width: width, height: contentHeight }, restProps, { children: [datum.label && (_jsx(ItemLabel, { indexes: indexes, x: titleX, y: titleY, width: width, alignHorizontal: alignHorizontal, fill: themeColors.colorPrimary, fontSize: 18, fontWeight: "bold", children: datum.label })), datum.label && (_jsx(Rect, { x: underlineX, y: underlineY, width: underlineWidth, height: underlineHeight, fill: themeColors.colorPrimary, "data-element-type": "shape" })), datum.desc && (_jsx(ItemDesc, { indexes: indexes, width: width, x: descX, y: descY, alignHorizontal: alignHorizontal, wordWrap: true, fill: themeColors.colorText, children: datum.desc }))] })));
};
registerItem('underline-text', {
    component: UnderlineText,
    composites: ['label', 'desc'],
});
