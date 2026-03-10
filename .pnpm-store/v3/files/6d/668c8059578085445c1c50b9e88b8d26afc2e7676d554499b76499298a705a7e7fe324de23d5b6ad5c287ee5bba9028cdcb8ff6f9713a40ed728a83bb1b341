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
import { camelCase } from 'lodash-es';
import { decodeFontFamily, encodeFontFamily } from './font.js';
import { measureText } from './measure-text.js';
import { isForeignObjectElement } from './recognizer.js';
import { createElement, setAttributes } from './svg.js';
export function getTextEntity(text) {
    if (!isForeignObjectElement(text))
        return null;
    return text.querySelector('span');
}
export function createTextElement(textContent, attributes) {
    const entity = document.createElement('span');
    // Set xmlns on the span element (HTML content)
    entity.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    const foreignObject = createElement('foreignObject', { overflow: 'visible' });
    foreignObject.appendChild(entity);
    updateTextElement(foreignObject, { textContent, attributes });
    return foreignObject;
}
export function updateTextElement(text, props) {
    const { textContent, attributes } = props;
    if (textContent !== undefined) {
        setTextContent(text, textContent);
    }
    if (!attributes)
        return;
    const entity = getTextEntity(text);
    let { width, height } = attributes;
    const textAttrs = {};
    if (entity) {
        Object.assign(entity.style, getTextStyle(attributes));
        if (!width || !height) {
            const content = textContent !== null && textContent !== void 0 ? textContent : getTextContent(text);
            const { fontFamily, fontSize, fontWeight, lineHeight } = entity.style;
            const fSize = fontSize ? parseFloat(String(fontSize)) : 12;
            const rect = measureText(content, {
                fontFamily,
                fontSize: fSize,
                fontWeight,
                lineHeight: lineHeight.endsWith('px')
                    ? parseFloat(lineHeight)
                    : (parseFloat(lineHeight) || 1.4) * fSize,
            });
            if (!width && !text.hasAttribute('width'))
                width = String(rect.width);
            if (!height && !text.hasAttribute('height'))
                height = String(rect.height);
        }
        // 以下属性需要完成包围盒测量后再设置
        const { 'data-horizontal-align': horizontal, 'data-vertical-align': vertical, } = attributes;
        Object.assign(entity.style, alignToFlex(horizontal, vertical));
    }
    const { id, x, y } = attributes;
    if (id)
        textAttrs.id = id;
    if (x !== undefined)
        textAttrs.x = String(x);
    if (y !== undefined)
        textAttrs.y = String(y);
    if (width !== undefined)
        textAttrs.width = String(width);
    if (height !== undefined)
        textAttrs.height = String(height);
    setAttributes(text, textAttrs);
}
function alignToFlex(horizontal, vertical) {
    const style = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    };
    switch (horizontal) {
        case 'LEFT':
            style.textAlign = 'left';
            style.justifyContent = 'flex-start';
            break;
        case 'CENTER':
            style.textAlign = 'center';
            style.justifyContent = 'center';
            break;
        case 'RIGHT':
            style.textAlign = 'right';
            style.justifyContent = 'flex-end';
            break;
    }
    switch (vertical) {
        case 'TOP':
            style.alignContent = 'flex-start';
            style.alignItems = 'flex-start';
            break;
        case 'MIDDLE':
            style.alignContent = 'center';
            style.alignItems = 'center';
            break;
        case 'BOTTOM':
            style.alignContent = 'flex-end';
            style.alignItems = 'flex-end';
            break;
    }
    return style;
}
export function getTextStyle(attributes) {
    const { x, y, width, height, ['data-horizontal-align']: horizontalAlign, // omit
    ['data-vertical-align']: verticalAlign, // omit
    ['font-size']: fontSize, ['letter-spacing']: letterSpacing, ['line-height']: lineHeight, fill, ['stroke-width']: strokeWidth, ['text-anchor']: textAnchor, // omit
    ['dominant-baseline']: dominantBaseline, // omit
    ['font-family']: fontFamily } = attributes, restAttrs = __rest(attributes, ["x", "y", "width", "height", 'data-horizontal-align', 'data-vertical-align', 'font-size', 'letter-spacing', 'line-height', "fill", 'stroke-width', 'text-anchor', 'dominant-baseline', 'font-family']);
    const style = {
        overflow: 'visible',
        // userSelect: 'none',
    };
    if (fill)
        style.color = fill;
    Object.entries(restAttrs).forEach(([key, value]) => {
        style[camelCase(key)] = value;
    });
    if (fontSize)
        style.fontSize = `${fontSize}px`;
    if (lineHeight)
        style.lineHeight =
            typeof lineHeight === 'string' && lineHeight.endsWith('px')
                ? lineHeight
                : +lineHeight;
    if (letterSpacing)
        style.letterSpacing = `${letterSpacing}px`;
    if (strokeWidth)
        style.strokeWidth = `${strokeWidth}px`;
    if (fontFamily)
        style.fontFamily = encodeFontFamily(fontFamily);
    return style;
}
export function getTextContent(text) {
    const entity = getTextEntity(text);
    if (!entity)
        return '';
    return entity.innerText || entity.textContent || '';
}
export function setTextContent(text, content) {
    const entity = getTextEntity(text);
    if (entity) {
        try {
            entity.innerText = content;
        }
        catch (_a) {
            entity.textContent = content;
        }
    }
}
export function getTextElementProps(text) {
    const entity = getTextEntity(text);
    if (!entity)
        return {};
    const { color, fontSize, fontFamily, justifyContent, alignContent, fontWeight, } = entity.style;
    const [horizontal, vertical] = flexToAlign(justifyContent, alignContent);
    const attrs = {
        'data-horizontal-align': horizontal,
        'data-vertical-align': vertical,
    };
    if (fontFamily)
        attrs['font-family'] = decodeFontFamily(fontFamily);
    if (fontWeight)
        attrs['font-weight'] = fontWeight;
    if (fontSize)
        attrs['font-size'] = String(parseInt(fontSize));
    if (color)
        attrs['fill'] = color;
    return { attributes: attrs, textContent: getTextContent(text) };
}
function flexToAlign(justifyContent, alignContent) {
    let horizontal = 'LEFT';
    let vertical = 'TOP';
    switch (justifyContent) {
        case 'flex-start':
            horizontal = 'LEFT';
            break;
        case 'center':
            horizontal = 'CENTER';
            break;
        case 'flex-end':
            horizontal = 'RIGHT';
            break;
    }
    switch (alignContent) {
        case 'flex-start':
            vertical = 'TOP';
            break;
        case 'center':
            vertical = 'MIDDLE';
            break;
        case 'flex-end':
            vertical = 'BOTTOM';
            break;
    }
    return [horizontal, vertical];
}
