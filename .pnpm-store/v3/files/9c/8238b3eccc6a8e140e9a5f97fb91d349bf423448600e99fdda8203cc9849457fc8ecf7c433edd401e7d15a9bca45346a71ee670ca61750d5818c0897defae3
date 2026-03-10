"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontAlign = void 0;
const utils_1 = require("../../../../utils");
const commands_1 = require("../../../commands");
const components_1 = require("../../components");
// 常量定义
const GRID_CLASS = 'infographic-font-align-grid';
const GRID_STYLE_ID = 'infographic-font-align-grid-style';
const HORIZONTAL_ALIGN_OPTIONS = [
    { icon: components_1.TEXT_ICONS.alignLeft, align: 'LEFT' },
    { icon: components_1.TEXT_ICONS.alignCenter, align: 'CENTER' },
    { icon: components_1.TEXT_ICONS.alignRight, align: 'RIGHT' },
];
const VERTICAL_ALIGN_OPTIONS = [
    { icon: components_1.TEXT_ICONS.alignTop, align: 'TOP' },
    { icon: components_1.TEXT_ICONS.alignMiddle, align: 'MIDDLE' },
    { icon: components_1.TEXT_ICONS.alignBottom, align: 'BOTTOM' },
];
const GRID_STYLES = `
.${GRID_CLASS} {
  display: grid;
  grid-template-columns: repeat(3, 32px);
  grid-auto-rows: 32px;
  gap: 2px;
}
`;
const FontAlign = (selection, attrs, commander) => {
    (0, utils_1.injectStyleOnce)(GRID_STYLE_ID, GRID_STYLES);
    const state = {
        horizontal: attrs['data-horizontal-align'],
        vertical: attrs['data-vertical-align'],
    };
    const button = (0, components_1.IconButton)({ icon: components_1.TEXT_ICONS.align });
    const content = createAlignContent(state, (align) => {
        const attributes = {};
        if (align.horizontal)
            attributes['data-horizontal-align'] = align.horizontal;
        if (align.vertical)
            attributes['data-vertical-align'] = align.vertical;
        if (!Object.keys(attributes).length)
            return;
        commander.executeBatch(selection.map((text) => new commands_1.UpdateElementCommand(text, {
            attributes,
        })));
    });
    return (0, components_1.Popover)({
        target: button,
        content,
        placement: 'top',
        offset: 12,
    });
};
exports.FontAlign = FontAlign;
function createAlignContent(state, onAlignChange) {
    const content = document.createElement('div');
    content.classList.add(GRID_CLASS);
    const buttons = {};
    const updateAllButtons = () => {
        Object.entries(buttons).forEach(([align, button]) => {
            const isActive = align === state.horizontal || align === state.vertical;
            button.setActivate(isActive);
        });
    };
    const createButtons = (options, stateKey) => {
        options.forEach(({ icon, align }) => {
            const button = (0, components_1.IconButton)({
                icon,
                onClick: () => {
                    if (state[stateKey] === align)
                        return;
                    Object.assign(state, { [stateKey]: align });
                    updateAllButtons();
                    onAlignChange(Object.assign({}, state));
                },
                activate: align === state[stateKey],
            });
            buttons[align] = button;
            content.appendChild(button);
        });
    };
    createButtons(HORIZONTAL_ALIGN_OPTIONS, 'horizontal');
    createButtons(VERTICAL_ALIGN_OPTIONS, 'vertical');
    return content;
}
