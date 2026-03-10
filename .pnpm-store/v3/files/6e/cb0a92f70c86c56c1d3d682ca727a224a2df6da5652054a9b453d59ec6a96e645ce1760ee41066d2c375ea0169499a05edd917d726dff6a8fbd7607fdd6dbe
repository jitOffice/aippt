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
exports.DblClickEditText = void 0;
const utils_1 = require("../../utils");
const commands_1 = require("../commands");
const utils_2 = require("../utils");
const base_1 = require("./base");
class DblClickEditText extends base_1.Interaction {
    constructor() {
        super(...arguments);
        this.name = 'dblclick-edit-text';
    }
    init(options) {
        super.init(options);
        const { editor, commander, interaction } = options;
        this.clickHandler = new utils_2.ClickHandler(editor.getDocument()).onDoubleClick((event) => {
            if (!interaction.isActive())
                return;
            interaction.executeExclusiveInteraction(this, () => __awaiter(this, void 0, void 0, function* () {
                const target = (0, utils_2.getEventTarget)(event.target);
                if (!target)
                    return;
                if ((0, utils_1.isEditableText)(target)) {
                    interaction.select([target], 'replace');
                    const originalText = (0, utils_1.getTextContent)(target);
                    const text = yield new Promise((resolve) => {
                        const stopListen = this.listenSelectionChange(target);
                        editText(target, {
                            cursorPosition: {
                                clientX: event.clientX,
                                clientY: event.clientY,
                            },
                            onBlur: resolve,
                            onCancel: resolve,
                        });
                        this.detachSelectionListener = stopListen;
                    });
                    commander.execute(new commands_1.UpdateTextCommand(target, text, originalText));
                }
            }));
        });
    }
    destroy() {
        var _a, _b;
        (_a = this.clickHandler) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = this.detachSelectionListener) === null || _b === void 0 ? void 0 : _b.call(this);
    }
    listenSelectionChange(target) {
        const handler = ({ next }) => {
            var _a;
            if (!next.includes(target)) {
                (_a = this.detachSelectionListener) === null || _a === void 0 ? void 0 : _a.call(this);
                this.detachSelectionListener = undefined;
                const entity = (0, utils_1.getTextEntity)(target);
                if (entity)
                    entity.blur();
            }
        };
        this.emitter.on('selection:change', handler);
        return () => this.emitter.off('selection:change', handler);
    }
}
exports.DblClickEditText = DblClickEditText;
const EDITOR_STYLE_ID = 'infographic-inline-text-editor-style';
const EDITOR_BASE_CLASS = 'infographic-inline-text-editor';
function editText(text, options) {
    const entity = (0, utils_1.getTextEntity)(text);
    if (!entity)
        return;
    ensureEditorStyles();
    new InlineTextEditor(entity, options).start();
}
class InlineTextEditor {
    constructor(entity, options) {
        this.entity = entity;
        this.options = options;
        this.handlePaste = (event) => {
            if (!event.clipboardData)
                return;
            event.preventDefault();
            this.insertPlainText(event.clipboardData.getData('text/plain'));
        };
        this.handleKeydown = (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.insertPlainText('\n');
            }
        };
        this.handleInput = () => {
            var _a, _b;
            this.normalizeSpanContent();
            (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.onInput) === null || _b === void 0 ? void 0 : _b.call(_a, this.getText());
        };
        this.handleBlur = () => {
            var _a, _b;
            this.entity.removeAttribute('contenteditable');
            this.entity.classList.remove(EDITOR_BASE_CLASS);
            this.normalizeSpanContent();
            (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.onBlur) === null || _b === void 0 ? void 0 : _b.call(_a, this.getText());
            this.detachListeners();
        };
    }
    start() {
        this.entity.setAttribute('contenteditable', 'true');
        this.entity.classList.add(EDITOR_BASE_CLASS);
        this.entity.focus();
        this.placeCaretAtClickPosition();
        this.attachListeners();
    }
    attachListeners() {
        this.entity.addEventListener('paste', this.handlePaste);
        this.entity.addEventListener('keydown', this.handleKeydown);
        this.entity.addEventListener('input', this.handleInput);
        this.entity.addEventListener('blur', this.handleBlur, { once: true });
    }
    detachListeners() {
        this.entity.removeEventListener('paste', this.handlePaste);
        this.entity.removeEventListener('keydown', this.handleKeydown);
        this.entity.removeEventListener('input', this.handleInput);
    }
    insertPlainText(text) {
        var _a, _b;
        const selection = window.getSelection();
        if (!selection)
            return;
        if (!selection.rangeCount) {
            this.placeCaretAtEnd();
        }
        const range = selection.rangeCount
            ? selection.getRangeAt(0)
            : document.createRange();
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
        // Mirror native input behavior so consumers stay in sync.
        this.normalizeSpanContent();
        (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.onInput) === null || _b === void 0 ? void 0 : _b.call(_a, this.getText());
    }
    normalizeSpanContent() {
        var _a;
        if (this.entity.childNodes.length === 1 &&
            ((_a = this.entity.firstChild) === null || _a === void 0 ? void 0 : _a.nodeType) === Node.TEXT_NODE) {
            return;
        }
        const plainText = this.getText();
        this.entity.textContent = plainText;
    }
    placeCaretAtClickPosition() {
        const selection = window.getSelection();
        if (!selection)
            return;
        const rangeFromPoint = this.getRangeFromPoint();
        if (rangeFromPoint) {
            selection.removeAllRanges();
            selection.addRange(rangeFromPoint);
            return;
        }
        this.placeCaretAtEnd();
    }
    getRangeFromPoint() {
        var _a, _b;
        const { cursorPosition } = this.options || {};
        if (!cursorPosition)
            return null;
        const { clientX, clientY } = cursorPosition;
        const doc = document;
        const rangeFromPoint = (_b = (_a = doc.caretRangeFromPoint) === null || _a === void 0 ? void 0 : _a.call(doc, clientX, clientY)) !== null && _b !== void 0 ? _b : (() => {
            var _a;
            const caretPosition = (_a = doc.caretPositionFromPoint) === null || _a === void 0 ? void 0 : _a.call(doc, clientX, clientY);
            if (!caretPosition)
                return null;
            const caretRange = document.createRange();
            caretRange.setStart(caretPosition.offsetNode, caretPosition.offset);
            caretRange.collapse(true);
            return caretRange;
        })();
        if (!rangeFromPoint)
            return null;
        if (!this.entity.contains(rangeFromPoint.startContainer))
            return null;
        return rangeFromPoint;
    }
    placeCaretAtEnd() {
        const selection = window.getSelection();
        if (!selection)
            return;
        const range = document.createRange();
        range.selectNodeContents(this.entity);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    getText() {
        return this.entity.textContent || '';
    }
}
function ensureEditorStyles() {
    (0, utils_1.injectStyleOnce)(EDITOR_STYLE_ID, `
.${EDITOR_BASE_CLASS} {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: transparent;
  outline: none;
  cursor: text;
}
.${EDITOR_BASE_CLASS}::selection {
  background-color: #b3d4fc;
}
`);
}
