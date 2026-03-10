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
exports.HotkeyHistory = void 0;
const utils_1 = require("../utils");
const base_1 = require("./base");
class HotkeyHistory extends base_1.Interaction {
    constructor() {
        super(...arguments);
        this.name = 'hotkey-history';
        this.handleUndo = (event) => __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            yield this.commander.undo();
        });
        this.handleRedo = (event) => __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            yield this.commander.redo();
        });
    }
    init(options) {
        super.init(options);
        this.hotkey = new utils_1.Hotkey({
            filter: () => this.interaction.isActive(),
        });
        this.hotkey.bind('mod+z', this.handleUndo);
        this.hotkey.bind(['mod+shift+z', 'mod+y'], this.handleRedo);
    }
    destroy() {
        var _a;
        (_a = this.hotkey) === null || _a === void 0 ? void 0 : _a.destroy();
    }
}
exports.HotkeyHistory = HotkeyHistory;
