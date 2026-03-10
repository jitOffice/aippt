import { BrushSelect, ClickSelect, DblClickEditText, DragCanvas, DragElement, EditBar, HotkeyHistory, ResetViewBox, ResizeElement, SelectHighlight, ZoomWheel, } from '../editor/index.js';
const createDefaultPlugins = () => [
    new EditBar(),
    new ResizeElement(),
    new ResetViewBox(),
];
const createDefaultInteractions = () => [
    new DragCanvas(),
    new DblClickEditText(),
    new BrushSelect(),
    new ClickSelect(),
    new DragElement(),
    new HotkeyHistory(),
    new ZoomWheel(),
    new SelectHighlight(),
];
export const DEFAULT_OPTIONS = {
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
