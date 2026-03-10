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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragElement = void 0;
const bounds_1 = require("../../jsx/utils/bounds");
const utils_1 = require("../../utils");
const commands_1 = require("../commands");
const utils_2 = require("../utils");
const base_1 = require("./base");
class DragElement extends base_1.Interaction {
    constructor() {
        super(...arguments);
        this.name = 'drag-element';
        this.selectionForDrag = [];
        this.willReplaceSelection = false;
        this.exclusiveStarted = false;
        this.dragItems = [];
        this.dragging = false;
        this.dragThreshold = 4;
        this.handleStart = (event) => {
            if (!this.interaction.isActive())
                return;
            if (event.pointerType === 'mouse' && event.button !== 0)
                return;
            const target = (0, utils_2.getEventTarget)(event.target);
            if (!target)
                return;
            if ((0, utils_1.isEditingText)(target))
                return;
            const svg = this.editor.getDocument();
            this.pointerId = event.pointerId;
            this.startPoint = (0, utils_2.clientToViewport)(svg, event.clientX, event.clientY);
            this.dragging = false;
            this.startTarget = target;
            const isSelected = this.interaction.isSelected(target);
            this.selectionForDrag = isSelected
                ? this.interaction.getSelection()
                : [target];
            this.willReplaceSelection = !isSelected;
            this.exclusiveStarted = false;
            this.startBounds = this.getSelectionBounds(this.selectionForDrag);
            this.guideCandidates = this.collectGuideCandidates(this.selectionForDrag);
            window.addEventListener('pointermove', this.handleMove);
            window.addEventListener('pointerup', this.handleEnd);
            window.addEventListener('pointercancel', this.handleEnd);
        };
        this.handleMove = (event) => {
            if (event.pointerId !== this.pointerId || !this.startPoint)
                return;
            const svg = this.editor.getDocument();
            const current = (0, utils_2.clientToViewport)(svg, event.clientX, event.clientY);
            const dx = current.x - this.startPoint.x;
            const dy = current.y - this.startPoint.y;
            if (!this.dragging) {
                if (Math.hypot(dx, dy) < this.dragThreshold)
                    return;
                if (!this.startDrag()) {
                    this.reset();
                    return;
                }
                this.dragging = true;
            }
            const altKey = event.altKey;
            const snap = !altKey
                ? this.getSnappedDelta(dx, dy)
                : { dx, dy };
            event.preventDefault();
            event.stopPropagation();
            this.updateGuides(snap);
            this.applyTranslation(snap.dx, snap.dy);
            this.emitGeometryChange();
        };
        this.handleEnd = (event) => {
            if (event.pointerId !== this.pointerId || !this.startPoint)
                return;
            this.detachPointerListeners();
            const svg = this.editor.getDocument();
            const endPoint = (0, utils_2.clientToViewport)(svg, event.clientX, event.clientY);
            const dx = endPoint.x - this.startPoint.x;
            const dy = endPoint.y - this.startPoint.y;
            const moved = this.dragging || Math.hypot(dx, dy) >= this.dragThreshold;
            if (moved && this.dragItems.length && this.exclusiveStarted) {
                event.preventDefault();
                event.stopPropagation();
                const snap = event.altKey
                    ? { dx, dy }
                    : this.getSnappedDelta(dx, dy);
                this.updateGuides(snap);
                this.applyTranslation(snap.dx, snap.dy);
                this.commitTranslation(snap.dx, snap.dy);
                this.emitGeometryChange();
            }
            this.reset();
        };
    }
    init(options) {
        super.init(options);
        this.editor.getDocument().addEventListener('pointerdown', this.handleStart);
    }
    destroy() {
        this.detachPointerListeners();
        this.editor
            .getDocument()
            .removeEventListener('pointerdown', this.handleStart);
    }
    startDrag() {
        if (this.exclusiveStarted)
            return true;
        if (!this.startTarget)
            return false;
        this.dragItems = this.selectionForDrag
            .filter((element) => (0, utils_1.isEditableText)(element))
            .map((element) => this.createDragItem(element))
            .filter(Boolean);
        if (this.dragItems.length === 0)
            return false;
        let started = false;
        this.interaction.executeExclusiveInteraction(this, () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                // 只有拿到锁之后，才真正执行选中逻辑
                if (this.willReplaceSelection && this.startTarget) {
                    this.interaction.select([this.startTarget], 'replace');
                }
                this.completeInteraction = resolve;
                started = true;
            });
        }));
        this.exclusiveStarted = started;
        return started;
    }
    applyTranslation(dx, dy) {
        this.dragItems.forEach((item) => {
            if (item.mode === 'attr') {
                const x = item.startX + dx;
                const y = item.startY + dy;
                const attrs = { x, y };
                if (item.hasDataX)
                    attrs['data-x'] = x;
                if (item.hasDataY)
                    attrs['data-y'] = y;
                (0, utils_1.setAttributes)(item.element, attrs);
            }
            else {
                const transform = this.composeTransform(item.startX + dx, item.startY + dy, item.restTransform);
                (0, utils_1.setAttributes)(item.element, { transform });
            }
        });
    }
    commitTranslation(dx, dy) {
        if (Math.abs(dx) < 1e-6 && Math.abs(dy) < 1e-6)
            return;
        const commands = this.dragItems.map((item) => {
            if (item.mode === 'attr') {
                const x = item.startX + dx;
                const y = item.startY + dy;
                const modifiedAttrs = { x, y };
                const originalAttrs = {};
                if (item.hasX) {
                    originalAttrs.x = item.startX;
                }
                else {
                    originalAttrs.x = null;
                }
                if (item.hasY) {
                    originalAttrs.y = item.startY;
                }
                else {
                    originalAttrs.y = null;
                }
                if (item.hasDataX) {
                    modifiedAttrs['data-x'] = x;
                    originalAttrs['data-x'] = item.startX;
                }
                if (item.hasDataY) {
                    modifiedAttrs['data-y'] = y;
                    originalAttrs['data-y'] = item.startY;
                }
                return new commands_1.UpdateElementCommand(item.element, { attributes: modifiedAttrs }, { attributes: originalAttrs });
            }
            const transform = this.composeTransform(item.startX + dx, item.startY + dy, item.restTransform);
            const originalTransform = item.originalTransform !== undefined ? item.originalTransform : null;
            return new commands_1.UpdateElementCommand(item.element, { attributes: { transform } }, { attributes: { transform: originalTransform } });
        });
        if (commands.length) {
            this.commander.executeBatch(commands);
        }
    }
    createDragItem(element) {
        const transformInfo = this.getTransformInfo(element);
        if (transformInfo) {
            return {
                element,
                mode: 'transform',
                startX: transformInfo.x,
                startY: transformInfo.y,
                hasX: false,
                hasY: false,
                hasDataX: false,
                hasDataY: false,
                restTransform: transformInfo.rest,
                originalTransform: transformInfo.original,
            };
        }
        const { x, y, hasX, hasY, hasDataX, hasDataY } = this.getAttrInfo(element);
        return {
            element,
            mode: 'attr',
            startX: x,
            startY: y,
            hasX,
            hasY,
            hasDataX,
            hasDataY,
        };
    }
    getAttrInfo(element) {
        const svg = this.editor.getDocument();
        const { x: bx, y: by } = (0, utils_2.getElementViewportBounds)(svg, element);
        const attrs = (0, utils_1.getAttributes)(element, ['x', 'y', 'data-x', 'data-y'], false);
        const hasX = attrs.x !== null && attrs.x !== undefined;
        const hasY = attrs.y !== null && attrs.y !== undefined;
        const hasDataX = attrs['data-x'] !== null && attrs['data-x'] !== undefined;
        const hasDataY = attrs['data-y'] !== null && attrs['data-y'] !== undefined;
        const parseNumber = (value, fallback) => {
            const num = value !== null && value !== undefined ? Number(value) : NaN;
            return Number.isFinite(num) ? num : fallback;
        };
        const xFromAttr = parseNumber(attrs.x, NaN);
        const yFromAttr = parseNumber(attrs.y, NaN);
        const xFromData = parseNumber(attrs['data-x'], NaN);
        const yFromData = parseNumber(attrs['data-y'], NaN);
        const x = Number.isFinite(xFromAttr)
            ? xFromAttr
            : Number.isFinite(xFromData)
                ? xFromData
                : bx;
        const y = Number.isFinite(yFromAttr)
            ? yFromAttr
            : Number.isFinite(yFromData)
                ? yFromData
                : by;
        return { x, y, hasX, hasY, hasDataX, hasDataY };
    }
    getTransformInfo(element) {
        const transform = element.getAttribute('transform');
        if (transform === null)
            return null;
        const match = transform.match(/translate\(\s*([-\d.]+)(?:[ ,]\s*([-\d.]+))?\s*\)/i);
        if (!match) {
            return { x: 0, y: 0, rest: transform, original: transform };
        }
        const x = Number(match[1]) || 0;
        const y = match[2] !== undefined ? Number(match[2]) || 0 : 0;
        const rest = transform.replace(match[0], '').trim();
        return { x, y, rest, original: transform };
    }
    composeTransform(x, y, rest) {
        const translate = `translate(${x}, ${y})`;
        return rest && rest.length ? `${translate} ${rest}` : translate;
    }
    emitGeometryChange() {
        var _a;
        const target = (_a = this.dragItems[0]) === null || _a === void 0 ? void 0 : _a.element;
        if (!target)
            return;
        const rect = (0, utils_2.getElementViewportBounds)(this.editor.getDocument(), target);
        this.emitter.emit('selection:geometrychange', {
            type: 'selection:geometrychange',
            target,
            rect,
        });
    }
    detachPointerListeners() {
        window.removeEventListener('pointermove', this.handleMove);
        window.removeEventListener('pointerup', this.handleEnd);
        window.removeEventListener('pointercancel', this.handleEnd);
    }
    reset() {
        var _a;
        this.detachPointerListeners();
        this.clearGuides();
        this.pointerId = undefined;
        this.startPoint = undefined;
        this.dragItems = [];
        this.startTarget = undefined;
        this.selectionForDrag = [];
        this.willReplaceSelection = false;
        this.exclusiveStarted = false;
        this.dragging = false;
        this.startBounds = undefined;
        this.guideCandidates = undefined;
        (_a = this.completeInteraction) === null || _a === void 0 ? void 0 : _a.call(this);
        this.completeInteraction = undefined;
    }
    getSelectionBounds(selection) {
        if (!selection.length)
            return undefined;
        const svg = this.editor.getDocument();
        const rects = selection.map((el) => (0, utils_2.getElementViewportBounds)(svg, el));
        return (0, bounds_1.getCombinedBounds)(rects);
    }
    collectGuideCandidates(selection) {
        const svg = this.editor.getDocument();
        const skip = new Set(selection);
        const elements = Array.from(svg.querySelectorAll('[data-element-type]')).filter((el) => !skip.has(el));
        const vertical = [];
        const horizontal = [];
        elements.forEach((el) => {
            const { x, y, width, height } = (0, utils_2.getElementViewportBounds)(svg, el);
            vertical.push(x, x + width / 2, x + width);
            horizontal.push(y, y + height / 2, y + height);
        });
        return { vertical, horizontal };
    }
    getSnappedDelta(dx, dy) {
        if (!this.startBounds || !this.guideCandidates)
            return { dx, dy };
        const moving = {
            x: this.startBounds.x + dx,
            y: this.startBounds.y + dy,
            width: this.startBounds.width,
            height: this.startBounds.height,
        };
        const snapX = this.getSnapOffset([moving.x, moving.x + moving.width / 2, moving.x + moving.width], this.guideCandidates.vertical);
        const snapY = this.getSnapOffset([moving.y, moving.y + moving.height / 2, moving.y + moving.height], this.guideCandidates.horizontal);
        return {
            dx: dx + ((snapX === null || snapX === void 0 ? void 0 : snapX.offset) || 0),
            dy: dy + ((snapY === null || snapY === void 0 ? void 0 : snapY.offset) || 0),
            snapX,
            snapY,
        };
    }
    getSnapOffset(points, candidates, threshold = 5) {
        let best = null;
        points.forEach((point) => {
            candidates.forEach((c) => {
                const delta = c - point;
                if (Math.abs(delta) <= threshold) {
                    if (!best || Math.abs(delta) < Math.abs(best.offset)) {
                        best = { offset: delta, at: c };
                    }
                }
            });
        });
        return best || undefined;
    }
    ensureGuideLine(orientation) {
        const existing = orientation === 'vertical' ? this.guideVertical : this.guideHorizontal;
        if (existing)
            return existing;
        const line = this.interaction.appendTransientElement((0, utils_1.createElement)('line', {
            stroke: '#FF7A45',
            'stroke-width': 1,
            'stroke-dasharray': '4 4',
            'pointer-events': 'none',
            visibility: 'hidden',
        }));
        if (orientation === 'vertical')
            this.guideVertical = line;
        else
            this.guideHorizontal = line;
        return line;
    }
    updateGuides(snap) {
        const svg = this.editor.getDocument();
        const { width, height } = svg.viewBox.baseVal;
        if (snap.snapX) {
            const line = this.ensureGuideLine('vertical');
            (0, utils_1.setAttributes)(line, {
                x1: snap.snapX.at,
                y1: 0,
                x2: snap.snapX.at,
                y2: height,
                visibility: 'visible',
            });
        }
        else if (this.guideVertical) {
            this.guideVertical.setAttribute('visibility', 'hidden');
        }
        if (snap.snapY) {
            const line = this.ensureGuideLine('horizontal');
            (0, utils_1.setAttributes)(line, {
                x1: 0,
                y1: snap.snapY.at,
                x2: width,
                y2: snap.snapY.at,
                visibility: 'visible',
            });
        }
        else if (this.guideHorizontal) {
            this.guideHorizontal.setAttribute('visibility', 'hidden');
        }
    }
    clearGuides() {
        var _a, _b;
        (_a = this.guideVertical) === null || _a === void 0 ? void 0 : _a.remove();
        (_b = this.guideHorizontal) === null || _b === void 0 ? void 0 : _b.remove();
        this.guideVertical = undefined;
        this.guideHorizontal = undefined;
    }
}
exports.DragElement = DragElement;
