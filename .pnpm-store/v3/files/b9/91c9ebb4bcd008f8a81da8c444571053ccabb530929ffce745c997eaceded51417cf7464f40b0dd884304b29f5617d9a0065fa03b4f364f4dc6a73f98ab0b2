"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceMountain = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
function Mountain(props) {
    const { width, height, colorPrimary } = props;
    const leftBottomColor = colorPrimary;
    const rightBottomColor = tinycolor2_1.default
        .mix(colorPrimary, '#000', 20)
        .toHexString();
    const leftTopColor = tinycolor2_1.default.mix(colorPrimary, '#fff', 50).toHexString();
    const rightTopColor = tinycolor2_1.default.mix(leftTopColor, '#000', 15).toHexString();
    function calculateMountainPoints(width, height) {
        // 内置参数
        const snowLine = 0.35; // 雪线位置（0-1）
        const ripples = [
            { position: 0.25, offset: 0.1 }, // 左侧向下
            { position: 0.45, offset: -0.02 }, // 中线向上
            { position: 0.6, offset: 0.04 }, // 右侧第一个向下
            { position: 0.75, offset: -0.1 }, // 右侧第二个向上
        ];
        // 1. 计算三角形的三个基本点
        const leftBottom = { x: 0, y: height };
        const rightBottom = { x: width, y: height };
        const peak = { x: width / 2, y: 0 };
        const centerBottom = { x: width / 2, y: height };
        // 2. 计算雪线的 Y 坐标
        const snowLineY = height * snowLine;
        // 3. 计算雪线在左边线、中线、右边线上的交点
        const t = snowLineY / height;
        const leftEdge = {
            x: peak.x * (1 - t) + leftBottom.x * t,
            y: snowLineY,
        };
        const centerSnow = {
            x: peak.x,
            y: snowLineY,
        };
        const rightEdge = {
            x: peak.x * (1 - t) + rightBottom.x * t,
            y: snowLineY,
        };
        // 4. 计算起伏点
        const allRipples = ripples.map((ripple) => {
            const baseX = leftEdge.x + (rightEdge.x - leftEdge.x) * ripple.position;
            const baseY = snowLineY;
            const offsetY = height * ripple.offset;
            return {
                x: baseX,
                y: baseY + offsetY,
                position: ripple.position,
                offset: ripple.offset,
            };
        });
        // 按 position 排序
        allRipples.sort((a, b) => a.position - b.position);
        // 5. 分为左右两组（以 centerSnow 的 x 坐标为界）
        const leftRipples = allRipples.filter((p) => p.x <= centerSnow.x);
        const rightRipples = allRipples.filter((p) => p.x > centerSnow.x);
        // 返回所有计算出的点
        return {
            // 基础三角形点
            leftBottom,
            rightBottom,
            peak,
            centerBottom,
            // 雪线相关点
            snowLineY,
            leftEdge,
            centerSnow,
            rightEdge,
            // 起伏点（分为左右两组）
            leftRipples,
            rightRipples,
        };
    }
    // 测试
    const { leftRipples, rightRipples, leftBottom, rightBottom, peak, centerBottom, leftEdge, centerSnow, rightEdge, } = calculateMountainPoints(width, height);
    const leftTopShape = [peak, leftEdge, ...leftRipples, centerSnow];
    const rightTopShape = [peak, centerSnow, ...rightRipples, rightEdge];
    const leftBottomShape = [
        leftEdge,
        ...leftRipples,
        centerSnow,
        centerBottom,
        leftBottom,
    ];
    const rightBottomShape = [
        centerSnow,
        ...rightRipples,
        rightEdge,
        rightBottom,
        centerBottom,
    ];
    const toPointsString = (points) => points.map((p) => `${p.x},${p.y}`).join(' ');
    return ((0, jsx_runtime_1.jsxs)(components_1.ShapesGroup, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsx)("polygon", { points: toPointsString(leftTopShape), fill: leftTopColor }), (0, jsx_runtime_1.jsx)("polygon", { points: toPointsString(rightTopShape), fill: rightTopColor }), (0, jsx_runtime_1.jsx)("polygon", { points: toPointsString(leftBottomShape), fill: leftBottomColor }), (0, jsx_runtime_1.jsx)("polygon", { points: toPointsString(rightBottomShape), fill: rightBottomColor })] })));
}
function Tree(size) {
    const heightMap = {
        tiny: 27,
        small: 48,
        medium: 54,
        large: 72,
    };
    const height = heightMap[size] || 54;
    const leftLeafColor = '#17C76F';
    const rightLeafColor = '#139B57';
    const trunkColor = '#737373';
    const leafHeight = height * 0.7;
    const trunkHeight = height - leafHeight;
    const leafWidth = leafHeight * 0.8;
    const width = leafWidth;
    const trunkWidth = width / 6;
    const trunkX = (width - trunkWidth) / 2;
    const trunkY = leafHeight;
    return ((0, jsx_runtime_1.jsxs)(components_1.ShapesGroup, { width: width, height: height, children: [(0, jsx_runtime_1.jsx)("ellipse", { cx: leafWidth / 2, cy: leafHeight / 2, rx: leafWidth / 2, ry: leafHeight / 2, fill: leftLeafColor, clipPath: `inset(0 50% 0 0)` }), (0, jsx_runtime_1.jsx)("ellipse", { cx: leafWidth / 2, cy: leafHeight / 2, rx: leafWidth / 2, ry: leafHeight / 2, fill: rightLeafColor, clipPath: `inset(0 0 0 50%)` }), (0, jsx_runtime_1.jsx)("rect", { x: trunkX, y: trunkY, width: trunkWidth, height: trunkHeight, fill: trunkColor })] }));
}
function Sun(props) {
    const { width, height } = props;
    // 基于尺寸计算各部分比例
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.28; // 圆半径约为尺寸的28%
    const rayWidth = Math.min(width, height) * 0.14; // 光线宽度约为尺寸的14%
    const rayHeight = Math.min(width, height) * 0.07; // 光线高度约为尺寸的7%
    const rayX = 0;
    const rayY = centerY - rayHeight / 2; // 光线垂直居中对齐
    const cornerRadius = rayHeight * 0.4; // 圆角半径为光线高度的40%
    const rayCount = 8;
    // 生成光线数组
    const rays = Array.from({ length: rayCount }, (_, i) => {
        const angle = (360 / rayCount) * i;
        return ((0, jsx_runtime_1.jsx)("rect", { x: rayX, y: rayY, width: rayWidth, height: rayHeight, rx: cornerRadius, ry: cornerRadius, fill: "#FFCB0E", transform: `rotate(${angle}, ${centerX}, ${centerY})` }));
    });
    return ((0, jsx_runtime_1.jsxs)(components_1.ShapesGroup, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsx)("circle", { cx: centerX, cy: centerY, r: radius, fill: "#FFCB0E" }), ...rays] })));
}
function Cloud(props) {
    if (props.type === 'single') {
        return ((0, jsx_runtime_1.jsx)(components_1.ShapesGroup, Object.assign({}, props, { width: 54, height: 36, children: (0, jsx_runtime_1.jsx)("path", { d: "M10.2635 13.3806C11.0019 9.99045 12.7381 6.91002 15.2405 4.55004C17.743 2.19007 20.8929 0.662716 24.2701 0.171643C27.6473 -0.31943 31.0914 0.24912 34.143 1.80148C37.1946 3.35385 39.7087 5.81625 41.3501 8.86031C44.8835 9.0468 48.1994 10.6544 50.5684 13.3294C52.9373 16.0044 54.1653 19.5277 53.9821 23.1242C53.7989 26.7207 52.2195 30.0959 49.5914 32.5071C46.9634 34.9184 43.5019 36.1683 39.9684 35.9818H11.1517C4.93436 35.9818 0 30.9593 0 24.6309C0.0598447 21.8016 1.13799 19.093 3.02989 17.0192C4.9218 14.9454 7.49584 13.6506 10.2635 13.3806Z", fill: "#70CAF8" }) })));
    }
    return ((0, jsx_runtime_1.jsxs)(components_1.ShapesGroup, Object.assign({}, props, { width: 73, height: 40, children: [(0, jsx_runtime_1.jsx)("path", { d: "M61.6461 14.9716C60.8681 11.1875 58.9581 7.73823 56.1763 5.09315C53.3944 2.44806 49.8758 0.735682 46.0992 0.189041C42.3226 -0.357601 38.4714 0.288046 35.0699 2.03812C31.6683 3.7882 28.8815 6.5577 27.0889 9.96971C23.161 10.1687 19.4719 11.9405 16.8333 14.8953C14.1947 17.8502 12.8227 21.746 13.0191 25.7258C13.2155 29.7055 14.9642 33.4433 17.8806 36.1167C20.7969 38.7901 24.642 40.1802 28.5699 39.9812H60.6588C67.5702 39.9812 73.0006 34.4791 73.0006 27.4764C73.0006 20.9739 67.8664 15.4718 61.6461 14.9716Z", fill: "#70CAF8" }), (0, jsx_runtime_1.jsx)("path", { d: "M21.9691 6.47136e-09C25.9369 6.47136e-09 29.5264 1.62125 32.0003 4.21094C30.0604 5.7917 28.4423 7.75571 27.2581 10C23.3149 10.1989 19.6111 11.9702 16.9622 14.9238C14.3136 17.8774 12.936 21.772 13.1331 25.75C13.2057 27.2131 13.4902 28.6432 13.9652 30H10.7689C7.96116 29.8907 5.29664 28.7203 3.30402 26.7217C1.31144 24.7231 0.135825 22.0419 0.0110544 19.21C-0.113702 16.378 0.821178 13.6017 2.63019 11.4326C4.43921 9.26356 6.99065 7.8602 9.77766 7.5C11.9582 3.00012 16.6168 8.76701e-05 21.9691 6.47136e-09Z", fill: "#5BA2C6" })] })));
}
const SequenceMountain = (props) => {
    const { Title, Item, data, gap = 20, minHeight = 100, maxHeight = 200, minWidth = 260, maxWidth = 300, options, } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const itemElements = [];
    const btnElements = [];
    const decorElements = [];
    const labelElements = [];
    const n = items.length;
    const themeColors = (0, utils_1.getThemeColors)(options.themeConfig);
    const sunSize = 60;
    const cloudSizes = {
        single: { width: 54, height: 36 },
        double: { width: 73, height: 40 },
    };
    const mountainWidths = [];
    const mountainXPositions = [];
    let totalWidth = 0;
    let nextMountainX = 0;
    items.forEach((datum, index) => {
        const progress = n > 1 ? index / (n - 1) : 0;
        const mountainHeight = minHeight + (maxHeight - minHeight) * progress;
        const calculatedWidth = mountainHeight * 1.6;
        const mountainWidth = Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
        mountainWidths.push(mountainWidth);
        const mountainX = nextMountainX;
        mountainXPositions.push(mountainX);
        nextMountainX += mountainWidth / 2;
        if (index === n - 1) {
            totalWidth = mountainX + mountainWidth;
        }
    });
    const firstMountainLeft = mountainXPositions[0];
    const lastMountainRight = mountainXPositions[n - 1] + mountainWidths[n - 1];
    const itemAreaWidth = lastMountainRight - firstMountainLeft;
    const itemWidth = n > 1 ? (itemAreaWidth - gap * (n - 1)) / n : itemAreaWidth;
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], data: data, datum: items[0], width: itemWidth }));
    const labelHeight = 32;
    const labelYPos = maxHeight + gap;
    const itemYPos = labelYPos + labelHeight + 10;
    items.forEach((datum, index) => {
        const indexes = [index];
        const mountainHeight = minHeight + (maxHeight - minHeight) * (n > 1 ? index / (n - 1) : 0);
        const mountainWidth = mountainWidths[index];
        const mountainX = mountainXPositions[index];
        const mountainY = maxHeight - mountainHeight;
        const color = (0, utils_1.getPaletteColor)(options, [index]) || themeColors.colorPrimary;
        decorElements.push((0, jsx_runtime_1.jsx)(Mountain, { colorPrimary: color, x: mountainX, y: mountainY, width: mountainWidth, height: mountainHeight }));
        const itemX = firstMountainLeft + index * (itemWidth + gap);
        labelElements.push((0, jsx_runtime_1.jsx)(jsx_1.Text, { x: itemX, y: labelYPos, width: itemWidth, height: labelHeight, fontSize: 16, fontWeight: "bold", alignHorizontal: "center", alignVertical: "middle", fill: color, backgroundColor: color, backgroundOpacity: 0.5, backgroundRadius: 4, children: String(index + 1).padStart(2, '0') }));
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: indexes, datum: datum, data: data, x: itemX, y: itemYPos, width: itemWidth }));
    });
    const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
    const btnY = itemYPos + itemBounds.height + 10;
    items.forEach((datum, index) => {
        const indexes = [index];
        const itemX = firstMountainLeft + index * (itemWidth + gap);
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: indexes, x: itemX + itemWidth / 2 - btnBounds.width / 2, y: btnY }));
        if (index < items.length - 1) {
            btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [index + 1], x: itemX + itemWidth + gap / 2 - btnBounds.width / 2, y: btnY }));
        }
    });
    if (n > 0) {
        const firstItemX = firstMountainLeft;
        btnElements.unshift((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0], x: firstItemX - gap / 2 - btnBounds.width / 2, y: btnY }));
        const lastItemX = firstMountainLeft + (n - 1) * (itemWidth + gap);
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [n], x: lastItemX + itemWidth + gap / 2 - btnBounds.width / 2, y: btnY }));
        decorElements.push((0, jsx_runtime_1.jsx)(Sun, { x: totalWidth - sunSize - 20, y: -35, width: sunSize, height: sunSize }));
        const treeSizes = [
            'tiny',
            'small',
            'medium',
            'large',
        ];
        const treeHeightMap = { tiny: 27, small: 48, medium: 54, large: 72 };
        const treeWidthMap = {
            tiny: 14.85,
            small: 26.4,
            medium: 29.7,
            large: 39.6,
        };
        const placedTrees = [];
        const isTreeOverlapping = (treeX, treeWidth, padding = 5) => {
            return placedTrees.some((placed) => {
                return !(treeX + treeWidth + padding < placed.x ||
                    treeX > placed.x + placed.width + padding);
            });
        };
        items.forEach((datum, index) => {
            const mountainX = mountainXPositions[index];
            const mountainWidth = mountainWidths[index];
            const isLastMountain = index === n - 1;
            const treesOnThisMountain = isLastMountain ? 3 : index === 0 ? 1 : 2;
            for (let t = 0; t < treesOnThisMountain; t++) {
                const seed = index * 100 + t * 37;
                const sizeIndex = (seed * 17) % treeSizes.length;
                const treeSize = treeSizes[sizeIndex];
                const treeHeight = treeHeightMap[treeSize];
                const treeWidth = treeWidthMap[treeSize];
                let attempts = 0;
                let treeX = 0;
                let validPosition = false;
                while (attempts < 20 && !validPosition) {
                    const xOffset = ((seed * 13 + attempts * 19) % 100) / 100;
                    const minX = mountainX + mountainWidth * 0.15;
                    const maxX = mountainX + mountainWidth * 0.85 - treeWidth;
                    treeX = minX + (maxX - minX) * xOffset;
                    if (!isTreeOverlapping(treeX, treeWidth)) {
                        validPosition = true;
                    }
                    attempts++;
                }
                if (validPosition) {
                    placedTrees.push({ x: treeX, width: treeWidth });
                    const treeY = maxHeight - treeHeight;
                    decorElements.push((0, jsx_runtime_1.jsx)(jsx_1.Group, { x: treeX, y: treeY, children: Tree(treeSize) }));
                }
            }
        });
        const cloudCount = Math.max(1, Math.floor(n / 1.5));
        for (let i = 0; i < cloudCount; i++) {
            const seed = i * 11 + n * 5 + 1;
            const cloudType = seed % 2 === 0 ? 'single' : 'double';
            const cloudSize = cloudSizes[cloudType];
            const cloudRange = lastMountainRight - firstMountainLeft - cloudSize.width;
            const xPos = firstMountainLeft + (((seed * 7) % 100) / 100) * cloudRange;
            const yPos = (seed * 13) % 40;
            decorElements.push((0, jsx_runtime_1.jsx)(Cloud, { type: cloudType, x: xPos, y: yPos, width: cloudSize.width, height: cloudSize.height }));
        }
    }
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { children: [(0, jsx_runtime_1.jsx)(jsx_1.Group, { children: decorElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: labelElements }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.SequenceMountain = SequenceMountain;
(0, registry_1.registerStructure)('sequence-mountain', {
    component: exports.SequenceMountain,
    composites: ['title', 'item'],
});
