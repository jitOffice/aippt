"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = void 0;
const editor_1 = require("../editor");
const createDefaultPlugins = () => [
    new editor_1.EditBar(),
    new editor_1.ResizeElement(),
    new editor_1.ResetViewBox(),
];
const createDefaultInteractions = () => [
    new editor_1.DragCanvas(),
    new editor_1.DblClickEditText(),
    new editor_1.BrushSelect(),
    new editor_1.ClickSelect(),
    new editor_1.DragElement(),
    new editor_1.HotkeyHistory(),
    new editor_1.ZoomWheel(),
    new editor_1.SelectHighlight(),
];
exports.DEFAULT_OPTIONS = {
    padding: 20,
    theme: 'light',
    themeConfig: {
        palette: 'antv',
    },
    get plugins() {
        return createDefaultPlugins();
    },
    get interactions() {
        return createDefaultInteractions();
    },
};
