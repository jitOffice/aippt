var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class BatchCommand {
    constructor(commands) {
        this.commands = commands;
    }
    apply(state) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const command of this.commands) {
                yield command.apply(state);
            }
        });
    }
    undo(state) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = this.commands.length - 1; i >= 0; i--) {
                yield this.commands[i].undo(state);
            }
        });
    }
    serialize() {
        return {
            type: 'batch',
            commands: this.commands.map((cmd) => cmd.serialize()),
        };
    }
}
