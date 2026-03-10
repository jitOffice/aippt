"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconColor = void 0;
const utils_1 = require("../../../../utils");
const commands_1 = require("../../../commands");
const components_1 = require("../../components");
const ICON_COLOR_BUTTON_CLASS = 'infographic-icon-color-btn';
const ICON_COLOR_STYLE_ID = 'infographic-icon-color-style';
const DEFAULT_COLOR = '#1f1f1f';
const IconColor = (selection, attrs, commander) => {
    ensureIconColorStyles();
    const color = normalizeColor(attrs.fill);
    const isMixed = attrs.fill === undefined && selection.length > 1;
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add(ICON_COLOR_BUTTON_CLASS);
    setButtonColor(button, color !== null && color !== void 0 ? color : DEFAULT_COLOR, isMixed);
    const picker = (0, components_1.ColorPicker)({
        value: color !== null && color !== void 0 ? color : DEFAULT_COLOR,
        onChange: (nextColor) => {
            setButtonColor(button, nextColor, false);
            commander.executeBatch(selection.map((icon) => new commands_1.UpdateElementCommand(icon, {
                attributes: { fill: nextColor },
            })));
        },
    });
    return (0, components_1.Popover)({
        target: button,
        content: picker,
        placement: ['top', 'bottom'],
        offset: 12,
        trigger: 'hover',
        closeOnOutsideClick: true,
        open: false,
        padding: 0,
    });
};
exports.IconColor = IconColor;
function normalizeColor(fill) {
    if (!fill)
        return undefined;
    return (0, utils_1.hasColor)(fill) ? fill : undefined;
}
function setButtonColor(button, color, mixed) {
    button.style.setProperty('--infographic-icon-color', color);
    if (mixed)
        button.setAttribute('data-mixed', 'true');
    else
        button.removeAttribute('data-mixed');
}
function ensureIconColorStyles() {
    (0, utils_1.injectStyleOnce)(ICON_COLOR_STYLE_ID, `
.${ICON_COLOR_BUTTON_CLASS} {
  position: relative;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: #fff;
  cursor: pointer;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.${ICON_COLOR_BUTTON_CLASS}::after {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: var(--infographic-icon-color, ${DEFAULT_COLOR});
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}
.${ICON_COLOR_BUTTON_CLASS}[data-mixed="true"]::after {
  background: repeating-linear-gradient(
    45deg,
    #d9d9d9 0,
    #d9d9d9 6px,
    #f5f5f5 6px,
    #f5f5f5 12px
  );
}
`);
}
