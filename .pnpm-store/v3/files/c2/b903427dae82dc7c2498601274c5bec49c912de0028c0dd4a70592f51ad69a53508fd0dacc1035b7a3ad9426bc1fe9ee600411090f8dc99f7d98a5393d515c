"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontSize = void 0;
const utils_1 = require("../../../../utils");
const commands_1 = require("../../../commands");
const components_1 = require("../../components");
const FONT_SIZE_CLASS = 'infographic-font-size-grid';
const FONT_SIZE_STYLE_ID = 'infographic-font-size-grid-style';
const FONT_SIZE_OPTIONS = [
    { label: 'XS', value: 12 },
    { label: 'S', value: 14 },
    { label: 'M', value: 16 },
    { label: 'L', value: 20 },
    { label: 'XL', value: 24 },
];
const FONT_SIZE_STYLES = `
.${FONT_SIZE_CLASS} {
  display: grid;
  grid-template-columns: repeat(5, 32px);
  grid-auto-rows: 32px;
  gap: 2px;
}
`;
const FontSize = (selection, attrs, commander) => {
    (0, utils_1.injectStyleOnce)(FONT_SIZE_STYLE_ID, FONT_SIZE_STYLES);
    const button = (0, components_1.IconButton)({ icon: components_1.TEXT_ICONS.fontSize });
    const currentSize = normalizeFontSize(attrs['font-size']);
    const content = createFontSizeContent(currentSize, (size) => {
        commander.executeBatch(selection.map((text) => new commands_1.UpdateElementCommand(text, {
            attributes: { 'font-size': size },
        })));
    });
    return (0, components_1.Popover)({
        target: button,
        content,
        placement: 'top',
        offset: 12,
    });
};
exports.FontSize = FontSize;
function createFontSizeContent(defaultSize, onSizeChange) {
    const content = document.createElement('div');
    content.classList.add(FONT_SIZE_CLASS);
    let selected = defaultSize;
    const buttons = {};
    const updateAllButtons = () => {
        Object.entries(buttons).forEach(([value, button]) => {
            const isActive = Number(value) === selected;
            button.setActivate(isActive);
        });
    };
    FONT_SIZE_OPTIONS.forEach(({ label, value }) => {
        const button = (0, components_1.IconButton)({
            icon: createLabelIcon(label),
            onClick: () => {
                if (selected === value)
                    return;
                selected = value;
                updateAllButtons();
                onSizeChange(value);
            },
            activate: value === selected,
        });
        buttons[String(value)] = button;
        content.appendChild(button);
    });
    return content;
}
function createLabelIcon(label) {
    return () => {
        const size = '1.2em';
        const span = document.createElement('span');
        span.textContent = label;
        span.style.display = 'inline-flex';
        span.style.alignItems = 'center';
        span.style.justifyContent = 'center';
        span.style.width = size;
        span.style.height = size;
        span.style.fontSize = '12px';
        return span;
    };
}
function normalizeFontSize(size) {
    const DEFAULT_SIZE = 12;
    if (typeof size === 'number')
        return size;
    if (typeof size === 'string') {
        const num = parseFloat(size);
        return Number.isFinite(num) ? num : DEFAULT_SIZE;
    }
    return DEFAULT_SIZE;
}
