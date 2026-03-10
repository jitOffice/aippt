"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationCircle = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const registry_1 = require("./registry");
const RelationCircle = (props) => {
    const { Title, Item, data, radius = 150, startMode = 'top' } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: items[0], positionH: "center" }));
    const btnElements = [];
    const itemElements = [];
    if (items.length === 0) {
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0], x: -btnBounds.width / 2, y: -btnBounds.height / 2 }));
        return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements }) })] }));
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
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: [index], datum: item, data: data, x: itemX, y: itemY }));
        const removeRadius = minRadius - Math.max(itemBounds.width, itemBounds.height) / 2 - 20;
        const removeBtnX = centerOffset + removeRadius * Math.cos(angle) - btnBounds.width / 2;
        const removeBtnY = centerOffset + removeRadius * Math.sin(angle) - btnBounds.height / 2;
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: [index], x: removeBtnX, y: removeBtnY }));
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
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [i + 1], x: addX, y: addY }));
        }
    }
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.RelationCircle = RelationCircle;
(0, registry_1.registerStructure)('relation-circle', {
    component: exports.RelationCircle,
    composites: ['title', 'item'],
});
