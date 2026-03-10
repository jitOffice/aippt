import { COMPONENT_ROLE } from '../../constants/index.js';
import { getBoundViewBox, getViewBox, injectStyleOnce, parsePadding, setElementRole, viewBoxToString, } from '../../utils/index.js';
import { UpdateOptionsCommand } from '../commands/index.js';
import { Plugin } from './base.js';
import { IconButton } from './components/index.js';
import { RESET_ICON } from './components/icons.js';
const MARGIN_X = 25;
const MARGIN_Y = 25;
const BUTTON_SIZE = 40;
export class ResetViewBox extends Plugin {
    constructor(options) {
        super();
        this.options = options;
        this.name = 'reset-viewBox';
        this.viewBoxChanged = false;
        this.handleResize = () => {
            this.updateOriginViewBox();
            this.updatePosition();
        };
        this.handleViewBoxChange = (viewBox) => {
            const svg = this.editor.getDocument();
            this.viewBoxChanged = viewBox !== this.originViewBox;
            if (!this.viewBoxChanged) {
                if (this.resetButton)
                    this.hideButton(this.resetButton);
                return;
            }
            const button = this.getOrCreateResetButton();
            this.placeButton(button, svg);
            this.showButton(button);
        };
        this.getOrCreateResetButton = () => {
            if (this.resetButton)
                return this.resetButton;
            const { style, className } = this.options || {};
            const button = IconButton({
                icon: RESET_ICON,
                onClick: this.resetViewBox,
            });
            button.classList.add(RESET_BUTTON_CLASS);
            if (className) {
                button.classList.add(className);
            }
            if (style) {
                Object.assign(button.style, style);
            }
            setElementRole(button, COMPONENT_ROLE);
            this.resetButton = button;
            const { getContainer } = this.options || {};
            const resolvedContainer = typeof getContainer === 'function' ? getContainer() : getContainer;
            const containerParent = resolvedContainer !== null && resolvedContainer !== void 0 ? resolvedContainer : document.body;
            containerParent === null || containerParent === void 0 ? void 0 : containerParent.appendChild(button);
            return button;
        };
        /** Get CSS transform scale of an element */
        this.getTransformScale = (element) => {
            const rect = element.getBoundingClientRect();
            const scaleX = element.offsetWidth > 0 ? rect.width / element.offsetWidth : 1;
            const scaleY = element.offsetHeight > 0 ? rect.height / element.offsetHeight : 1;
            return { scaleX, scaleY };
        };
        /** Find the nearest stable overflow container */
        this.findStableContainer = (svg) => {
            let current = svg.parentElement;
            while (current) {
                if (current instanceof HTMLElement) {
                    const style = window.getComputedStyle(current);
                    // Look for overflow container or positioned element as stable reference
                    if ((style.overflow && style.overflow !== 'visible') ||
                        (style.overflowX && style.overflowX !== 'visible') ||
                        (style.overflowY && style.overflowY !== 'visible')) {
                        return current;
                    }
                }
                current = current.parentElement;
            }
            return null;
        };
        this.placeButton = (button, svg) => {
            var _a;
            if (!svg.isConnected)
                return;
            const svgRect = svg.getBoundingClientRect();
            const offsetParent = (_a = button.offsetParent) !== null && _a !== void 0 ? _a : document.documentElement;
            // Use stable container bounds to clamp button position when SVG overflows
            const stableContainer = this.findStableContainer(svg);
            const containerRect = stableContainer === null || stableContainer === void 0 ? void 0 : stableContainer.getBoundingClientRect();
            // Prefer SVG bounds, but clamp to container if SVG overflows
            const effectiveRect = containerRect
                ? {
                    right: Math.min(svgRect.right, containerRect.right),
                    bottom: Math.min(svgRect.bottom, containerRect.bottom),
                }
                : svgRect;
            if (offsetParent === document.body ||
                offsetParent === document.documentElement) {
                const scrollX = window.scrollX || document.documentElement.scrollLeft;
                const scrollY = window.scrollY || document.documentElement.scrollTop;
                const left = scrollX + effectiveRect.right - MARGIN_X - BUTTON_SIZE;
                const top = scrollY + effectiveRect.bottom - MARGIN_Y - BUTTON_SIZE;
                button.style.left = `${left}px`;
                button.style.top = `${top}px`;
                return;
            }
            const parentRect = offsetParent.getBoundingClientRect();
            // Compensate for parent transform scale
            const { scaleX, scaleY } = this.getTransformScale(offsetParent);
            // Convert to offsetParent local coordinates
            const left = (effectiveRect.right - parentRect.left) / scaleX - MARGIN_X - BUTTON_SIZE;
            const top = (effectiveRect.bottom - parentRect.top) / scaleY - MARGIN_Y - BUTTON_SIZE;
            button.style.left = `${left}px`;
            button.style.top = `${top}px`;
        };
        this.updatePosition = () => {
            if (this.resetButton && this.viewBoxChanged) {
                this.placeButton(this.resetButton, this.editor.getDocument());
            }
        };
        this.resetViewBox = () => {
            const command = new UpdateOptionsCommand({
                viewBox: this.originViewBox,
            });
            void this.commander.execute(command);
        };
        this.showButton = (button) => {
            button.style.display = 'flex';
            button.style.visibility = 'visible';
        };
        this.hideButton = (button) => {
            button.style.display = 'none';
        };
        this.removeButton = () => {
            var _a;
            this.viewBoxChanged = false;
            (_a = this.resetButton) === null || _a === void 0 ? void 0 : _a.remove();
            this.resetButton = undefined;
        };
    }
    init(options) {
        super.init(options);
        // Initialize originViewBox
        this.ensureButtonStyle();
        this.updateOriginViewBox();
        this.unregisterSync = this.editor.registerSync('viewBox', this.handleViewBoxChange);
        window.addEventListener('resize', this.handleResize);
    }
    destroy() {
        var _a;
        (_a = this.unregisterSync) === null || _a === void 0 ? void 0 : _a.call(this);
        window.removeEventListener('resize', this.handleResize);
        this.removeButton();
    }
    updateOriginViewBox() {
        const svg = this.editor.getDocument();
        // In Node env or before render, fallback to current viewBox attribute
        if (!svg.getBBox) {
            this.originViewBox = viewBoxToString(getViewBox(svg));
            return;
        }
        // In Browser, calculate fit
        const { padding } = this.state.getOptions();
        this.originViewBox = getBoundViewBox(svg, parsePadding(padding));
    }
    ensureButtonStyle() {
        injectStyleOnce(RESET_BUTTON_STYLE_ID, `
      button.${RESET_BUTTON_CLASS} {
        visibility: hidden;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: ${BUTTON_SIZE}px;
        height: ${BUTTON_SIZE}px;
        border-radius: 50%;
        padding: 4px;
        background-color: #fff;
        border: 1px solid #e5e7eb;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        cursor: pointer;
      }
      `);
    }
}
const RESET_BUTTON_CLASS = 'infographic-reset-viewbox-btn';
const RESET_BUTTON_STYLE_ID = 'infographic-reset-viewbox-btn-style';
