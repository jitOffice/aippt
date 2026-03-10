"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Infographic = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const editor_1 = require("../editor");
const exporter_1 = require("../exporter");
const jsx_1 = require("../jsx");
const options_1 = require("../options");
const renderer_1 = require("../renderer");
const resource_1 = require("../resource");
const syntax_1 = require("../syntax");
const utils_1 = require("../utils");
const options_2 = require("./options");
const utils_2 = require("./utils");
class Infographic {
    constructor(options) {
        this.rendered = false;
        this.emitter = new eventemitter3_1.default();
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
            ? (0, utils_2.mergeOptions)((0, utils_2.cloneOptions)(this.initialOptions || {}), parsedOptions)
            : (0, utils_2.mergeOptions)(this.options || (0, utils_2.cloneOptions)(this.initialOptions || {}), parsedOptions);
        this.options = base;
        this.parsedOptions = (0, options_1.parseOptions)((0, utils_2.mergeOptions)(options_2.DEFAULT_OPTIONS, this.options));
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
        if (!(0, utils_2.isCompleteParsedInfographicOptions)(parsedOptions)) {
            this.emitter.emit('error', new Error('Incomplete options'));
            return;
        }
        const { container } = this.parsedOptions;
        const template = this.compose(parsedOptions);
        const renderer = new renderer_1.Renderer(parsedOptions, template);
        this.node = renderer.render();
        container === null || container === void 0 ? void 0 : container.replaceChildren(this.node);
        (_a = this.editor) === null || _a === void 0 ? void 0 : _a.destroy();
        this.editor = undefined;
        if (this.options.editable) {
            this.editor = new editor_1.Editor(this.emitter, this.node, parsedOptions);
        }
        this.rendered = true;
        this.emitter.emit('rendered', { node: this.node, options: this.options });
        const currentNode = this.node;
        if (currentNode) {
            void (0, resource_1.waitForSvgLoads)(currentNode).then(() => {
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
        const previousDefaultFont = renderer_1.DEFAULT_FONT;
        if (themeFontFamily)
            (0, renderer_1.setDefaultFont)(themeFontFamily);
        try {
            const svg = (0, jsx_1.renderSVG)((0, jsx_runtime_1.jsx)(Structure, Object.assign({ data: data, Title: Title, Item: Item, Items: Items, options: parsedOptions }, structureProps)));
            const template = (0, utils_1.parseSVG)(svg);
            if (!template) {
                throw new Error('Failed to parse SVG template');
            }
            return template;
        }
        finally {
            // Restore previous default font
            if (themeFontFamily)
                (0, renderer_1.setDefaultFont)(previousDefaultFont);
        }
    }
    getTypes() {
        const parsedOptions = this.parsedOptions;
        if (!(0, utils_2.isCompleteParsedInfographicOptions)(parsedOptions)) {
            this.emitter.emit('error', new Error('Incomplete options'));
            return;
        }
        const design = parsedOptions.design;
        const structure = design.structure.composites || [];
        const items = design.items.map((it) => it.composites || []);
        return (0, utils_1.getTypes)({ structure, items });
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
                return yield (0, exporter_1.exportToSVGString)(this.node, options);
            }
            return yield (0, exporter_1.exportToPNGString)(this.node, options);
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
exports.Infographic = Infographic;
function parseSyntaxOptions(input) {
    if (typeof input === 'string') {
        const { options, errors, warnings } = (0, syntax_1.parseSyntax)(input);
        return { options, errors, warnings };
    }
    return {
        options: (0, utils_2.cloneOptions)(input),
        errors: [],
        warnings: [],
    };
}
