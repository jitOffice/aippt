var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Hotkey } from '../utils/index.js';
import { Interaction } from './base.js';
export class HotkeyHistory extends Interaction {
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
        this.hotkey = new Hotkey({
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
