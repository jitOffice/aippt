import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { getElementBounds } from '../../jsx/index.js';
import { Illus, ItemDesc, ItemLabel } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { getItemProps } from '../utils/index.js';
import { registerItem } from './registry.js';
export const SimpleIllusItem = (props) => {
    const [{ indexes, datum, width = 180, illusSize = width, gap = 8, themeColors, usePaletteColor = false, }, restProps,] = getItemProps(props, ['width', 'illusSize', 'gap', 'usePaletteColor']);
    const { label, desc } = datum;
    const labelColor = usePaletteColor
        ? themeColors.colorPrimary
        : themeColors.colorText;
    const labelContent = (_jsx(ItemLabel, { indexes: indexes, width: width, alignHorizontal: "center", alignVertical: "middle", fill: labelColor, children: label }));
    const labelBounds = getElementBounds(labelContent);
    return (_jsxs(FlexLayout, Object.assign({}, restProps, { width: width, height: illusSize + gap + labelBounds.height + gap + 48, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: gap, children: [_jsx(Illus, { indexes: indexes, width: illusSize, height: illusSize }), labelContent, _jsx(ItemDesc, { indexes: indexes, width: width, alignHorizontal: "center", alignVertical: "top", fill: themeColors.colorTextSecondary, lineNumber: 3, children: desc })] })));
};
registerItem('simple-illus', {
    component: SimpleIllusItem,
    composites: ['illus', 'label', 'desc'],
});
