var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { isEditingText } from '../../utils/index.js';
import { ClickHandler, getEventTarget } from '../utils/index.js';
import { Interaction } from './base.js';
export class ClickSelect extends Interaction {
    constructor() {
        super(...arguments);
        this.name = 'click-select';
        this.shiftKey = false;
        this.onShiftKeyDown = (event) => {
            if (event.key === 'Shift') {
                this.shiftKey = true;
            }
        };
        this.onShiftKeyUp = (event) => {
            if (event.key === 'Shift') {
                this.shiftKey = false;
            }
        };
        this.onEscKeyDown = (event) => {
            if (event.key === 'Escape') {
                this.interaction.clearSelection();
            }
        };
    }
    init(options) {
        super.init(options);
        const { editor, interaction } = this;
        this.clickHandler = new ClickHandler(editor.getDocument(), { delay: 0 });
        const handleSelect = (event) => {
            if (!interaction.isActive())
                return;
            interaction.executeExclusiveInteraction(this, () => __awaiter(this, void 0, void 0, function* () {
                const target = getEventTarget(event.target);
                if (isEditingText(target))
                    return;
                if (this.shiftKey) {
                    // 多选
                    if (target) {
                        if (interaction.isSelected(target)) {
                            interaction.select([target], 'remove');
                        }
                        else {
                            interaction.select([target], 'add');
                        }
                    }
                }
                else {
                    // 单选
                    if (target)
                        interaction.select([target], 'replace');
                    else
                        interaction.clearSelection();
                }
            }));
        };
        this.clickHandler.onClick(handleSelect);
        document.addEventListener('keydown', this.onShiftKeyDown);
        document.addEventListener('keyup', this.onShiftKeyUp);
        document.addEventListener('keydown', this.onEscKeyDown);
    }
    destroy() {
        var _a;
        (_a = this.clickHandler) === null || _a === void 0 ? void 0 : _a.destroy();
        document.removeEventListener('keydown', this.onShiftKeyDown);
        document.removeEventListener('keyup', this.onShiftKeyUp);
        document.removeEventListener('keydown', this.onEscKeyDown);
    }
}
