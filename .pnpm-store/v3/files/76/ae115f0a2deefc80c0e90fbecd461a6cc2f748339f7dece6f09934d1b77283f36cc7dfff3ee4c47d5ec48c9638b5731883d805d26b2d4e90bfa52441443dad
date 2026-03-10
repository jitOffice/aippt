var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BatchCommand } from '../commands/index.js';
export class CommandManager {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }
    init(options) {
        Object.assign(this, options);
    }
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            yield command.apply(this.state);
            this.undoStack.push(command);
            this.redoStack = [];
            this.emitHistoryChange('execute');
        });
    }
    executeBatch(commands) {
        return __awaiter(this, void 0, void 0, function* () {
            if (commands.length === 0)
                return;
            const batchCommand = new BatchCommand(commands);
            yield this.execute(batchCommand);
        });
    }
    undo() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = this.undoStack.pop();
            if (command) {
                yield command.undo(this.state);
                this.redoStack.push(command);
                this.emitHistoryChange('undo');
            }
        });
    }
    redo() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = this.redoStack.pop();
            if (command) {
                yield command.apply(this.state);
                this.undoStack.push(command);
                this.emitHistoryChange('redo');
            }
        });
    }
    serialize() {
        return this.undoStack.map((cmd) => cmd.serialize());
    }
    clear() {
        this.undoStack = [];
        this.redoStack = [];
    }
    canUndo() {
        return this.undoStack.length > 0;
    }
    canRedo() {
        return this.redoStack.length > 0;
    }
    getHistorySize() {
        return this.undoStack.length;
    }
    destroy() {
        this.clear();
    }
    emitHistoryChange(action) {
        var _a;
        (_a = this.emitter) === null || _a === void 0 ? void 0 : _a.emit('history:change', {
            type: 'history:change',
            action,
        });
    }
}
