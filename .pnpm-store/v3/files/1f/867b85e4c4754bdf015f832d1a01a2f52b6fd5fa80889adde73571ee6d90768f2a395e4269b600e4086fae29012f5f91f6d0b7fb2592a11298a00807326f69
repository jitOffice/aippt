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
exports.ClickSelect = void 0;
const utils_1 = require("../../utils");
const utils_2 = require("../utils");
const base_1 = require("./base");
class ClickSelect extends base_1.Interaction {
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
        this.clickHandler = new utils_2.ClickHandler(editor.getDocument(), { delay: 0 });
        const handleSelect = (event) => {
            if (!interaction.isActive())
                return;
            interaction.executeExclusiveInteraction(this, () => __awaiter(this, void 0, void 0, function* () {
                const target = (0, utils_2.getEventTarget)(event.target);
                if ((0, utils_1.isEditingText)(target))
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
exports.ClickSelect = ClickSelect;
