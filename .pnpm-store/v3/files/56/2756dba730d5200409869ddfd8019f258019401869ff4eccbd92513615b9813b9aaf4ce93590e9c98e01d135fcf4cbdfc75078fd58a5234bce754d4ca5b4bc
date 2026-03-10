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
exports.UpdateOptionsCommand = void 0;
class UpdateOptionsCommand {
    constructor(options, original) {
        this.options = options;
        this.original = original;
    }
    apply(state) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.original) {
                const prev = state.getOptions();
                this.original = {};
                Object.keys(this.options).forEach((key) => {
                    this.original[key] = prev[key];
                });
            }
            state.updateOptions(this.options);
        });
    }
    undo(state) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.original) {
                state.updateOptions(this.original);
            }
        });
    }
    serialize() {
        return {
            type: 'update-options',
            options: this.options,
            original: this.original,
        };
    }
}
exports.UpdateOptionsCommand = UpdateOptionsCommand;
