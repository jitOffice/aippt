"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateManager = void 0;
const utils_1 = require("../../utils");
const utils_2 = require("../utils");
class StateManager {
    init(options) {
        Object.assign(this, options);
    }
    addItemDatum(indexes, datum) {
        const pre = indexes.slice(0, -1);
        const last = indexes[indexes.length - 1];
        const arr = Array.isArray(datum) ? datum : [datum];
        const list = (0, utils_2.getChildrenDataByIndexes)(this.options.data, pre);
        list.splice(last, 0, ...arr);
        this.emitter.emit('options:data:item:add', { indexes, datum });
        this.emitter.emit('options:change', {
            type: 'options:change',
            changes: [
                {
                    op: 'add',
                    path: 'data.items',
                    indexes,
                    value: arr,
                },
            ],
        });
    }
    updateItemDatum(indexes, datum) {
        const item = (0, utils_1.getDatumByIndexes)(this.options.data, indexes);
        if (item == null || indexes.length === 0)
            return;
        Object.assign(item, datum);
        this.emitter.emit('options:data:item:update', { indexes, datum });
        this.emitter.emit('options:change', {
            type: 'options:change',
            changes: [
                {
                    op: 'update',
                    path: 'data.items',
                    indexes,
                    value: datum,
                },
            ],
        });
    }
    removeItemDatum(indexes, count = 1) {
        const pre = indexes.slice(0, -1);
        const last = indexes[indexes.length - 1];
        const list = (0, utils_2.getChildrenDataByIndexes)(this.options.data, pre);
        const datum = list.splice(last, count);
        this.emitter.emit('options:data:item:remove', { indexes, datum });
        this.emitter.emit('options:change', {
            type: 'options:change',
            changes: [
                {
                    op: 'remove',
                    path: 'data.items',
                    indexes,
                    value: datum,
                },
            ],
        });
    }
    updateData(key, value) {
        this.options.data[key] = value;
        this.emitter.emit('options:data:update', { key, value });
        this.emitter.emit('options:change', {
            type: 'options:change',
            changes: [
                {
                    op: 'update',
                    path: `data.${key}`,
                    value,
                },
            ],
        });
    }
    updateElement(element, props) {
        this.updateBuiltInElement(element, props);
    }
    updateOptions(options, execOptions) {
        const { bubbleUp = false } = execOptions || {};
        (0, utils_2.applyOptionUpdates)(this.options, options, '', {
            bubbleUp,
            collector: (path, newVal, oldVal) => {
                this.editor.syncRegistry.trigger(path, newVal, oldVal);
            },
        });
        this.emitter.emit('options:change', {
            type: 'options:change',
            changes: [
                {
                    op: 'update',
                    path: '',
                    value: options,
                },
            ],
        });
    }
    getOptions() {
        return this.options;
    }
    /**
     * 不包含文本内容、图标类型更新
     */
    updateBuiltInElement(element, props) {
        var _a, _b;
        const { data } = this.options;
        const { attributes = {} } = props;
        const role = (0, utils_1.getElementRole)(element);
        const isItemElement = (0, utils_1.isIconElement)(element) ||
            "item-label" /* ElementTypeEnum.ItemLabel */ === role ||
            "item-desc" /* ElementTypeEnum.ItemDesc */ === role ||
            "item-value" /* ElementTypeEnum.ItemValue */ === role ||
            "item-illus" /* ElementTypeEnum.ItemIllus */ === role;
        const indexes = isItemElement ? (0, utils_2.getIndexesFromElement)(element) : undefined;
        if (isItemElement) {
            const datum = (0, utils_1.getDatumByIndexes)(data, indexes);
            if (datum == null)
                return;
            const key = role.replace('item-', '');
            datum.attributes || (datum.attributes = {});
            (_a = datum.attributes)[key] || (_a[key] = {});
            Object.assign(datum.attributes[key], attributes);
        }
        else if ("title" /* ElementTypeEnum.Title */ === role ||
            "desc" /* ElementTypeEnum.Desc */ === role ||
            "illus" /* ElementTypeEnum.Illus */ === role) {
            data.attributes || (data.attributes = {});
            (_b = data.attributes)[role] || (_b[role] = {});
            Object.assign(data.attributes[role], attributes);
        }
        this.emitter.emit('options:element:update', { element, props });
        this.emitter.emit('options:change', {
            type: 'options:change',
            changes: [
                {
                    op: 'update',
                    role,
                    indexes,
                    path: isItemElement
                        ? `${(0, utils_2.buildItemPath)(indexes)}.attributes.${role.replace('item-', '')}`
                        : `data.attributes.${role}`,
                    value: props,
                },
            ],
        });
    }
    destroy() { }
}
exports.StateManager = StateManager;
