import { createElement, getAttributes, isEditableText, setAttributes, } from '../../utils/index.js';
import { UpdateElementCommand } from '../commands/index.js';
import { getElementViewportBounds } from '../utils/index.js';
import { Plugin } from './base.js';
export class ResizeElement extends Plugin {
    constructor() {
        super(...arguments);
        this.name = 'resize-element';
        this.target = null;
        this.handles = [];
        this.activeHandle = null;
        this.activePointerId = null;
        this.handleSelectionChange = ({ next }) => {
            const only = next.length === 1 ? next[0] : null;
            if (only && isEditableText(only)) {
                this.target = only;
                this.updateHandles();
            }
            else {
                this.target = null;
                this.hideHandles();
                this.cancelDrag();
            }
        };
        this.handleDeactivate = () => {
            this.target = null;
            this.hideHandles();
            this.cancelDrag();
        };
        this.handleGeometryChange = ({ target, }) => {
            if (!this.target || target !== this.target)
                return;
            const rect = this.getViewportRect(this.target);
            this.lastViewportRect = rect;
            this.updateHandles(rect);
        };
        this.handleHistoryChange = () => {
            if (!this.target)
                return;
            const rect = this.getViewportRect(this.target);
            this.lastViewportRect = rect;
            this.updateHandles(rect);
        };
        this.handlePointerMove = (event) => {
            if (!this.target ||
                !this.startPointer ||
                !this.startRect ||
                !this.activeHandle ||
                (this.activePointerId !== null &&
                    event.pointerId !== this.activePointerId)) {
                return;
            }
            const point = this.clientToElement(this.target, event.clientX, event.clientY);
            const dx = point.x - this.startPointer.x;
            const dy = point.y - this.startPointer.y;
            const next = this.clampRect(this.applyDelta(this.startRect, dx, dy, this.activeHandle), this.activeHandle);
            this.lastRect = next;
            this.applyRect(this.target, next);
            this.lastViewportRect = this.getViewportRect(this.target);
            this.updateHandles(this.lastViewportRect);
            this.emitSelectionGeometryChange();
        };
        this.handlePointerUp = (event) => {
            if (this.activePointerId !== null &&
                event.pointerId !== this.activePointerId) {
                return;
            }
            const finalRect = this.lastRect;
            const original = this.startAttrs;
            const changed = finalRect &&
                this.startRect &&
                this.hasRectChanged(this.startRect, finalRect);
            this.cancelDrag();
            if (changed && this.target && finalRect && original) {
                this.commander.execute(new UpdateElementCommand(this.target, { attributes: finalRect }, { attributes: original }));
                this.lastViewportRect = this.getViewportRect(this.target);
                this.updateHandles(this.lastViewportRect);
                this.emitSelectionGeometryChange();
            }
            else if (this.target) {
                const viewportRect = this.lastViewportRect || this.getViewportRect(this.target);
                this.updateHandles(viewportRect);
            }
        };
    }
    init(options) {
        super.init(options);
        const { emitter } = options;
        emitter.on('selection:change', this.handleSelectionChange);
        emitter.on('selection:geometrychange', this.handleGeometryChange);
        emitter.on('history:change', this.handleHistoryChange);
        emitter.on('deactivated', this.handleDeactivate);
    }
    destroy() {
        this.cancelDrag();
        this.removeContainer();
        const { emitter } = this;
        emitter.off('selection:change', this.handleSelectionChange);
        emitter.off('selection:geometrychange', this.handleGeometryChange);
        emitter.off('history:change', this.handleHistoryChange);
        emitter.off('deactivated', this.handleDeactivate);
    }
    ensureContainer() {
        if (this.container)
            return this.container;
        const container = createElement('g', {
            'pointer-events': 'none',
        });
        this.overlay = createElement('rect', {
            fill: 'rgba(51, 132, 245, 0.06)',
            stroke: 'none',
            'pointer-events': 'none',
        });
        const outline = createElement('rect', {
            fill: 'none',
            stroke: '#3384F5',
            'stroke-width': 1,
            'stroke-dasharray': '4 2',
            'pointer-events': 'none',
        });
        container.appendChild(this.overlay);
        container.appendChild(outline);
        this.outline = outline;
        const handlePositions = ResizeElement.HANDLE_POSITIONS;
        const cursors = {
            'top-left': 'nwse-resize',
            top: 'ns-resize',
            'top-right': 'nesw-resize',
            right: 'ew-resize',
            'bottom-right': 'nwse-resize',
            bottom: 'ns-resize',
            'bottom-left': 'nesw-resize',
            left: 'ew-resize',
        };
        handlePositions.forEach((pos, index) => {
            const isEdge = pos === 'top' || pos === 'right' || pos === 'bottom' || pos === 'left';
            const handle = isEdge
                ? createElement('line', {
                    stroke: 'transparent',
                    'stroke-width': ResizeElement.LINE_STROKE_WIDTH,
                })
                : createElement('circle', {
                    r: ResizeElement.HANDLE_SIZE / 2,
                    fill: '#3384F5',
                    stroke: '#fff',
                    'stroke-width': 1.5,
                });
            handle.style.cursor = cursors[pos];
            handle.style.pointerEvents = 'all';
            handle.addEventListener('pointerdown', (event) => this.handlePointerDown(event, pos));
            handle.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();
            });
            container.appendChild(handle);
            this.handles[index] = handle;
        });
        this.editor.getDocument().appendChild(container);
        this.container = container;
        return container;
    }
    updateHandles(rect) {
        if (!this.target) {
            this.hideHandles();
            return;
        }
        const bounds = rect ||
            this.getViewportRect(this.target) ||
            this.lastViewportRect ||
            null;
        if (!bounds) {
            this.hideHandles();
            return;
        }
        this.lastViewportRect = bounds;
        const container = this.ensureContainer();
        container.style.display = 'block';
        this.outline.style.display = 'block';
        setAttributes(this.outline, bounds);
        if (this.overlay) {
            this.overlay.style.display = 'block';
            setAttributes(this.overlay, bounds);
        }
        const points = this.getHandlePoints(bounds);
        this.handles.forEach((handle, index) => {
            const [x, y] = points[index];
            if (handle.tagName === 'circle') {
                setAttributes(handle, { cx: x, cy: y });
            }
            else {
                const pos = ResizeElement.HANDLE_POSITIONS[index];
                const line = this.getHandleLine(bounds, pos);
                setAttributes(handle, line);
            }
            handle.style.display = 'block';
        });
    }
    hideHandles() {
        if (this.container)
            this.container.style.display = 'none';
        if (this.outline)
            this.outline.style.display = 'none';
        if (this.overlay)
            this.overlay.style.display = 'none';
        this.handles.forEach((handle) => (handle.style.display = 'none'));
    }
    removeContainer() {
        var _a;
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.remove();
        this.container = undefined;
        this.outline = undefined;
        this.overlay = undefined;
        this.handles = [];
    }
    handlePointerDown(event, handle) {
        if (!this.target)
            return;
        if (event.button !== 0 && event.pointerType === 'mouse')
            return;
        event.stopPropagation();
        event.preventDefault();
        const point = this.clientToElement(this.target, event.clientX, event.clientY);
        this.activeHandle = handle;
        this.activePointerId = event.pointerId;
        this.startPointer = point;
        const currentRect = this.getCurrentAttributes(this.target);
        this.startRect = currentRect;
        this.startAttrs = Object.assign({}, currentRect);
        this.lastRect = currentRect;
        this.lastViewportRect = this.getViewportRect(this.target);
        window.addEventListener('pointermove', this.handlePointerMove);
        window.addEventListener('pointerup', this.handlePointerUp);
        window.addEventListener('pointercancel', this.handlePointerUp);
    }
    cancelDrag() {
        this.activeHandle = null;
        this.activePointerId = null;
        this.startPointer = undefined;
        this.startRect = undefined;
        this.startAttrs = undefined;
        this.lastRect = undefined;
        this.lastViewportRect = undefined;
        window.removeEventListener('pointermove', this.handlePointerMove);
        window.removeEventListener('pointerup', this.handlePointerUp);
        window.removeEventListener('pointercancel', this.handlePointerUp);
    }
    applyRect(target, rect) {
        setAttributes(target, {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
        });
    }
    getViewportRect(element) {
        const { x, y, width, height } = getElementViewportBounds(this.editor.getDocument(), element);
        return { x, y, width, height };
    }
    clientToElement(element, x, y) {
        var _a, _b;
        const matrix = ((_a = element.getScreenCTM()) === null || _a === void 0 ? void 0 : _a.inverse()) ||
            ((_b = this.editor.getDocument().getScreenCTM()) === null || _b === void 0 ? void 0 : _b.inverse()) ||
            new DOMMatrix();
        return new DOMPoint(x, y).matrixTransform(matrix);
    }
    getCurrentAttributes(element) {
        const attrs = getAttributes(element, ['x', 'y', 'width', 'height'], false);
        const fallback = this.getViewportRect(element);
        const getNumber = (value, backup) => {
            const numeric = value !== null ? Number(value) : NaN;
            return Number.isFinite(numeric) ? numeric : backup;
        };
        return {
            x: getNumber(attrs.x, fallback.x),
            y: getNumber(attrs.y, fallback.y),
            width: getNumber(attrs.width, fallback.width),
            height: getNumber(attrs.height, fallback.height),
        };
    }
    getHandlePoints(rect) {
        const { x, y, width, height } = rect;
        const cx = x + width / 2;
        const cy = y + height / 2;
        return [
            [x, y], // top-left
            [cx, y], // top
            [x + width, y], // top-right
            [x + width, cy], // right
            [x + width, y + height], // bottom-right
            [cx, y + height], // bottom
            [x, y + height], // bottom-left
            [x, cy], // left
        ];
    }
    applyDelta(rect, dx, dy, handle) {
        let { x, y, width, height } = rect;
        switch (handle) {
            case 'top-left':
                x += dx;
                y += dy;
                width -= dx;
                height -= dy;
                break;
            case 'top':
                y += dy;
                height -= dy;
                break;
            case 'top-right':
                y += dy;
                width += dx;
                height -= dy;
                break;
            case 'right':
                width += dx;
                break;
            case 'bottom-right':
                width += dx;
                height += dy;
                break;
            case 'bottom':
                height += dy;
                break;
            case 'bottom-left':
                x += dx;
                width -= dx;
                height += dy;
                break;
            case 'left':
                x += dx;
                width -= dx;
                break;
        }
        return { x, y, width, height };
    }
    clampRect(rect, handle) {
        let { x, y, width, height } = rect;
        if (width < ResizeElement.MIN_SIZE) {
            const diff = ResizeElement.MIN_SIZE - width;
            if (handle === 'top-left' ||
                handle === 'bottom-left' ||
                handle === 'left')
                x -= diff;
            width = ResizeElement.MIN_SIZE;
        }
        if (height < ResizeElement.MIN_SIZE) {
            const diff = ResizeElement.MIN_SIZE - height;
            if (handle === 'top-left' || handle === 'top-right' || handle === 'top')
                y -= diff;
            height = ResizeElement.MIN_SIZE;
        }
        return { x, y, width, height };
    }
    hasRectChanged(a, b) {
        return (Math.abs(a.x - b.x) > 0.5 ||
            Math.abs(a.y - b.y) > 0.5 ||
            Math.abs(a.width - b.width) > 0.5 ||
            Math.abs(a.height - b.height) > 0.5);
    }
    emitSelectionGeometryChange() {
        if (this.target && this.lastViewportRect) {
            this.emitter.emit('selection:geometrychange', {
                type: 'selection:geometrychange',
                target: this.target,
                rect: this.lastViewportRect,
            });
        }
    }
    getHandleLine(rect, pos) {
        const { x, y, width, height } = rect;
        switch (pos) {
            case 'top':
                return { x1: x, y1: y, x2: x + width, y2: y };
            case 'right':
                return { x1: x + width, y1: y, x2: x + width, y2: y + height };
            case 'bottom':
                return { x1: x, y1: y + height, x2: x + width, y2: y + height };
            case 'left':
            default:
                return { x1: x, y1: y, x2: x, y2: y + height };
        }
    }
}
ResizeElement.HANDLE_SIZE = 10;
ResizeElement.LINE_STROKE_WIDTH = 8;
ResizeElement.MIN_SIZE = 1;
ResizeElement.HANDLE_POSITIONS = [
    'top-left',
    'top',
    'top-right',
    'right',
    'bottom-right',
    'bottom',
    'bottom-left',
    'left',
];
