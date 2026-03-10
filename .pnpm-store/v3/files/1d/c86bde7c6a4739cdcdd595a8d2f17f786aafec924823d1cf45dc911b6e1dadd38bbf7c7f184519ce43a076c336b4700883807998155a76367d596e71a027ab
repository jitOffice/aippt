var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getElementRole, getTextContent, setTextContent } from '../../utils/index.js';
import { getIndexesFromElement } from '../utils/index.js';
export class UpdateTextCommand {
    constructor(element, newText, originalText) {
        this.element = element;
        this.originalText = originalText !== null && originalText !== void 0 ? originalText : getTextContent(element);
        this.modifiedText = newText;
    }
    apply(state) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.originalText === this.modifiedText)
                return;
            setTextContent(this.element, this.modifiedText);
            updateItemText(state, this.element, this.modifiedText);
        });
    }
    undo(state) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.originalText === this.modifiedText)
                return;
            setTextContent(this.element, this.originalText);
            updateItemText(state, this.element, this.originalText);
        });
    }
    serialize() {
        return {
            type: 'update-text',
            elementId: this.element.id,
            original: this.originalText,
            modified: this.modifiedText,
        };
    }
}
function updateItemText(state, element, text) {
    const role = getElementRole(element);
    if (role.startsWith('item-')) {
        const key = role.replace('item-', '');
        const indexes = getIndexesFromElement(element);
        state.updateItemDatum(indexes, { [key]: text });
    }
    else {
        state.updateData(role, text);
    }
}
