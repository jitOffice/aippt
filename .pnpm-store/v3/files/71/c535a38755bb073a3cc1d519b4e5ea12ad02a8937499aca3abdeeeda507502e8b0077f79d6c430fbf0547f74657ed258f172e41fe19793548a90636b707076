"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditBar = void 0;
const constants_1 = require("../../../constants");
const jsx_1 = require("../../../jsx");
const utils_1 = require("../../../utils");
const base_1 = require("../base");
const edit_items_1 = require("./edit-items");
class EditBar extends base_1.Plugin {
    constructor(options) {
        super();
        this.options = options;
        this.name = 'edit-bar';
        this.selection = [];
        this.handleSelectionChanged = ({ next }) => {
            this.selection = next;
            if (next.length === 0) {
                if (this.container)
                    hideContainer(this.container);
                return;
            }
            const container = this.getOrCreateEditBar();
            const items = this.getEditItems(next);
            if (items.length === 0) {
                hideContainer(container);
                return;
            }
            setContainerItems(container, items);
            this.placeEditBar(container, next);
            showContainer(container);
        };
        this.handleGeometryChanged = ({ target, }) => {
            if (!this.selection.includes(target) || !this.container)
                return;
            this.placeEditBar(this.container, this.selection);
            showContainer(this.container);
        };
        this.handleHistoryChanged = () => {
            if (!this.container || this.selection.length === 0)
                return;
            this.placeEditBar(this.container, this.selection);
            showContainer(this.container);
        };
    }
    init(options) {
        super.init(options);
        const { emitter } = options;
        emitter.on('selection:change', this.handleSelectionChanged);
        emitter.on('selection:geometrychange', this.handleGeometryChanged);
        emitter.on('history:change', this.handleHistoryChanged);
    }
    destroy() {
        var _a;
        const { emitter } = this;
        emitter.off('selection:change', this.handleSelectionChanged);
        emitter.off('selection:geometrychange', this.handleGeometryChanged);
        emitter.off('history:change', this.handleHistoryChanged);
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.remove();
    }
    getEditItems(selection) {
        let hasText = false;
        let hasIcon = false;
        let hasGeometry = false;
        for (const item of selection) {
            if ((0, utils_1.isEditableText)(item))
                hasText = true;
            else if ((0, utils_1.isIconElement)(item))
                hasIcon = true;
            else if ((0, utils_1.isGeometryElement)(item))
                hasGeometry = true;
            if (hasText && hasIcon && hasGeometry)
                break;
        }
        // Only text
        if (hasText && !hasIcon && !hasGeometry) {
            if (selection.length === 1) {
                return this.getTextEditItems(selection[0]);
            }
            else {
                return this.getTextCollectionEditItems(selection);
            }
        }
        // Only icon
        if (!hasText && hasIcon && !hasGeometry) {
            if (selection.length === 1) {
                return this.getIconEditItems(selection);
            }
            else {
                return this.getIconCollectionEditItems(selection);
            }
        }
        // Only geometry
        if (!hasText && !hasIcon && hasGeometry) {
            if (selection.length === 1) {
                return this.getGeometryEditItems(selection);
            }
            else {
                return this.getGeometryCollectionEditItems(selection);
            }
        }
        // Mixed or multiple elements
        return this.getElementCollectionEditItems(selection);
    }
    getOrCreateEditBar() {
        if (this.container)
            return this.container;
        const { style, className } = this.options || {};
        const container = document.createElement('div');
        Object.assign(container.style, Object.assign({ visibility: 'hidden', position: 'absolute', left: '0', top: '0', display: 'flex', flexFlow: 'row', justifyContent: 'center', alignItems: 'center', height: '40px', minWidth: '40px', minHeight: '40px', borderRadius: '8px', padding: '0 4px', backgroundColor: '#fff', border: '1px solid rgba(239, 240, 240, 0.9)', zIndex: '9999', boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 2px -2px, rgba(0, 0, 0, 0.04) 0px 2px 6px, rgba(0, 0, 0, 0.02) 0px 4px 8px 1px' }, style));
        if (className) {
            container.classList.add(className);
        }
        (0, utils_1.setElementRole)(container, constants_1.COMPONENT_ROLE);
        this.container = container;
        const { getContainer } = this.options || {};
        const resolvedContainer = typeof getContainer === 'function' ? getContainer() : getContainer;
        const containerParent = resolvedContainer !== null && resolvedContainer !== void 0 ? resolvedContainer : document.body;
        containerParent === null || containerParent === void 0 ? void 0 : containerParent.appendChild(container);
        return container;
    }
    getTextEditItems(text) {
        const { attributes = {} } = (0, utils_1.getTextElementProps)(text);
        return [edit_items_1.FontColor, edit_items_1.FontSize, edit_items_1.FontAlign, edit_items_1.FontFamily].map((item) => item([text], attributes, this.commander));
    }
    getTextCollectionEditItems(selection) {
        const attrs = (0, utils_1.getCommonAttrs)(selection.map((text) => (0, utils_1.getTextElementProps)(text).attributes || {}));
        const items = [edit_items_1.FontColor, edit_items_1.FontSize, edit_items_1.FontAlign, edit_items_1.FontFamily].map((item) => item(selection, attrs, this.commander));
        const commonItems = this.getElementCollectionEditItems(selection);
        return [...items, ...commonItems];
    }
    getIconEditItems(selection) {
        const attrs = (0, utils_1.getIconAttrs)(selection[0]);
        return [edit_items_1.IconColor].map((item) => item(selection, attrs, this.commander));
    }
    getIconCollectionEditItems(selection) {
        const attrs = (0, utils_1.getCommonAttrs)(selection.map((icon) => (0, utils_1.getIconAttrs)(icon)));
        return [edit_items_1.IconColor].map((item) => item(selection, attrs, this.commander));
    }
    getGeometryEditItems(_selection) {
        return [];
    }
    getGeometryCollectionEditItems(selection) {
        const commonItems = this.getElementCollectionEditItems(selection);
        return [...commonItems];
    }
    getElementCollectionEditItems(selection) {
        if (selection.length <= 1)
            return [];
        return [
            (0, edit_items_1.ElementAlign)(selection, {}, this.commander, {
                enableDistribution: selection.length > 2,
            }),
        ];
    }
    placeEditBar(container, selection) {
        var _a;
        if (selection.length === 0)
            return;
        const combinedBounds = (0, jsx_1.getCombinedBounds)(selection.map((element) => element.getBoundingClientRect()));
        const offsetParent = (_a = container.offsetParent) !== null && _a !== void 0 ? _a : document.documentElement;
        const viewportHeight = document.documentElement.clientHeight;
        const viewportWidth = document.documentElement.clientWidth;
        const containerRect = container.getBoundingClientRect();
        const offset = 8;
        const anchorTop = {
            x: combinedBounds.x + combinedBounds.width / 2,
            y: combinedBounds.y,
        };
        const anchorBottom = {
            x: anchorTop.x,
            y: combinedBounds.y + combinedBounds.height,
        };
        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
        // Use viewport space, not container space, to decide whether we have enough room above.
        const spaceAbove = anchorTop.y - offset;
        const spaceBelow = viewportHeight - anchorBottom.y - offset;
        const shouldPlaceAbove = spaceAbove >= containerRect.height || spaceAbove >= spaceBelow;
        if (offsetParent === document.body ||
            offsetParent === document.documentElement) {
            const scrollX = window.scrollX || document.documentElement.scrollLeft;
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            let left = scrollX + anchorTop.x - containerRect.width / 2;
            left = clamp(left, scrollX, scrollX + Math.max(viewportWidth - containerRect.width, 0));
            let top = shouldPlaceAbove
                ? scrollY + anchorTop.y - containerRect.height - offset
                : scrollY + anchorBottom.y + offset;
            top = clamp(top, scrollY, scrollY + Math.max(viewportHeight - containerRect.height, 0));
            container.style.left = `${left}px`;
            container.style.top = `${top}px`;
            return;
        }
        const parentRect = offsetParent.getBoundingClientRect();
        let left = anchorTop.x - parentRect.left - containerRect.width / 2;
        left = clamp(left, 0, Math.max(parentRect.width - containerRect.width, 0));
        let top = shouldPlaceAbove
            ? anchorTop.y - parentRect.top - containerRect.height - offset
            : anchorBottom.y - parentRect.top + offset;
        top = clamp(top, 0, Math.max(parentRect.height - containerRect.height, 0));
        container.style.left = `${left}px`;
        container.style.top = `${top}px`;
    }
}
exports.EditBar = EditBar;
function showContainer(container) {
    container.style.visibility = 'visible';
}
function hideContainer(container) {
    container.style.visibility = 'hidden';
}
function setContainerItems(container, items) {
    container.innerHTML = '';
    items.forEach((node) => {
        container.appendChild(node);
    });
}
