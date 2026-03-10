var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAttributes, getIconAttrs, getIconEntity, getTextElementProps, isEditableText, isIconElement, setAttributes, updateIconElement, updateTextElement, } from '../../utils/index.js';
export class UpdateElementCommand {
    constructor(element, modified, original) {
        this.element = element;
        this.modified = modified;
        const computedOriginal = getOriginalProps(element, modified);
        this.original = mergeOriginalProps(computedOriginal, original);
    }
    apply(state) {
        return __awaiter(this, void 0, void 0, function* () {
            updateElement(this.element, this.modified);
            state.updateElement(this.element, this.modified);
        });
    }
    undo(state) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.original) {
                updateElement(this.element, this.original);
                state.updateElement(this.element, this.original);
            }
        });
    }
    serialize() {
        return {
            type: 'update-element',
            elementId: this.element.id,
            modified: this.modified,
            original: this.original,
        };
    }
}
function updateElement(element, props) {
    if (isEditableText(element)) {
        updateTextElement(element, props);
    }
    else if (isIconElement(element)) {
        updateIconElement(element, undefined, props.attributes);
    }
    else if (props.attributes) {
        setAttributes(element, props.attributes);
    }
}
function getOriginalProps(element, modified) {
    const modifiedAttrKeys = Object.keys(modified.attributes || {});
    const originalAttributes = getAttributes(element, modifiedAttrKeys, false);
    const assignModifiedAttributes = (attrs) => {
        if (!attrs)
            return;
        modifiedAttrKeys.forEach((key) => {
            if (key in attrs)
                originalAttributes[key] = attrs[key];
        });
    };
    const original = Object.assign(Object.assign({}, modified), { attributes: originalAttributes });
    if (isEditableText(element)) {
        const { attributes } = getTextElementProps(element);
        assignModifiedAttributes(attributes);
    }
    else if (isIconElement(element)) {
        const entity = getIconEntity(element);
        if (!entity)
            return;
        assignModifiedAttributes(getIconAttrs(element));
    }
    // TODO illus
    return original;
}
function mergeOriginalProps(computed, provided) {
    if (!computed)
        return provided;
    if (!provided)
        return computed;
    const mergedAttributes = Object.assign(Object.assign({}, (computed.attributes || {})), (provided.attributes || {}));
    return Object.assign(Object.assign(Object.assign({}, computed), provided), { attributes: Object.keys(mergedAttributes).length
            ? mergedAttributes
            : undefined });
}
