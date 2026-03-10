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
exports.InteractionManager = void 0;
const utils_1 = require("../../utils");
const utils_2 = require("../utils");
class InteractionManager {
    constructor() {
        this.extensions = new utils_2.Extension();
        this.interactions = [];
        this.active = false;
        this.running = null;
        this.concurrentInteractions = new Set();
        this.selection = new Set();
        this.handleClick = (event) => {
            const doc = this.editor.getDocument();
            const target = event.target;
            if (!target) {
                this.deactivate();
                return;
            }
            // 点击画布 SVG 或者标记为组件的元素
            if (doc.contains(target) ||
                (0, utils_1.isInfographicComponent)(target))
                this.activate();
            else
                this.deactivate();
        };
    }
    init(options) {
        Object.assign(this, options);
        document.addEventListener('click', this.handleClick);
        this.interactions.forEach((interaction) => {
            this.extensions.register(interaction.name, interaction);
            interaction.init({
                emitter: this.emitter,
                editor: this.editor,
                commander: this.commander,
                state: this.state,
                interaction: this,
            });
            this.emitter.emit('interaction:registered', interaction);
        });
    }
    isActive() {
        return this.active;
    }
    select(items, mode) {
        const previous = this.getSelection();
        const added = [];
        const removed = [];
        if (mode === 'replace') {
            const next = new Set(items);
            previous.forEach((id) => {
                if (!next.has(id))
                    removed.push(id);
            });
            items.forEach((id) => {
                if (!this.selection.has(id))
                    added.push(id);
            });
            this.selection = next;
        }
        else if (mode === 'add') {
            items.forEach((id) => {
                if (!this.selection.has(id)) {
                    this.selection.add(id);
                    added.push(id);
                }
            });
        }
        else if (mode === 'remove') {
            items.forEach((id) => {
                if (this.selection.delete(id)) {
                    removed.push(id);
                }
            });
        }
        else if (mode === 'toggle') {
            items.forEach((id) => {
                if (this.selection.has(id)) {
                    this.selection.delete(id);
                    removed.push(id);
                }
                else {
                    this.selection.add(id);
                    added.push(id);
                }
            });
        }
        const next = this.getSelection();
        const payload = {
            type: 'selection:change',
            previous,
            next,
            added,
            removed,
            mode,
        };
        this.emitter.emit('selection:change', payload);
    }
    getSelection() {
        return [...this.selection];
    }
    isSelected(item) {
        return this.selection.has(item);
    }
    clearSelection() {
        const previous = this.getSelection();
        this.selection.clear();
        const payload = {
            type: 'selection:change',
            previous,
            next: [],
            added: [],
            removed: previous,
            mode: 'replace',
        };
        this.emitter.emit('selection:change', payload);
    }
    activate() {
        this.active = true;
        this.emitter.emit('activated');
    }
    deactivate() {
        this.active = false;
        this.running = null;
        this.clearSelection();
        this.emitter.emit('deactivated');
    }
    /**
     * 执行互斥交互操作（同一时间只能有一个互斥交互在进行）
     */
    executeExclusiveInteraction(instance, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            // 如果未激活或已有互斥交互在运行，则拒绝执行
            if (!this.active || this.running)
                return;
            this.running = instance;
            try {
                this.emitter.emit('interaction:started', instance);
                yield callback();
                this.emitter.emit('interaction:ended', instance);
            }
            catch (error) {
                console.error(`Error occurred during exclusive interaction "${instance.name}":`, error);
                this.emitter.emit('interaction:error', instance, error);
            }
            finally {
                this.running = null;
            }
        });
    }
    /**
     * 执行协同交互操作（允许多个协同交互同时进行）
     */
    executeConcurrentInteraction(instance, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.active)
                return;
            this.concurrentInteractions.add(instance);
            try {
                this.emitter.emit('interaction:started', instance);
                yield callback();
                this.emitter.emit('interaction:ended', instance);
            }
            catch (error) {
                console.error(`Error occurred during concurrent interaction "${instance.name}":`, error);
                this.emitter.emit('interaction:error', instance, error);
            }
            finally {
                this.concurrentInteractions.delete(instance);
            }
        });
    }
    getOrCreateTransientContainer() {
        const role = 'transient-container';
        const doc = this.editor.getDocument();
        const container = (0, utils_1.getElementByRole)(doc, role);
        if (container && container.isConnected)
            return container;
        const g = (0, utils_1.createElement)('g');
        (0, utils_1.setElementRole)(g, role);
        doc.appendChild(g);
        return g;
    }
    appendTransientElement(element) {
        const container = this.getOrCreateTransientContainer();
        container.appendChild(element);
        return element;
    }
    destroy() {
        this.extensions.forEach((interaction) => {
            interaction.destroy();
            this.emitter.emit('interaction:destroyed', interaction);
        });
        this.extensions.destroy();
        this.active = false;
        this.running = null;
        this.clearSelection();
        document.removeEventListener('click', this.handleClick);
        this.getOrCreateTransientContainer().remove();
    }
}
exports.InteractionManager = InteractionManager;
