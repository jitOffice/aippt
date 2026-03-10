var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createElement, setAttributes } from '../../utils/index.js';
import { clientToViewport, getElementViewportBounds, getEventTarget, getSelectableTarget, isTextSelectionTarget, } from '../utils/index.js';
import { Interaction } from './base.js';
export class BrushSelect extends Interaction {
    constructor() {
        super(...arguments);
        this.name = 'brush-select';
        this.shiftKey = false;
        this.dragging = false;
        this.dragThreshold = 4;
        this.handleStart = (event) => {
            if (!this.interaction.isActive())
                return;
            if (event.button !== 0)
                return;
            if (isTextSelectionTarget(event.target))
                return;
            if (this.hasElementAtStart(event.target))
                return;
            this.interaction.executeExclusiveInteraction(this, () => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => {
                    this.completeInteraction = resolve;
                    const svg = this.editor.getDocument();
                    this.startPoint = clientToViewport(svg, event.clientX, event.clientY);
                    this.pointerId = event.pointerId;
                    this.shiftKey = event.shiftKey;
                    this.dragging = false;
                    window.addEventListener('pointermove', this.handleMove);
                    window.addEventListener('pointerup', this.handleEnd);
                });
            }));
        };
        this.handleMove = (event) => {
            if (event.pointerId !== this.pointerId || !this.startPoint)
                return;
            const svg = this.editor.getDocument();
            const current = clientToViewport(svg, event.clientX, event.clientY);
            const dx = current.x - this.startPoint.x;
            const dy = current.y - this.startPoint.y;
            if (!this.dragging) {
                if (Math.hypot(dx, dy) < this.dragThreshold)
                    return;
                this.dragging = true;
                this.ensureBrush();
                this.updateBrush(this.startPoint, current);
            }
            event.preventDefault();
            event.stopPropagation();
            this.updateBrush(this.startPoint, current);
        };
        this.handleEnd = (event) => {
            var _a, _b;
            if (event.pointerId !== this.pointerId || !this.startPoint)
                return;
            window.removeEventListener('pointermove', this.handleMove);
            window.removeEventListener('pointerup', this.handleEnd);
            let rect = null;
            if (this.dragging) {
                event.preventDefault();
                event.stopPropagation();
                const svg = this.editor.getDocument();
                const endPoint = clientToViewport(svg, event.clientX, event.clientY);
                rect = this.updateBrush(this.startPoint, endPoint);
                this.clearBrush();
            }
            this.pointerId = undefined;
            this.startPoint = undefined;
            this.dragging = false;
            const withShift = this.shiftKey;
            this.shiftKey = false;
            if (!rect) {
                (_a = this.completeInteraction) === null || _a === void 0 ? void 0 : _a.call(this);
                this.completeInteraction = undefined;
                return;
            }
            const selection = this.collectSelection(rect);
            (_b = this.completeInteraction) === null || _b === void 0 ? void 0 : _b.call(this);
            this.completeInteraction = undefined;
            if (selection.length === 0) {
                if (!withShift)
                    this.interaction.clearSelection();
                return;
            }
            const mode = withShift ? 'add' : 'replace';
            this.interaction.select(selection, mode);
        };
    }
    init(options) {
        super.init(options);
        this.editor.getDocument().addEventListener('pointerdown', this.handleStart);
    }
    destroy() {
        this.clearBrush();
        this.editor
            .getDocument()
            .removeEventListener('pointerdown', this.handleStart);
        window.removeEventListener('pointermove', this.handleMove);
        window.removeEventListener('pointerup', this.handleEnd);
    }
    ensureBrush() {
        if (this.brush)
            return this.brush;
        this.brush = this.interaction.appendTransientElement(createElement('rect', {
            fill: 'rgba(51, 132, 245, 0.08)',
            stroke: '#3384F5',
            'stroke-dasharray': '4 2',
            'stroke-width': 1,
            'pointer-events': 'none',
        }));
        return this.brush;
    }
    updateBrush(start, current) {
        if (!this.brush)
            return null;
        const x = Math.min(start.x, current.x);
        const y = Math.min(start.y, current.y);
        const width = Math.abs(start.x - current.x);
        const height = Math.abs(start.y - current.y);
        setAttributes(this.brush, { x, y, width, height });
        return { x, y, width, height };
    }
    clearBrush() {
        var _a;
        (_a = this.brush) === null || _a === void 0 ? void 0 : _a.remove();
        this.brush = undefined;
    }
    collectSelection(rect) {
        const svg = this.editor.getDocument();
        const candidates = Array.from(svg.querySelectorAll('[data-element-type]'));
        const intersects = (a, b) => {
            const ax2 = a.x + a.width;
            const ay2 = a.y + a.height;
            const bx2 = b.x + b.width;
            const by2 = b.y + b.height;
            return !(ax2 < b.x || bx2 < a.x || ay2 < b.y || by2 < a.y);
        };
        const collected = new Set();
        return candidates.reduce((selection, node) => {
            const element = getSelectableTarget(node);
            if (!element || collected.has(element))
                return selection;
            const bounds = getElementViewportBounds(svg, element);
            const targetRect = {
                x: bounds.x,
                y: bounds.y,
                width: bounds.width,
                height: bounds.height,
            };
            if (intersects(rect, targetRect)) {
                selection.push(element);
                collected.add(element);
            }
            return selection;
        }, []);
    }
    hasElementAtStart(target) {
        var _a;
        if (!(target instanceof Element))
            return false;
        if (getEventTarget(target))
            return true;
        return Boolean((_a = target.closest) === null || _a === void 0 ? void 0 : _a.call(target, '[data-element-type]'));
    }
}
