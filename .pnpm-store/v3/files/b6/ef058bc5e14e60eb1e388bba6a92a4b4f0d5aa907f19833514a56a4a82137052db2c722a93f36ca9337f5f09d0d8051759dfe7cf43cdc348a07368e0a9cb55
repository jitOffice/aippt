import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
import { getElementBounds, Group } from '../../jsx/index.js';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components/index.js';
import { FlexLayout } from '../layouts/index.js';
import { registerStructure } from './registry.js';
export const RelationCircle = (props) => {
    const { Title, Item, data, radius = 150, startMode = 'top' } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? _jsx(Title, { title: title, desc: desc }) : null;
    const btnBounds = getElementBounds(_jsx(BtnAdd, { indexes: [0] }));
    const itemBounds = getElementBounds(_jsx(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
    const btnElements = [];
    const itemElements = [];
    if (items.length === 0) {
        btnElements.push(_jsx(BtnAdd, { indexes: [0], x: -btnBounds.width / 2, y: -btnBounds.height / 2 }));
        return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsx(Group, { children: _jsx(BtnsGroup, { children: btnElements }) })] }));
    }
    // Calculate minimum radius to avoid item overlaps
    const size = Math.max(itemBounds.width, itemBounds.height);
    const minRadius = Math.max(radius, size);
    const centerOffset = minRadius + size / 2;
    const itemArcWeights = items.map(() => {
        const w = itemBounds.width;
        const h = itemBounds.height;
        return (w + h) / 2;
    });
    const totalWeight = itemArcWeights.reduce((a, b) => a + b, 0);
    let startAngle;
    if (startMode === 'equal') {
        startAngle = -Math.PI / 2;
    }
    else {
        startAngle = -Math.PI / 2 + (2 * Math.PI) / items.length / 2;
    }
    // Step2: 角度累积分配
    let angleAcc = startAngle;
    items.forEach((item, index) => {
        const anglePortion = (itemArcWeights[index] / totalWeight) * 2 * Math.PI;
        const angle = angleAcc + anglePortion / 2;
        angleAcc += anglePortion;
        const itemX = centerOffset + minRadius * Math.cos(angle) - itemBounds.width / 2;
        const itemY = centerOffset + minRadius * Math.sin(angle) - itemBounds.height / 2;
        itemElements.push(_jsx(Item, { indexes: [index], datum: item, data: data, x: itemX, y: itemY }));
        const removeRadius = minRadius - Math.max(itemBounds.width, itemBounds.height) / 2 - 20;
        const removeBtnX = centerOffset + removeRadius * Math.cos(angle) - btnBounds.width / 2;
        const removeBtnY = centerOffset + removeRadius * Math.sin(angle) - btnBounds.height / 2;
        btnElements.push(_jsx(BtnRemove, { indexes: [index], x: removeBtnX, y: removeBtnY }));
    });
    // Use same radius as remove buttons for add buttons
    const buttonRadius = minRadius - Math.max(itemBounds.width, itemBounds.height) / 2 - 20;
    // Place add buttons between items (at the midpoint angles)
    if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            // Calculate angle between current item and next item
            const currentAngle = (i * 2 * Math.PI) / items.length - Math.PI / 2;
            const nextAngle = (((i + 1) % items.length) * 2 * Math.PI) / items.length - Math.PI / 2;
            // Handle angle wrapping between last and first item
            let midAngle;
            if (i === items.length - 1) {
                // Between last and first item
                const angleDiff = nextAngle + 2 * Math.PI - currentAngle;
                midAngle = currentAngle + angleDiff / 2;
            }
            else {
                midAngle = (currentAngle + nextAngle) / 2;
            }
            const addX = centerOffset + buttonRadius * Math.cos(midAngle) - btnBounds.width / 2;
            const addY = centerOffset + buttonRadius * Math.sin(midAngle) - btnBounds.height / 2;
            btnElements.push(_jsx(BtnAdd, { indexes: [i + 1], x: addX, y: addY }));
        }
    }
    return (_jsxs(FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, _jsxs(Group, { children: [_jsx(ItemsGroup, { children: itemElements }), _jsx(BtnsGroup, { children: btnElements })] })] }));
};
registerStructure('relation-circle', {
    component: RelationCircle,
    composites: ['title', 'item'],
});
