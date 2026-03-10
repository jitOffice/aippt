"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectHighlight = void 0;
const bounds_1 = require("../../jsx/utils/bounds");
const utils_1 = require("../../utils");
const utils_2 = require("../utils");
const base_1 = require("./base");
class SelectHighlight extends base_1.Interaction {
    constructor() {
        super(...arguments);
        this.name = 'select-highlight';
        this.highlightMasks = [];
        this.handleSelectionChanged = ({ next }) => {
            this.highlightSelection(next);
        };
        this.handleGeometryChanged = ({ target, }) => {
            if (this.interaction.isSelected(target)) {
                this.highlightSelection(this.interaction.getSelection());
            }
        };
        this.handleHistoryChanged = () => {
            this.highlightSelection(this.interaction.getSelection());
        };
    }
    init(options) {
        super.init(options);
        const { emitter } = options;
        emitter.on('selection:change', this.handleSelectionChanged);
        emitter.on('selection:geometrychange', this.handleGeometryChanged);
        emitter.on('history:change', this.handleHistoryChanged);
        this.highlightSelection(this.interaction.getSelection());
    }
    destroy() {
        this.clearMasks();
        const { emitter } = this;
        emitter.off('selection:change', this.handleSelectionChanged);
        emitter.off('selection:geometrychange', this.handleGeometryChanged);
        emitter.off('history:change', this.handleHistoryChanged);
    }
    highlightSelection(selection) {
        if (selection.length === 1 && (0, utils_1.isEditableText)(selection[0])) {
            this.clearMasks();
            return;
        }
        this.drawElementMasks(selection);
        this.drawCombinedBoundsMask(selection);
    }
    drawElementMasks(selection) {
        let index = 0;
        for (; index < selection.length; index++) {
            const { x, y, width, height } = (0, utils_2.getElementViewportBounds)(this.editor.getDocument(), selection[index]);
            const attrs = {
                x,
                y,
                width,
                height,
                fill: 'none',
                stroke: '#3384F5',
                'stroke-width': 1,
                'pointer-events': 'none',
            };
            const mask = this.highlightMasks[index];
            if (mask) {
                (0, utils_1.setAttributes)(mask, attrs);
            }
            else {
                this.highlightMasks[index] = this.interaction.appendTransientElement((0, utils_1.createElement)('rect', attrs));
            }
        }
        for (; index < this.highlightMasks.length; index++) {
            this.highlightMasks[index].remove();
        }
        this.highlightMasks = this.highlightMasks.slice(0, selection.length);
    }
    drawCombinedBoundsMask(selection) {
        var _a;
        if (selection.length < 2) {
            (_a = this.combinedBoundsMask) === null || _a === void 0 ? void 0 : _a.remove();
            this.combinedBoundsMask = undefined;
            return;
        }
        const bounds = (0, bounds_1.getCombinedBounds)(selection.map((element) => (0, utils_2.getElementViewportBounds)(this.editor.getDocument(), element)));
        const attrs = Object.assign(Object.assign({}, bounds), { fill: 'none', stroke: '#3384F5', 'stroke-width': 2, 'pointer-events': 'none' });
        if (this.combinedBoundsMask) {
            (0, utils_1.setAttributes)(this.combinedBoundsMask, attrs);
        }
        else {
            this.combinedBoundsMask = this.interaction.appendTransientElement((0, utils_1.createElement)('rect', attrs));
        }
    }
    clearMasks() {
        var _a;
        this.highlightMasks.forEach((mask) => mask.remove());
        this.highlightMasks = [];
        (_a = this.combinedBoundsMask) === null || _a === void 0 ? void 0 : _a.remove();
        this.combinedBoundsMask = undefined;
    }
}
exports.SelectHighlight = SelectHighlight;
