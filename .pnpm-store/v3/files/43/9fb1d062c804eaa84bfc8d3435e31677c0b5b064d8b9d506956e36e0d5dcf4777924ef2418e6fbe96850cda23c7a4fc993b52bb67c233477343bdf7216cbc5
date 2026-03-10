var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { measureText } from '../../utils/index.js';
export function Text(props) {
    const { id, x = 0, y = 0, width: w, height: h, alignHorizontal = 'left', alignVertical = 'top', children, fontSize = 14, fontFamily, fontStyle, fontWeight, textDecoration, letterSpacing, wordSpacing, opacity, fill = 'black', lineHeight, wordWrap, backgroundColor = 'none', backgroundOpacity = 1, backgroundRadius = 0 } = props, restProps = __rest(props, ["id", "x", "y", "width", "height", "alignHorizontal", "alignVertical", "children", "fontSize", "fontFamily", "fontStyle", "fontWeight", "textDecoration", "letterSpacing", "wordSpacing", "opacity", "fill", "lineHeight", "wordWrap", "backgroundColor", "backgroundOpacity", "backgroundRadius"]);
    let width = w;
    let height = h;
    let textX = 0;
    let textY = 0;
    if (!width || !height) {
        const metrics = measureText(children, props);
        width || (width = metrics.width);
        height || (height = metrics.height);
    }
    // 如果由指定容器，那么需要对文本设置偏移量
    if (w) {
        textX =
            alignHorizontal === 'center'
                ? width / 2
                : alignHorizontal === 'right'
                    ? width
                    : 0;
    }
    if (h) {
        textY =
            alignVertical === 'middle'
                ? height / 2
                : alignVertical === 'bottom'
                    ? height
                    : 0;
    }
    const dataAttrs = Object.entries(Object.assign(Object.assign({ width,
        height }, (lineHeight !== undefined && { 'line-height': lineHeight })), (wordWrap !== undefined && { 'data-word-wrap': wordWrap }))).reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [key]: value })), {});
    const textAnchor = alignHorizontal === 'center'
        ? 'middle'
        : alignHorizontal === 'right'
            ? 'end'
            : 'start';
    const dominantBaseline = alignVertical === 'middle'
        ? 'central'
        : alignVertical === 'bottom'
            ? 'baseline'
            : 'hanging';
    const textProps = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ 'data-element-type': 'text', width,
        height, x: textX, y: textY, 'data-x': 0, 'data-y': 0, fill,
        fontSize,
        textAnchor,
        dominantBaseline, 'data-horizontal-align': alignHorizontal.toUpperCase(), 'data-vertical-align': alignVertical.toUpperCase(), children }, dataAttrs), restProps), (fontFamily && { fontFamily })), (fontStyle && { fontStyle })), (fontWeight && { fontWeight })), (textDecoration && textDecoration !== 'none' && { textDecoration })), (letterSpacing && { letterSpacing })), (wordSpacing && { wordSpacing })), (opacity !== undefined && opacity !== 1 && { opacity }));
    const containerProps = Object.assign(Object.assign(Object.assign({}, (x !== 0 || y !== 0 ? { x, y, transform: `translate(${x}, ${y})` } : {})), { width,
        height }), (id && { id }));
    const hasBackground = backgroundColor && backgroundColor !== 'none';
    const rectProps = hasBackground
        ? {
            'data-element-type': 'shape',
            x: 0,
            y: 0,
            width,
            height,
            fill: backgroundColor,
            fillOpacity: backgroundOpacity,
            rx: backgroundRadius,
            ry: backgroundRadius,
        }
        : undefined;
    return {
        type: 'g',
        props: Object.assign(Object.assign({}, containerProps), { children: [
                ...(rectProps ? [{ type: 'rect', props: rectProps }] : []),
                { type: 'text', props: textProps },
            ] }),
    };
}
