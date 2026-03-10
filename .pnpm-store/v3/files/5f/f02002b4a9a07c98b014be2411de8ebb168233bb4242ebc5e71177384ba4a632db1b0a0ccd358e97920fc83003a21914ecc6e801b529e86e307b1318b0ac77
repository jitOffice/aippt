var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "../jsx-runtime.js";
import EventEmitter from 'eventemitter3';
import { Editor } from '../editor/index.js';
import { exportToPNGString, exportToSVGString, } from '../exporter/index.js';
import { renderSVG } from '../jsx/index.js';
import { parseOptions, } from '../options/index.js';
import { DEFAULT_FONT, Renderer, setDefaultFont } from '../renderer/index.js';
import { waitForSvgLoads } from '../resource/index.js';
import { parseSyntax } from '../syntax/index.js';
import { getTypes, parseSVG } from '../utils/index.js';
import { DEFAULT_OPTIONS } from './options.js';
import { cloneOptions, isCompleteParsedInfographicOptions, mergeOptions, } from './utils.js';
export class Infographic {
    constructor(options) {
        this.rendered = false;
        this.emitter = new EventEmitter();
        this.node = null;
        this.initialOptions = {};
        this.setOptions(options, 'replace', true);
    }
    getOptions() {
        return this.options;
    }
    setOptions(options, mode = 'replace', isInitial = false) {
        const { options: parsedOptions, errors, warnings, } = parseSyntaxOptions(options);
        if (isInitial) {
            this.initialOptions = parsedOptions;
        }
        const base = mode === 'replace'
            ? mergeOptions(cloneOptions(this.initialOptions || {}), parsedOptions)
            : mergeOptions(this.options || cloneOptions(this.initialOptions || {}), parsedOptions);
        this.options = base;
        this.parsedOptions = parseOptions(mergeOptions(DEFAULT_OPTIONS, this.options));
        if (warnings.length) {
            this.emitter.emit('warning', warnings);
        }
        if (errors.length) {
            this.emitter.emit('error', errors);
        }
    }
    /**
     * Render the infographic into the container
     */
    render(options) {
        if (options) {
            this.setOptions(options, 'replace');
        }
        else if (!this.options && this.initialOptions) {
            this.setOptions(this.initialOptions, 'replace');
        }
        this.performRender();
    }
    update(options) {
        this.setOptions(options, 'merge');
        this.performRender();
    }
    performRender() {
        var _a;
        const parsedOptions = this.parsedOptions;
        if (!isCompleteParsedInfographicOptions(parsedOptions)) {
            this.emitter.emit('error', new Error('Incomplete options'));
            return;
        }
        const { container } = this.parsedOptions;
        const template = this.compose(parsedOptions);
        const renderer = new Renderer(parsedOptions, template);
        this.node = renderer.render();
        container === null || container === void 0 ? void 0 : container.replaceChildren(this.node);
        (_a = this.editor) === null || _a === void 0 ? void 0 : _a.destroy();
        this.editor = undefined;
        if (this.options.editable) {
            this.editor = new Editor(this.emitter, this.node, parsedOptions);
        }
        this.rendered = true;
        this.emitter.emit('rendered', { node: this.node, options: this.options });
        const currentNode = this.node;
        if (currentNode) {
            void waitForSvgLoads(currentNode).then(() => {
                if (this.node !== currentNode)
                    return;
                this.emitter.emit('loaded', {
                    node: currentNode,
                    options: this.options,
                });
            });
        }
        return true;
    }
    /**
     * Compose the SVG template
     */
    compose(parsedOptions) {
        var _a, _b;
        const { design, data, themeConfig } = parsedOptions;
        const { title, item, items, structure } = design;
        const { component: Structure, props: structureProps } = structure;
        const Title = title.component;
        const Item = item.component;
        const Items = items.map((it) => it.component);
        // Apply theme font-family before measurement so measureText uses the correct font
        const themeFontFamily = (_b = (_a = themeConfig === null || themeConfig === void 0 ? void 0 : themeConfig.base) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b['font-family'];
        const previousDefaultFont = DEFAULT_FONT;
        if (themeFontFamily)
            setDefaultFont(themeFontFamily);
        try {
            const svg = renderSVG(_jsx(Structure, Object.assign({ data: data, Title: Title, Item: Item, Items: Items, options: parsedOptions }, structureProps)));
            const template = parseSVG(svg);
            if (!template) {
                throw new Error('Failed to parse SVG template');
            }
            return template;
        }
        finally {
            // Restore previous default font
            if (themeFontFamily)
                setDefaultFont(previousDefaultFont);
        }
    }
    getTypes() {
        const parsedOptions = this.parsedOptions;
        if (!isCompleteParsedInfographicOptions(parsedOptions)) {
            this.emitter.emit('error', new Error('Incomplete options'));
            return;
        }
        const design = parsedOptions.design;
        const structure = design.structure.composites || [];
        const items = design.items.map((it) => it.composites || []);
        return getTypes({ structure, items });
    }
    /**
     * Export the infographic to data URL
     * @param options Export option
     * @returns Data URL string of the exported infographic
     * @description This method need to be called after `render()` and in a browser environment.
     */
    toDataURL(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.node) {
                throw new Error('Infographic is not rendered yet.');
            }
            if ((options === null || options === void 0 ? void 0 : options.type) === 'svg') {
                return yield exportToSVGString(this.node, options);
            }
            return yield exportToPNGString(this.node, options);
        });
    }
    on(event, listener) {
        this.emitter.on(event, listener);
    }
    off(event, listener) {
        this.emitter.off(event, listener);
    }
    destroy() {
        var _a, _b;
        (_a = this.editor) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = this.node) === null || _b === void 0 ? void 0 : _b.remove();
        this.node = null;
        this.rendered = false;
        this.emitter.emit('destroyed');
        this.emitter.removeAllListeners();
    }
}
function parseSyntaxOptions(input) {
    if (typeof input === 'string') {
        const { options, errors, warnings } = parseSyntax(input);
        return { options, errors, warnings };
    }
    return {
        options: cloneOptions(input),
        errors: [],
        warnings: [],
    };
}
