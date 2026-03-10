import { getCombinedBounds } from '../../jsx/utils/bounds.js';
import { createElement, isEditableText, setAttributes } from '../../utils/index.js';
import { getElementViewportBounds } from '../utils/index.js';
import { Interaction } from './base.js';
export class SelectHighlight extends Interaction {
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
        if (selection.length === 1 && isEditableText(selection[0])) {
            this.clearMasks();
            return;
        }
        this.drawElementMasks(selection);
        this.drawCombinedBoundsMask(selection);
    }
    drawElementMasks(selection) {
        let index = 0;
        for (; index < selection.length; index++) {
            const { x, y, width, height } = getElementViewportBounds(this.editor.getDocument(), selection[index]);
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
                setAttributes(mask, attrs);
            }
            else {
                this.highlightMasks[index] = this.interaction.appendTransientElement(createElement('rect', attrs));
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
        const bounds = getCombinedBounds(selection.map((element) => getElementViewportBounds(this.editor.getDocument(), element)));
        const attrs = Object.assign(Object.assign({}, bounds), { fill: 'none', stroke: '#3384F5', 'stroke-width': 2, 'pointer-events': 'none' });
        if (this.combinedBoundsMask) {
            setAttributes(this.combinedBoundsMask, attrs);
        }
        else {
            this.combinedBoundsMask = this.interaction.appendTransientElement(createElement('rect', attrs));
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
