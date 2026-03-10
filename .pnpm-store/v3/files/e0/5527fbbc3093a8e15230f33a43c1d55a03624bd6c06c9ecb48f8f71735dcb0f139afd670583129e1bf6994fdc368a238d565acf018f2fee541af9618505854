"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
const utils_1 = require("../utils");
const composites_1 = require("./composites");
const fonts_1 = require("./fonts");
const upsert = (original, modified) => {
    if (original === modified)
        return;
    if (!modified)
        original.remove();
    else
        original.replaceWith(modified);
};
class Renderer {
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
            (0, fonts_1.loadFonts)(this.template);
            svg.style.removeProperty('visibility');
        };
        if (utils_1.isNode) {
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
exports.Renderer = Renderer;
function renderTemplate(svg, options) {
    fill(svg, options);
    setSVG(svg, options);
    (0, composites_1.renderBackground)(svg, options);
}
function fill(svg, options) {
    var _a;
    const { themeConfig, data } = options;
    (0, composites_1.renderBaseElement)(svg, (_a = themeConfig.base) === null || _a === void 0 ? void 0 : _a.global);
    const elements = svg.querySelectorAll(`[data-element-type]`);
    elements.forEach((element) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const id = element.id || '';
        if ((0, utils_1.isTitle)(element)) {
            const modified = (0, composites_1.renderText)(element, data.title || '', Object.assign({}, (_a = themeConfig.base) === null || _a === void 0 ? void 0 : _a.text, themeConfig.title, (_b = data.attributes) === null || _b === void 0 ? void 0 : _b.title));
            return upsert(element, modified);
        }
        if ((0, utils_1.isDesc)(element)) {
            const modified = (0, composites_1.renderText)(element, data.desc || '', Object.assign({}, (_c = themeConfig.base) === null || _c === void 0 ? void 0 : _c.text, themeConfig.desc, (_d = data.attributes) === null || _d === void 0 ? void 0 : _d.desc));
            return upsert(element, modified);
        }
        if ((0, utils_1.isIllus)(element)) {
            const modified = (0, composites_1.renderIllus)(svg, element, (_e = data.illus) === null || _e === void 0 ? void 0 : _e[id], undefined, (_f = data.attributes) === null || _f === void 0 ? void 0 : _f.illus);
            return upsert(element, modified);
        }
        if ((0, utils_1.isShapesGroup)(element)) {
            return Array.from(element.children).forEach((child) => {
                (0, composites_1.renderShape)(svg, child, options);
            });
        }
        if ((0, utils_1.isShape)(element)) {
            const modified = (0, composites_1.renderShape)(svg, element, options);
            return upsert(element, modified);
        }
        if ((0, utils_1.isBtnsGroup)(element)) {
            return (0, composites_1.renderButtonsGroup)(svg, element);
        }
        if ((_g = element.dataset.elementType) === null || _g === void 0 ? void 0 : _g.startsWith('item-')) {
            const indexes = (0, utils_1.getItemIndexes)(element.dataset.indexes || '0');
            const itemType = element.dataset.elementType.replace('item-', '');
            const datum = (0, utils_1.getDatumByIndexes)(data, indexes);
            if ((0, utils_1.isItemLabel)(element) || (0, utils_1.isItemDesc)(element) || (0, utils_1.isItemValue)(element)) {
                const modified = (0, composites_1.renderItemText)(itemType, element, options);
                return upsert(element, modified);
            }
            if (!datum)
                return;
            if ((0, utils_1.isItemIllus)(element)) {
                const modified = (0, composites_1.renderItemIllus)(svg, element, datum);
                return upsert(element, modified);
            }
            if ((0, utils_1.isItemIcon)(element)) {
                const modified = (0, composites_1.renderItemIcon)(svg, element, datum, options);
                return upsert(element, modified);
            }
        }
        if ((0, utils_1.isText)(element)) {
            return (0, composites_1.renderStaticText)(element, options);
        }
        if (!(0, utils_1.isGroup)(element)) {
            return (0, composites_1.renderStaticShape)(element, options);
        }
    });
    (0, composites_1.renderSVG)(svg, options);
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
    (0, utils_1.setAttributes)(svg, attributes);
}
function setView(svg, options) {
    const { padding = 0, viewBox } = options;
    if (viewBox) {
        svg.setAttribute('viewBox', viewBox);
    }
    else if (padding !== undefined) {
        (0, utils_1.setSVGPadding)(svg, (0, utils_1.parsePadding)(padding));
    }
}
