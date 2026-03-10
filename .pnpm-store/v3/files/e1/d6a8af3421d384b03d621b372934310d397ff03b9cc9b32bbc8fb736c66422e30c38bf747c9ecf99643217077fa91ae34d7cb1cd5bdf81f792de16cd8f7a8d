import { jsx as _jsx } from "../../jsx-runtime.js";
import { ItemLabel } from '../components/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const LabelText = (props) => {
    var _a;
    const [{ indexes, datum, width = 120, themeColors, positionH = 'normal', positionV = 'center', formatter = (text) => text || '', usePaletteColor = false, lineNumber = 1, }, restProps,] = getItemProps(props, [
        'width',
        'formatter',
        'usePaletteColor',
        'lineNumber',
    ]);
    const fontSize = 14;
    const lineHeight = 1.4;
    const height = (_a = restProps.height) !== null && _a !== void 0 ? _a : Math.ceil(lineNumber * lineHeight * fontSize);
    return (_jsx(ItemLabel, Object.assign({}, restProps, { indexes: indexes, width: width, height: height, lineHeight: lineHeight, fill: usePaletteColor ? themeColors.colorPrimary : themeColors.colorText, fontSize: fontSize, fontWeight: "regular", alignHorizontal: positionH === 'flipped'
            ? 'right'
            : positionH === 'center'
                ? 'center'
                : 'left', alignVertical: positionV === 'flipped'
            ? 'bottom'
            : positionV === 'center'
                ? 'middle'
                : 'top', children: formatter(datum.label || datum.desc) })));
};
registerItem('plain-text', {
    component: LabelText,
    composites: ['label'],
});
