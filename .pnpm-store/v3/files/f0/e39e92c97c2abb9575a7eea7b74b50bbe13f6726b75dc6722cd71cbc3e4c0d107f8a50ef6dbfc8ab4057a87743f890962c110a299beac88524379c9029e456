"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickHandler = void 0;
class ClickHandler {
    constructor(element, options = {}) {
        var _a;
        this.clickTimer = null;
        this.singleClickCallback = null;
        this.doubleClickCallback = null;
        this.pointerId = null;
        this.startX = 0;
        this.startY = 0;
        this.skipClick = false;
        this.dragged = false;
        this.handlePointerDown = (event) => {
            this.pointerId = event.pointerId;
            this.startX = event.clientX;
            this.startY = event.clientY;
            this.dragged = false;
            this.skipClick = false;
            window.addEventListener('pointermove', this.handlePointerMove, {
                passive: true,
            });
            window.addEventListener('pointerup', this.handlePointerUp, {
                passive: true,
            });
            window.addEventListener('pointercancel', this.handlePointerUp, {
                passive: true,
            });
        };
        this.handlePointerMove = (event) => {
            if (this.pointerId === null || event.pointerId !== this.pointerId)
                return;
            const dx = event.clientX - this.startX;
            const dy = event.clientY - this.startY;
            if (Math.hypot(dx, dy) > this.dragThreshold) {
                this.skipClick = true;
                this.dragged = true;
            }
        };
        this.handlePointerUp = (event) => {
            if (this.pointerId !== null && event.pointerId === this.pointerId) {
                this.pointerId = null;
                window.removeEventListener('pointermove', this.handlePointerMove);
                window.removeEventListener('pointerup', this.handlePointerUp);
                window.removeEventListener('pointercancel', this.handlePointerUp);
                // Only allow click through if we did not detect a drag.
                if (!this.dragged)
                    this.skipClick = false;
                this.dragged = false;
            }
        };
        this.element = element;
        this.delay = options.delay || 300;
        this.dragThreshold = (_a = options.dragThreshold) !== null && _a !== void 0 ? _a : 4;
        this.init();
    }
    init() {
        this.element.addEventListener('click', this.handleClick.bind(this));
        this.element.addEventListener('dblclick', this.handleDoubleClick.bind(this));
        this.element.addEventListener('pointerdown', this.handlePointerDown);
    }
    handleClick(e) {
        if (this.skipClick) {
            this.skipClick = false;
            return;
        }
        if (this.clickTimer)
            clearTimeout(this.clickTimer);
        this.clickTimer = window.setTimeout(() => {
            var _a;
            (_a = this.singleClickCallback) === null || _a === void 0 ? void 0 : _a.call(this, e);
        }, this.delay);
    }
    handleDoubleClick(e) {
        var _a;
        if (this.skipClick) {
            this.skipClick = false;
            return;
        }
        if (this.clickTimer)
            clearTimeout(this.clickTimer);
        (_a = this.doubleClickCallback) === null || _a === void 0 ? void 0 : _a.call(this, e);
    }
    onClick(callback) {
        this.singleClickCallback = callback;
        return this;
    }
    onDoubleClick(callback) {
        this.doubleClickCallback = callback;
        return this;
    }
    destroy() {
        if (this.clickTimer)
            clearTimeout(this.clickTimer);
        this.element.removeEventListener('click', this.handleClick);
        this.element.removeEventListener('dblclick', this.handleDoubleClick);
        this.element.removeEventListener('pointerdown', this.handlePointerDown);
        window.removeEventListener('pointermove', this.handlePointerMove);
        window.removeEventListener('pointerup', this.handlePointerUp);
        window.removeEventListener('pointercancel', this.handlePointerUp);
    }
}
exports.ClickHandler = ClickHandler;
