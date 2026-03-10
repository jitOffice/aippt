"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceAscendingStairs3d = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const decorations_1 = require("../decorations");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const CUBE_GAP_X = -118;
const CUBE_GAP_Y = 118;
const CUBE_WIDTH = 240;
const CUBE_HEIGHT = 180;
const ITEM_GAP = 40;
const CUBE_PATH_BOTTOM = 'M238.9 69.7a6 6 0 0 1-.1 1v.2l-.2.3v.3l-.1.3a6.2 6.2 0 0 1-.3.6l-.1.3-.2.3-.2.4-.3.5-.1.1a10.9 10.9 0 0 1-.8 1v.1l-.5.5h-.1l-.4.4-.3.3-.3.2-.3.3-.4.2a13 13 0 0 1-.7.5l-.4.3-.5.3-97.5 56.7-.7.4h-.2l-.6.4h-.1l-.8.4h-.2l-.6.4h-.2l-.8.3h-.2l-.5.3-.5.1-.5.1-.5.2h-.5a33.7 33.7 0 0 1-3.2.7h-.2l-1 .2h-1.6l-.7.1h-4.7l-.8-.1h-.2a38.2 38.2 0 0 1-2-.4h-.4l-.7-.2h-.4l-.7-.2-.4-.1a27.3 27.3 0 0 1-2.2-.7h-.2a44.2 44.2 0 0 1-.9-.3l-.5-.3-.4-.1-.5-.2-.3-.2-.5-.2-.3-.2-.8-.4L6.5 78C2.2 75.6 0 72.4 0 69v41.7c0 3.2 2.1 6.5 6.4 9l98.1 56.6a23.2 23.2 0 0 0 1 .6l.6.3.3.1.5.2.4.2.3.1h.2l.2.2a21.4 21.4 0 0 0 1.9.6l.3.1h.2l.7.2a77.6 77.6 0 0 1 1.1.3h.3l.7.2h.4a42.5 42.5 0 0 0 1 .2l1 .2h1.1l.4.1h2.1l.7.1h1.5a22 22 0 0 0 1.8-.2h.4l1.1-.1h.2l1.2-.2h.1l.3-.1.6-.1a12.5 12.5 0 0 0 1-.3h.5l.5-.2a29 29 0 0 0 1-.3h.2l.3-.2h.2a27 27 0 0 0 1.6-.7h.2l.8-.4a19.4 19.4 0 0 0 1.6-.9l97.5-56.7.3-.1.2-.2.4-.2.4-.3.3-.2.3-.3.4-.2.3-.3.3-.3h.1l.3-.3.5-.6h.1l.3-.5h.1v-.1l.4-.4v-.1l.4-.5v-.1l.1-.2.1-.2.2-.3.1-.3.1-.3.1-.1a6.9 6.9 0 0 0 .2-.8l.1-.3v-.4l.1-.3v-1l.2-41.4v.4Z';
const CUBE_PATH_TOP = 'M232.5 60.4c8.5 4.9 8.5 12.8.1 17.7l-97.5 56.7c-8.4 4.9-22 4.9-30.5 0L6.5 78C-2 73-2 65.3 6.4 60.4l97.5-56.7c8.4-5 22-5 30.5 0l98.1 56.7Z';
const CUBE_PATH_STROKE = 'M119.1 0A31 31 0 0 0 104 3.7L6.4 60.4C-2 65.3-2 73.2 6.4 78l98.2 56.7c4.2 2.4 9.8 3.7 15.3 3.7a31 31 0 0 0 15.2-3.7L232.6 78c8.4-5 8.4-12.8 0-17.7L134.3 3.7A31.2 31.2 0 0 0 119.1 0Zm0 2.5c5.4 0 10.3 1.2 14 3.3l98.2 56.7c3.3 2 5.1 4.3 5.1 6.8 0 2.4-1.8 4.7-5 6.6l-97.5 56.7a28.3 28.3 0 0 1-14 3.4c-5.3 0-10.3-1.2-14-3.4L7.7 76c-3.3-1.9-5-4.3-5-6.7 0-2.4 1.7-4.8 5-6.7L105 5.8a29 29 0 0 1 14-3.3Z';
const DropShadowFilter = ((0, jsx_runtime_1.jsxs)("filter", { id: "sequence-ascending-stairs-3d-shadow-filter", x: "-50%", y: "-50%", width: "200%", height: "200%", filterUnits: "userSpaceOnUse", colorInterpolationFilters: "sRGB", children: [(0, jsx_runtime_1.jsx)("feFlood", { floodOpacity: "0", result: "BackgroundImageFix" }), (0, jsx_runtime_1.jsx)("feColorMatrix", { in: "SourceAlpha", type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0", result: "hardAlpha" }), (0, jsx_runtime_1.jsx)("feOffset", { dx: "0", dy: "4" }), (0, jsx_runtime_1.jsx)("feGaussianBlur", { stdDeviation: "6" }), (0, jsx_runtime_1.jsx)("feComposite", { in2: "hardAlpha", operator: "out" }), (0, jsx_runtime_1.jsx)("feColorMatrix", { type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" }), (0, jsx_runtime_1.jsx)("feBlend", { mode: "normal", in2: "BackgroundImageFix", result: "effect1_dropShadow" }), (0, jsx_runtime_1.jsx)("feBlend", { mode: "normal", in: "SourceGraphic", in2: "effect1_dropShadow", result: "shape" })] }));
const SequenceAscendingStairs3d = (props) => {
    const { Title, Item, data, options, cubeWidth = CUBE_WIDTH } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    if (items.length === 0) {
        const btnAddElement = (0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0], x: 0, y: 0 });
        return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [(0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: DropShadowFilter }), titleContent, (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnAddElement }) })] }));
    }
    const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
    const btnElements = [];
    const itemElements = [];
    const cubeElements = [];
    const cubeScale = cubeWidth / CUBE_WIDTH;
    const scaledCubeHeight = CUBE_HEIGHT * cubeScale;
    items.forEach((item, index) => {
        const indexes = [index];
        const currentColor = (0, utils_1.getPaletteColor)(options, indexes);
        const cubeX = index * (cubeWidth + CUBE_GAP_X);
        const cubeY = (items.length - 1 - index) * CUBE_GAP_Y;
        const gradientIdBottom = `cube-gradient-bottom-${index}`;
        const gradientIdTop = `cube-gradient-top-${index}`;
        const gradientIdStroke = `cube-gradient-stroke-${index}`;
        cubeElements.push((0, jsx_runtime_1.jsxs)(jsx_1.Group, { x: cubeX, y: cubeY, id: `cube-${index}`, width: cubeWidth, height: scaledCubeHeight, filter: "url(#sequence-ascending-stairs-3d-shadow-filter)", children: [(0, jsx_runtime_1.jsxs)(jsx_1.Defs, { children: [(0, jsx_runtime_1.jsxs)("linearGradient", { id: gradientIdBottom, x1: "0", y1: "124.5", x2: "238.9", y2: "124.5", gradientUnits: "userSpaceOnUse", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0", stopColor: currentColor, stopOpacity: "0.8" }), (0, jsx_runtime_1.jsx)("stop", { offset: "1", stopColor: currentColor, stopOpacity: "0.4" })] }), (0, jsx_runtime_1.jsxs)("linearGradient", { id: gradientIdTop, x1: "119.5", y1: "0", x2: "119.5", y2: "138.5", gradientUnits: "userSpaceOnUse", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0", stopColor: currentColor, stopOpacity: "0.9" }), (0, jsx_runtime_1.jsx)("stop", { offset: "1", stopColor: currentColor, stopOpacity: "0.5" })] }), (0, jsx_runtime_1.jsxs)("linearGradient", { id: gradientIdStroke, x1: "119.5", y1: "0", x2: "119.5", y2: "138.5", gradientUnits: "userSpaceOnUse", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0", stopColor: currentColor }), (0, jsx_runtime_1.jsx)("stop", { offset: "1", stopColor: currentColor, stopOpacity: "0.7" })] })] }), (0, jsx_runtime_1.jsxs)(components_1.ShapesGroup, { transform: `scale(${cubeScale})`, children: [(0, jsx_runtime_1.jsx)(jsx_1.Path, { d: CUBE_PATH_BOTTOM, fill: `url(#${gradientIdBottom})` }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: CUBE_PATH_TOP, fill: `url(#${gradientIdTop})` }), (0, jsx_runtime_1.jsx)(jsx_1.Path, { d: CUBE_PATH_STROKE, fill: `url(#${gradientIdStroke})` })] }), (0, jsx_runtime_1.jsx)(decorations_1.Text3d, { text: index + 1, x: 115, y: 65, fontSize: 56 })] }));
        const itemX = cubeX + cubeWidth + ITEM_GAP;
        const itemY = cubeY + scaledCubeHeight / 2;
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: item, data: data, x: itemX, y: itemY, positionH: "normal" }));
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: indexes, x: cubeX + cubeWidth - btnBounds.width / 2, y: cubeY - btnBounds.height / 2 }));
        if (index === 0) {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0], x: cubeX - 30 - btnBounds.width / 2, y: cubeY + scaledCubeHeight / 2 - btnBounds.height / 2 }));
        }
        if (index < items.length - 1) {
            const nextCubeY = (items.length - 1 - (index + 1)) * CUBE_GAP_Y;
            const btnAddX = cubeX + cubeWidth - btnBounds.width / 2;
            const btnAddY = (cubeY + scaledCubeHeight / 2 + nextCubeY + scaledCubeHeight / 2) / 2 -
                btnBounds.height / 2;
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [index + 1], x: btnAddX, y: btnAddY }));
        }
        else {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [items.length], x: cubeX + cubeWidth + 30 - btnBounds.width / 2, y: cubeY + scaledCubeHeight / 2 - btnBounds.height / 2 }));
        }
    });
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 30, children: [(0, jsx_runtime_1.jsx)(jsx_1.Defs, { children: DropShadowFilter }), titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { x: 0, y: 0, children: [(0, jsx_runtime_1.jsx)(jsx_1.Group, { children: cubeElements }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.SequenceAscendingStairs3d = SequenceAscendingStairs3d;
(0, registry_1.registerStructure)('sequence-ascending-stairs-3d', {
    component: exports.SequenceAscendingStairs3d,
    composites: ['title', 'item'],
});
