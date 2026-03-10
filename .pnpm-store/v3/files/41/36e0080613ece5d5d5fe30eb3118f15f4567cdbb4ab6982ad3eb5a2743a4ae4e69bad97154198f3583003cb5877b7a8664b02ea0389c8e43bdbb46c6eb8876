import { getDatumByIndexes, getItemIndexes, isBtnsGroup, isDesc, isGroup, isIllus, isItemDesc, isItemIcon, isItemIllus, isItemLabel, isItemValue, isNode, isShape, isShapesGroup, isText, isTitle, parsePadding, setAttributes, setSVGPadding, } from '../utils/index.js';
import { renderBackground, renderBaseElement, renderButtonsGroup, renderIllus, renderItemIcon, renderItemIllus, renderItemText, renderShape, renderStaticShape, renderStaticText, renderSVG, renderText, } from './composites/index.js';
import { loadFonts } from './fonts/index.js';
const upsert = (original, modified) => {
    if (original === modified)
        return;
    if (!modified)
        original.remove();
    else
        original.replaceWith(modified);
};
export class Renderer {
    constructor(options, template) {
        this.options = options;
        this.template = template;
        this.rendered = false;
    }
    getOptions() {
        return this.options;
    }
    getSVG() {
        return this.template;
    }
    render() {
        const svg = this.getSVG();
        if (this.rendered)
            return svg;
        renderTemplate(svg, this.options);
        svg.style.visibility = 'hidden';
        const postRender = () => {
            setView(this.template, this.options);
            loadFonts(this.template);
            svg.style.removeProperty('visibility');
        };
        if (isNode) {
            postRender();
        }
        else {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node === svg || node.contains(svg)) {
                            postRender();
                            observer.disconnect();
                        }
                    });
                });
            });
            try {
                observer.observe(document, {
                    childList: true,
                    subtree: true,
                });
            }
            catch (error) {
                // Fallback for micro-app environments that proxy document.
                postRender();
                console.error(error);
            }
        }
        this.rendered = true;
        return svg;
    }
}
function renderTemplate(svg, options) {
    fill(svg, options);
    setSVG(svg, options);
    renderBackground(svg, options);
}
function fill(svg, options) {
    var _a;
    const { themeConfig, data } = options;
    renderBaseElement(svg, (_a = themeConfig.base) === null || _a === void 0 ? void 0 : _a.global);
    const elements = svg.querySelectorAll(`[data-element-type]`);
    elements.forEach((element) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const id = element.id || '';
        if (isTitle(element)) {
            const modified = renderText(element, data.title || '', Object.assign({}, (_a = themeConfig.base) === null || _a === void 0 ? void 0 : _a.text, themeConfig.title, (_b = data.attributes) === null || _b === void 0 ? void 0 : _b.title));
            return upsert(element, modified);
        }
        if (isDesc(element)) {
            const modified = renderText(element, data.desc || '', Object.assign({}, (_c = themeConfig.base) === null || _c === void 0 ? void 0 : _c.text, themeConfig.desc, (_d = data.attributes) === null || _d === void 0 ? void 0 : _d.desc));
            return upsert(element, modified);
        }
        if (isIllus(element)) {
            const modified = renderIllus(svg, element, (_e = data.illus) === null || _e === void 0 ? void 0 : _e[id], undefined, (_f = data.attributes) === null || _f === void 0 ? void 0 : _f.illus);
            return upsert(element, modified);
        }
        if (isShapesGroup(element)) {
            return Array.from(element.children).forEach((child) => {
                renderShape(svg, child, options);
            });
        }
        if (isShape(element)) {
            const modified = renderShape(svg, element, options);
            return upsert(element, modified);
        }
        if (isBtnsGroup(element)) {
            return renderButtonsGroup(svg, element);
        }
        if ((_g = element.dataset.elementType) === null || _g === void 0 ? void 0 : _g.startsWith('item-')) {
            const indexes = getItemIndexes(element.dataset.indexes || '0');
            const itemType = element.dataset.elementType.replace('item-', '');
            const datum = getDatumByIndexes(data, indexes);
            if (isItemLabel(element) || isItemDesc(element) || isItemValue(element)) {
                const modified = renderItemText(itemType, element, options);
                return upsert(element, modified);
            }
            if (!datum)
                return;
            if (isItemIllus(element)) {
                const modified = renderItemIllus(svg, element, datum);
                return upsert(element, modified);
            }
            if (isItemIcon(element)) {
                const modified = renderItemIcon(svg, element, datum, options);
                return upsert(element, modified);
            }
        }
        if (isText(element)) {
            return renderStaticText(element, options);
        }
        if (!isGroup(element)) {
            return renderStaticShape(element, options);
        }
    });
    renderSVG(svg, options);
}
function setSVG(svg, options) {
    const { width, height } = options;
    const { style = {}, attributes = {}, id, className } = options.svg || {};
    if (id)
        svg.id = id;
    if (className)
        svg.classList.add(className);
    if (width !== undefined) {
        svg.setAttribute('width', typeof width === 'number' ? `${width}px` : width);
    }
    if (height !== undefined) {
        svg.setAttribute('height', typeof height === 'number' ? `${height}px` : height);
    }
    Object.assign(svg.style, style);
    setAttributes(svg, attributes);
}
function setView(svg, options) {
    const { padding = 0, viewBox } = options;
    if (viewBox) {
        svg.setAttribute('viewBox', viewBox);
    }
    else if (padding !== undefined) {
        setSVGPadding(svg, parsePadding(padding));
    }
}
