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
exports.DragCanvas = void 0;
const utils_1 = require("../../utils");
const commands_1 = require("../commands");
const utils_2 = require("../utils");
const base_1 = require("./base");
class DragCanvas extends base_1.Interaction {
    constructor(options) {
        super();
        this.name = 'drag-canvas';
        /**
         * 触发交互的按键代码。
         * 参考标准的 KeyboardEvent.code 值：
         * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
         * @default ['Space']
         */
        this.trigger = ['Space'];
        this.isTriggerPressed = false;
        // 防止组件快捷键侵入性过强
        this.isHovering = false;
        this.handleKeyDown = (event) => {
            if (!this.interaction.isActive())
                return;
            if ((0, utils_2.isTextSelectionTarget)(event.target))
                return;
            // 增加焦点的判断，防止对空格的preventDefault侵入性过强
            const target = event.target;
            const isBody = target === document.body || target === document.documentElement;
            const isEditor = target === this.document || this.document.contains(target);
            if (!isBody && !isEditor)
                return;
            if (!this.trigger.includes(event.code))
                return;
            if (!this.isHovering && !this.isTriggerPressed)
                return;
            event.preventDefault();
            event.stopPropagation();
            this.interaction.executeExclusiveInteraction(this, () => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => {
                    this.completeInteraction = resolve;
                    this.isTriggerPressed = true;
                    const viewBox = (0, utils_1.getViewBox)(this.document);
                    this.startViewBoxString = (0, utils_1.viewBoxToString)(viewBox);
                    this.setCursor('grab');
                    this.document.addEventListener('pointerdown', this.handlePointerDown);
                    window.addEventListener('keyup', this.handleKeyUp);
                });
            }));
        };
        this.handlePointerDown = (event) => {
            if (event.button !== 0)
                return;
            event.preventDefault();
            event.stopPropagation();
            const svg = this.document;
            this.startPoint = (0, utils_2.clientToViewport)(svg, event.clientX, event.clientY);
            this.pointerId = event.pointerId;
            this.setCursor('grabbing');
            window.addEventListener('pointermove', this.handlePointerMove);
            window.addEventListener('pointerup', this.handlePointerUp);
            window.addEventListener('pointercancel', this.handlePointerUp);
        };
        this.handlePointerMove = (event) => {
            if (event.pointerId !== this.pointerId || !this.startPoint)
                return;
            event.preventDefault();
            event.stopPropagation();
            const svg = this.document;
            const current = (0, utils_2.clientToViewport)(svg, event.clientX, event.clientY);
            const dx = current.x - this.startPoint.x;
            const dy = current.y - this.startPoint.y;
            const viewBox = (0, utils_1.getViewBox)(svg);
            const { x, y, width, height } = viewBox;
            const newX = x - dx;
            const newY = y - dy;
            this.state.updateOptions({
                viewBox: (0, utils_1.viewBoxToString)({ x: newX, y: newY, width, height }),
            });
        };
        this.handlePointerUp = (event) => {
            if (event.pointerId !== this.pointerId)
                return;
            this.startPoint = undefined;
            this.pointerId = undefined;
            this.setCursor('grab');
            window.removeEventListener('pointermove', this.handlePointerMove);
            window.removeEventListener('pointerup', this.handlePointerUp);
            window.removeEventListener('pointercancel', this.handlePointerUp);
        };
        this.handleKeyUp = (event) => {
            if (!this.trigger.includes(event.code))
                return;
            this.stopDrag();
        };
        this.stopDrag = () => {
            var _a;
            if (this.startViewBoxString) {
                const svg = this.document;
                const viewBox = (0, utils_1.getViewBox)(svg);
                const currentViewBoxString = (0, utils_1.viewBoxToString)(viewBox);
                if (this.startViewBoxString !== currentViewBoxString) {
                    const command = new commands_1.UpdateOptionsCommand({ viewBox: currentViewBoxString }, { viewBox: this.startViewBoxString });
                    void this.commander.execute(command);
                }
            }
            this.startViewBoxString = undefined;
            this.isTriggerPressed = false;
            this.setCursor('default');
            this.startPoint = undefined;
            this.pointerId = undefined;
            window.removeEventListener('keyup', this.handleKeyUp);
            this.document.removeEventListener('pointerdown', this.handlePointerDown);
            window.removeEventListener('pointermove', this.handlePointerMove);
            window.removeEventListener('pointerup', this.handlePointerUp);
            window.removeEventListener('pointercancel', this.handlePointerUp);
            (_a = this.completeInteraction) === null || _a === void 0 ? void 0 : _a.call(this);
            this.completeInteraction = undefined;
        };
        this.setCursor = (behavior) => {
            document.body.style.cursor = behavior;
        };
        this.handleBlur = () => {
            this.stopDrag();
        };
        this.onMouseEnter = () => {
            this.isHovering = true;
        };
        this.onMouseLeave = () => {
            this.isHovering = false;
        };
        if (options === null || options === void 0 ? void 0 : options.trigger) {
            this.trigger = options.trigger;
        }
    }
    init(options) {
        super.init(options);
        this.document = this.editor.getDocument();
        this.document.addEventListener('mouseenter', this.onMouseEnter);
        this.document.addEventListener('mouseleave', this.onMouseLeave);
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('blur', this.handleBlur);
    }
    destroy() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        this.document.removeEventListener('pointerdown', this.handlePointerDown);
        window.removeEventListener('pointermove', this.handlePointerMove);
        window.removeEventListener('pointerup', this.handlePointerUp);
        window.removeEventListener('pointercancel', this.handlePointerUp);
        window.removeEventListener('blur', this.handleBlur);
        this.document.removeEventListener('mouseenter', this.onMouseEnter);
        this.document.removeEventListener('mouseleave', this.onMouseLeave);
    }
}
exports.DragCanvas = DragCanvas;
