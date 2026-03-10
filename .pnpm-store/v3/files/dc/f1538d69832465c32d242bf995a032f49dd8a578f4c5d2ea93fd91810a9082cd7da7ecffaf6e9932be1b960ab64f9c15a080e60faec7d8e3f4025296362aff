import { COMPONENT_ROLE } from '../../../constants/index.js';
import { injectStyleOnce, setElementRole } from '../../../utils/index.js';
const POPOVER_CLASS = 'infographic-edit-popover';
const POPOVER_CONTENT_CLASS = `${POPOVER_CLASS}__content`;
const POPOVER_ARROW_CLASS = `${POPOVER_CLASS}__arrow`;
const POPOVER_STYLE_ID = 'infographic-edit-popover-style';
export function Popover(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    ensurePopoverStyle();
    const placement = (_a = props.placement) !== null && _a !== void 0 ? _a : 'top';
    const closeOnOutsideClick = (_b = props.closeOnOutsideClick) !== null && _b !== void 0 ? _b : true;
    const triggerActions = Array.isArray(props.trigger)
        ? props.trigger
        : [props.trigger || 'hover'];
    const hoverOpenDelay = (_c = props.mouseEnterDelay) !== null && _c !== void 0 ? _c : 50;
    const hoverCloseDelay = (_d = props.mouseLeaveDelay) !== null && _d !== void 0 ? _d : 150;
    const offset = (_e = props.offset) !== null && _e !== void 0 ? _e : 8;
    const arrowSize = 8;
    const arrowInnerSize = 7;
    const bodyPadding = typeof props.padding === 'number'
        ? `${props.padding}px`
        : ((_f = props.padding) !== null && _f !== void 0 ? _f : '4px');
    const container = document.createElement('div');
    container.classList.add(POPOVER_CLASS);
    const trigger = (_g = props.target) !== null && _g !== void 0 ? _g : document.createElement('div');
    container.appendChild(trigger);
    const getContentContainer = () => {
        const next = typeof props.getContainer === 'function'
            ? props.getContainer()
            : props.getContainer;
        return next !== null && next !== void 0 ? next : document.body;
    };
    const content = document.createElement('div');
    content.classList.add(POPOVER_CONTENT_CLASS);
    setElementRole(content, COMPONENT_ROLE);
    content.dataset.placement = Array.isArray(placement)
        ? placement[0]
        : placement;
    content.setAttribute('data-open', String(Boolean(props.open)));
    content.style.setProperty('--popover-gap', `${offset}px`);
    content.style.setProperty('--popover-arrow-size', `${arrowSize}px`);
    content.style.setProperty('--popover-arrow-inner-size', `${arrowInnerSize}px`);
    const contentContainer = getContentContainer();
    const isPortal = contentContainer !== container;
    const arrow = document.createElement('div');
    arrow.classList.add(POPOVER_ARROW_CLASS);
    content.appendChild(arrow);
    const body = document.createElement('div');
    body.classList.add(`${POPOVER_CONTENT_CLASS}-body`);
    body.style.padding = bodyPadding;
    content.appendChild(body);
    contentContainer.appendChild(content);
    let open = Boolean(props.open);
    let placementPriority = Array.isArray(placement) ? placement : [placement];
    let currentPlacement = (_h = placementPriority[0]) !== null && _h !== void 0 ? _h : 'top';
    const updatePosition = () => {
        var _a;
        const targetRect = trigger.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;
        let left = 0;
        let top = 0;
        const calcPosition = (placementValue) => {
            switch (placementValue) {
                case 'top':
                    return {
                        left: scrollX +
                            targetRect.left +
                            targetRect.width / 2 -
                            contentRect.width / 2,
                        top: scrollY + targetRect.top - contentRect.height - offset,
                    };
                case 'bottom':
                    return {
                        left: scrollX +
                            targetRect.left +
                            targetRect.width / 2 -
                            contentRect.width / 2,
                        top: scrollY + targetRect.bottom + offset,
                    };
                case 'left':
                    return {
                        left: scrollX + targetRect.left - contentRect.width - offset,
                        top: scrollY +
                            targetRect.top +
                            targetRect.height / 2 -
                            contentRect.height / 2,
                    };
                case 'right':
                default:
                    return {
                        left: scrollX + targetRect.right + offset,
                        top: scrollY +
                            targetRect.top +
                            targetRect.height / 2 -
                            contentRect.height / 2,
                    };
            }
        };
        const fitsViewport = (nextLeft, nextTop) => nextLeft >= scrollX &&
            nextTop >= scrollY &&
            nextLeft + contentRect.width <= scrollX + viewportWidth &&
            nextTop + contentRect.height <= scrollY + viewportHeight;
        let chosenPlacement = (_a = placementPriority[0]) !== null && _a !== void 0 ? _a : 'top';
        let position = calcPosition(chosenPlacement);
        for (const candidate of placementPriority) {
            const nextPosition = calcPosition(candidate);
            position = nextPosition;
            if (fitsViewport(nextPosition.left, nextPosition.top)) {
                chosenPlacement = candidate;
                break;
            }
        }
        currentPlacement = chosenPlacement;
        content.dataset.placement = currentPlacement;
        if (!isPortal)
            return;
        ({ left, top } = position);
        content.style.left = `${left}px`;
        content.style.top = `${top}px`;
        content.style.right = 'auto';
        content.style.bottom = 'auto';
        content.style.transform = 'translate(0, 0)';
    };
    if (isPortal) {
        content.style.position = 'absolute';
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
    }
    const setContent = (next) => {
        let nextContent = next;
        if (typeof nextContent === 'function') {
            nextContent = nextContent();
        }
        body.innerHTML = '';
        if (nextContent instanceof HTMLElement) {
            body.appendChild(nextContent);
        }
        else {
            body.textContent = nextContent !== null && nextContent !== void 0 ? nextContent : '';
        }
        updatePosition();
    };
    const setPlacement = (next) => {
        var _a;
        placementPriority = Array.isArray(next) ? next : [next];
        currentPlacement = (_a = placementPriority[0]) !== null && _a !== void 0 ? _a : 'top';
        updatePosition();
    };
    const setOpen = (value) => {
        open = value;
        content.setAttribute('data-open', String(open));
        if (open)
            updatePosition();
        if (open && closeOnOutsideClick) {
            document.addEventListener('click', handleOutsideClick, true);
        }
        else {
            document.removeEventListener('click', handleOutsideClick, true);
        }
    };
    const toggle = () => setOpen(!open);
    const handleOutsideClick = (event) => {
        const targetNode = event.target;
        if (!container.contains(targetNode) &&
            (isPortal ? !content.contains(targetNode) : true)) {
            setOpen(false);
        }
    };
    let openTimer;
    let closeTimer;
    const hasHover = triggerActions.includes('hover');
    const hasClick = triggerActions.includes('click');
    const clearTimers = () => {
        if (openTimer !== undefined) {
            clearTimeout(openTimer);
            openTimer = undefined;
        }
        if (closeTimer !== undefined) {
            clearTimeout(closeTimer);
            closeTimer = undefined;
        }
    };
    const handleMouseEnter = () => {
        if (!hasHover)
            return;
        clearTimers();
        openTimer = window.setTimeout(() => setOpen(true), hoverOpenDelay);
    };
    const handleMouseLeave = () => {
        if (!hasHover)
            return;
        clearTimers();
        closeTimer = window.setTimeout(() => setOpen(false), hoverCloseDelay);
    };
    if (hasClick) {
        trigger.addEventListener('click', toggle);
    }
    if (hasHover) {
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);
        content.addEventListener('mouseenter', handleMouseEnter);
        content.addEventListener('mouseleave', handleMouseLeave);
    }
    setContent(props.content);
    setPlacement(placement);
    setOpen(open);
    const api = {
        setOpen,
        toggle,
        setContent,
        setPlacement,
        destroy: () => {
            document.removeEventListener('click', handleOutsideClick, true);
            if (hasClick)
                trigger.removeEventListener('click', toggle);
            if (hasHover) {
                container.removeEventListener('mouseenter', handleMouseEnter);
                container.removeEventListener('mouseleave', handleMouseLeave);
                content.removeEventListener('mouseenter', handleMouseEnter);
                content.removeEventListener('mouseleave', handleMouseLeave);
                clearTimers();
            }
            if (isPortal) {
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition, true);
                content.remove();
            }
            container.remove();
        },
    };
    return Object.assign(container, api);
}
function ensurePopoverStyle() {
    injectStyleOnce(POPOVER_STYLE_ID, `
.${POPOVER_CLASS} {
  position: relative;
  display: inline-flex;
}
.${POPOVER_CONTENT_CLASS} {
  position: absolute;
  z-index: 1200;
  padding: 0;
  --popover-gap: 8px;
  --popover-arrow-size: 8px;
  --popover-arrow-inner-size: 7px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid rgba(239, 240, 240, 0.9);
  box-shadow: rgba(0, 0, 0, 0.08) 0px 1px 2px -2px, rgba(0, 0, 0, 0.04) 0px 2px 6px, rgba(0, 0, 0, 0.02) 0px 4px 8px 1px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 120ms ease, transform 120ms ease, visibility 120ms ease;
}
.${POPOVER_CONTENT_CLASS}-body {
  padding: 4px;
  color: #000000d9;
  font-size: 12px;
  line-height: 1.5;
}
.${POPOVER_CONTENT_CLASS}[data-open="true"] {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
.${POPOVER_ARROW_CLASS} {
  position: absolute;
  width: 0;
  height: 0;
}
.${POPOVER_ARROW_CLASS}::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
}
.${POPOVER_CONTENT_CLASS}[data-placement="top"] {
  left: 50%;
  bottom: calc(100% + var(--popover-gap));
  transform: translate(-50%, calc(-1 * var(--popover-gap) / 2));
}
.${POPOVER_CONTENT_CLASS}[data-placement="top"] .${POPOVER_ARROW_CLASS} {
  left: 50%;
  bottom: calc(-1 * var(--popover-arrow-size));
  transform: translateX(-50%);
  border-left: var(--popover-arrow-size) solid transparent;
  border-right: var(--popover-arrow-size) solid transparent;
  border-top: var(--popover-arrow-size) solid rgba(239, 240, 240, 0.9);
}
.${POPOVER_CONTENT_CLASS}[data-placement="top"] .${POPOVER_ARROW_CLASS}::after {
  left: 50%;
  bottom: 1px;
  transform: translateX(-50%);
  border-left: var(--popover-arrow-inner-size) solid transparent;
  border-right: var(--popover-arrow-inner-size) solid transparent;
  border-top: var(--popover-arrow-inner-size) solid #fff;
}
.${POPOVER_CONTENT_CLASS}[data-placement="top"][data-open="true"] {
  transform: translate(-50%, 0);
}
.${POPOVER_CONTENT_CLASS}[data-placement="bottom"] {
  left: 50%;
  top: calc(100% + var(--popover-gap));
  transform: translate(-50%, calc(var(--popover-gap) / 2));
}
.${POPOVER_CONTENT_CLASS}[data-placement="bottom"] .${POPOVER_ARROW_CLASS} {
  left: 50%;
  top: calc(-1 * var(--popover-arrow-size) + 2px);
  transform: translateX(-50%);
  border-left: var(--popover-arrow-size) solid transparent;
  border-right: var(--popover-arrow-size) solid transparent;
  border-bottom: var(--popover-arrow-size) solid rgba(239, 240, 240, 0.9);
}
.${POPOVER_CONTENT_CLASS}[data-placement="bottom"] .${POPOVER_ARROW_CLASS}::after {
  left: 50%;
  top: 1px;
  transform: translateX(-50%);
  border-left: var(--popover-arrow-inner-size) solid transparent;
  border-right: var(--popover-arrow-inner-size) solid transparent;
  border-bottom: var(--popover-arrow-inner-size) solid #fff;
}
.${POPOVER_CONTENT_CLASS}[data-placement="bottom"][data-open="true"] {
  transform: translate(-50%, 0);
}
.${POPOVER_CONTENT_CLASS}[data-placement="left"] {
  right: calc(100% + var(--popover-gap));
  top: 50%;
  transform: translate(calc(-1 * var(--popover-gap) / 2), -50%);
}
.${POPOVER_CONTENT_CLASS}[data-placement="left"] .${POPOVER_ARROW_CLASS} {
  right: calc(-1 * var(--popover-arrow-size) + 1px);
  top: 50%;
  transform: translateY(-50%);
  border-top: var(--popover-arrow-size) solid transparent;
  border-bottom: var(--popover-arrow-size) solid transparent;
  border-left: var(--popover-arrow-size) solid rgba(239, 240, 240, 0.9);
  border-right: 0;
}
.${POPOVER_CONTENT_CLASS}[data-placement="left"] .${POPOVER_ARROW_CLASS}::after {
  right: 1px;
  top: 50%;
  transform: translateY(-50%);
  border-top: var(--popover-arrow-inner-size) solid transparent;
  border-bottom: var(--popover-arrow-inner-size) solid transparent;
  border-left: var(--popover-arrow-inner-size) solid #fff;
  border-right: 0;
}
.${POPOVER_CONTENT_CLASS}[data-placement="left"][data-open="true"] {
  transform: translate(0, -50%);
}
.${POPOVER_CONTENT_CLASS}[data-placement="right"] {
  left: calc(100% + var(--popover-gap));
  top: 50%;
  transform: translate(calc(var(--popover-gap) / 2), -50%);
}
.${POPOVER_CONTENT_CLASS}[data-placement="right"] .${POPOVER_ARROW_CLASS} {
  left: calc(-1 * var(--popover-arrow-size) + 1px);
  top: 50%;
  transform: translateY(-50%);
  border-top: var(--popover-arrow-size) solid transparent;
  border-bottom: var(--popover-arrow-size) solid transparent;
  border-right: var(--popover-arrow-size) solid rgba(239, 240, 240, 0.9);
  border-left: 0;
}
.${POPOVER_CONTENT_CLASS}[data-placement="right"] .${POPOVER_ARROW_CLASS}::after {
  left: 1px;
  top: 50%;
  transform: translateY(-50%);
  border-top: var(--popover-arrow-inner-size) solid transparent;
  border-bottom: var(--popover-arrow-inner-size) solid transparent;
  border-right: var(--popover-arrow-inner-size) solid #fff;
}
.${POPOVER_CONTENT_CLASS}[data-placement="right"][data-open="true"] {
  transform: translate(0, -50%);
}
`);
}
