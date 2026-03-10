"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Select = Select;
const utils_1 = require("../../../utils");
const SELECT_CLASS = 'infographic-edit-select';
const SELECT_STYLE_ID = 'infographic-edit-select-style';
const OPTION_CLASS = `${SELECT_CLASS}__option`;
const DROPDOWN_CLASS = `${SELECT_CLASS}__dropdown`;
const TRIGGER_CLASS = `${SELECT_CLASS}__trigger`;
const LABEL_CLASS = `${SELECT_CLASS}__label`;
const ARROW_CLASS = `${SELECT_CLASS}__arrow`;
function Select(props) {
    ensureSelectStyle();
    let open = false;
    let options = props.options || [];
    let selected = props.value;
    const container = document.createElement('div');
    container.classList.add(SELECT_CLASS);
    container.tabIndex = 0;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.classList.add(TRIGGER_CLASS);
    const label = document.createElement('span');
    label.classList.add(LABEL_CLASS);
    trigger.appendChild(label);
    const arrow = document.createElement('span');
    arrow.classList.add(ARROW_CLASS);
    arrow.textContent = 'v';
    trigger.appendChild(arrow);
    const dropdown = document.createElement('div');
    dropdown.classList.add(DROPDOWN_CLASS);
    dropdown.setAttribute('data-open', 'false');
    container.appendChild(trigger);
    container.appendChild(dropdown);
    const handleDocumentClick = (event) => {
        if (!container.contains(event.target)) {
            setOpen(false);
        }
    };
    const renderLabel = () => {
        var _a, _b, _c;
        const option = options.find((opt) => opt.value === selected);
        const custom = (_a = props.renderLabel) === null || _a === void 0 ? void 0 : _a.call(props, option);
        if (typeof custom === 'string') {
            label.textContent = custom;
        }
        else if (custom instanceof HTMLElement) {
            label.replaceChildren(custom);
        }
        else if (custom === null || custom === undefined) {
            if (option) {
                label.textContent = (_b = option.label) !== null && _b !== void 0 ? _b : option.value;
            }
            else {
                label.textContent = (_c = props.placeholder) !== null && _c !== void 0 ? _c : '请选择';
            }
        }
        else {
            label.textContent = String(custom);
        }
    };
    const renderOptions = () => {
        dropdown.innerHTML = '';
        options.forEach((option) => {
            var _a, _b, _c, _d;
            const optionNode = (_d = (_b = (_a = props.renderOption) === null || _a === void 0 ? void 0 : _a.call(props, option)) !== null && _b !== void 0 ? _b : (_c = option.render) === null || _c === void 0 ? void 0 : _c.call(option)) !== null && _d !== void 0 ? _d : defaultOptionNode(option);
            optionNode.classList.add(OPTION_CLASS);
            optionNode.setAttribute('data-value', option.value);
            if (option.disabled) {
                optionNode.setAttribute('aria-disabled', 'true');
                optionNode.classList.add(`${OPTION_CLASS}--disabled`);
            }
            else {
                optionNode.addEventListener('click', () => {
                    selectValue(option.value, option);
                });
            }
            dropdown.appendChild(optionNode);
        });
    };
    const selectValue = (value, option) => {
        var _a;
        selected = value;
        renderLabel();
        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, value, option);
        setOpen(false);
    };
    const setOpen = (value) => {
        open = value;
        dropdown.setAttribute('data-open', String(open));
        container.setAttribute('data-open', String(open));
        if (open) {
            document.addEventListener('click', handleDocumentClick);
        }
        else {
            document.removeEventListener('click', handleDocumentClick);
        }
    };
    trigger.addEventListener('click', () => setOpen(!open));
    renderLabel();
    renderOptions();
    const api = {
        setValue: (value) => {
            selected = value;
            renderLabel();
        },
        getValue: () => selected,
        setOptions: (nextOptions) => {
            options = nextOptions;
            renderOptions();
            renderLabel();
        },
        destroy: () => {
            document.removeEventListener('click', handleDocumentClick);
            container.remove();
        },
    };
    return Object.assign(container, api);
}
function ensureSelectStyle() {
    (0, utils_1.injectStyleOnce)(SELECT_STYLE_ID, `
.${SELECT_CLASS} {
  position: relative;
  display: inline-flex;
  min-width: 140px;
  font-family: "Helvetica Neue", Arial, sans-serif;
}
.${TRIGGER_CLASS} {
  width: 100%;
  height: 32px;
  padding: 4px 28px 4px 8px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: #000000d9;
  cursor: pointer;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.${TRIGGER_CLASS}:hover {
  border-color: #4096ff;
}
.${TRIGGER_CLASS}:focus-visible {
  border-color: #4096ff;
  box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2);
}
.${LABEL_CLASS} {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.${ARROW_CLASS} {
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  font-size: 10px;
  color: #8c8c8c;
}
.${DROPDOWN_CLASS} {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05);
  padding: 4px 0;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  display: none;
}
.${DROPDOWN_CLASS}[data-open="true"] {
  display: block;
}
.${OPTION_CLASS} {
  padding: 6px 12px;
  font-size: 12px;
  color: #000000d9;
  cursor: pointer;
  line-height: 1.5;
}
.${OPTION_CLASS}:hover {
  background: #f5f5f5;
}
.${OPTION_CLASS}--disabled {
  color: #bfbfbf;
  cursor: not-allowed;
}
.${OPTION_CLASS}--disabled:hover {
  background: transparent;
}
`);
}
function defaultOptionNode(option) {
    var _a;
    const node = document.createElement('div');
    node.textContent = (_a = option.label) !== null && _a !== void 0 ? _a : option.value;
    return node;
}
