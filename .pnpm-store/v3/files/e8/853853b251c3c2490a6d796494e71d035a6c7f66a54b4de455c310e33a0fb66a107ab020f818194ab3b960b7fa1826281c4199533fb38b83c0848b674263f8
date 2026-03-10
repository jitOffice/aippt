"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlexLayout = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
exports.FlexLayout = (0, jsx_1.createLayout)((children, _a) => {
    var _b, _c, _d, _e, _f, _g;
    var { flexDirection = 'row', justifyContent = 'flex-start', alignItems = 'flex-start', alignContent = 'flex-start', flexWrap = 'nowrap', gap = 0 } = _a, props = __rest(_a, ["flexDirection", "justifyContent", "alignItems", "alignContent", "flexWrap", "gap"]);
    if (!children || children.length === 0) {
        return (0, jsx_runtime_1.jsx)(jsx_1.Group, Object.assign({}, props));
    }
    const isRow = flexDirection === 'row' || flexDirection === 'row-reverse';
    const isReverse = flexDirection === 'row-reverse' || flexDirection === 'column-reverse';
    const childBounds = children.map((child) => (0, jsx_1.getElementBounds)(child));
    const childrenBounds = (0, jsx_1.getElementsBounds)(children);
    const containerWidth = (_b = props.width) !== null && _b !== void 0 ? _b : childrenBounds.width;
    const containerHeight = (_c = props.height) !== null && _c !== void 0 ? _c : childrenBounds.height;
    const hasContainerSize = props.width !== undefined && props.height !== undefined;
    const lines = [];
    if (flexWrap === 'wrap' && hasContainerSize) {
        let currentLine = [];
        let currentLineBounds = [];
        let currentLineSize = 0;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const bounds = childBounds[i];
            const childSize = isRow ? bounds.width : bounds.height;
            const maxSize = isRow ? containerWidth : containerHeight;
            if (currentLine.length === 0 ||
                currentLineSize + gap + childSize <= maxSize) {
                currentLine.push(child);
                currentLineBounds.push(bounds);
                currentLineSize += (currentLine.length > 1 ? gap : 0) + childSize;
            }
            else {
                lines.push({ children: currentLine, bounds: currentLineBounds });
                currentLine = [child];
                currentLineBounds = [bounds];
                currentLineSize = childSize;
            }
        }
        if (currentLine.length > 0) {
            lines.push({ children: currentLine, bounds: currentLineBounds });
        }
    }
    else {
        lines.push({ children, bounds: childBounds });
    }
    const layoutChildren = [];
    let currentCrossPos = 0;
    const crossSizes = [];
    lines.forEach((line) => {
        const { children: lineChildren, bounds: lineBounds } = line;
        const totalMainSize = lineBounds.reduce((sum, bounds, index) => {
            const childMainSize = isRow ? bounds.width : bounds.height;
            return sum + childMainSize + (index > 0 ? gap : 0);
        }, 0);
        const maxCrossSize = Math.max(...lineBounds.map((bounds) => (isRow ? bounds.height : bounds.width)));
        crossSizes.push(maxCrossSize);
        let mainStart = 0;
        const availableMainSpace = (isRow ? containerWidth : containerHeight) - totalMainSize;
        if (hasContainerSize) {
            switch (justifyContent) {
                case 'flex-end':
                    mainStart = availableMainSpace;
                    break;
                case 'center':
                    mainStart = availableMainSpace / 2;
                    break;
                case 'space-between':
                    mainStart = 0;
                    break;
                default:
                    mainStart = 0;
                    break;
            }
        }
        let itemSpacing = gap;
        if (hasContainerSize &&
            justifyContent === 'space-between' &&
            lineChildren.length > 1) {
            itemSpacing = availableMainSpace / (lineChildren.length - 1) + gap;
        }
        let currentMainPos = mainStart;
        lineChildren.forEach((child, childIndex) => {
            const bounds = lineBounds[childIndex];
            const childMainSize = isRow ? bounds.width : bounds.height;
            const childCrossSize = isRow ? bounds.height : bounds.width;
            const mainOffset = isRow ? bounds.x : bounds.y;
            const crossOffset = isRow ? bounds.y : bounds.x;
            let crossPos = currentCrossPos;
            if (hasContainerSize) {
                switch (alignItems) {
                    case 'flex-end':
                        crossPos = currentCrossPos + maxCrossSize - childCrossSize;
                        break;
                    case 'center':
                        crossPos = currentCrossPos + (maxCrossSize - childCrossSize) / 2;
                        break;
                    default:
                        crossPos = currentCrossPos;
                        break;
                }
            }
            let x, y;
            if (isRow) {
                x = isReverse
                    ? containerWidth - currentMainPos - childMainSize - mainOffset
                    : currentMainPos - mainOffset;
                y = crossPos - crossOffset;
            }
            else {
                x = crossPos - crossOffset;
                y = isReverse
                    ? containerHeight - currentMainPos - childMainSize - mainOffset
                    : currentMainPos - mainOffset;
            }
            const clonedChild = (0, jsx_1.cloneElement)(child, { x, y });
            layoutChildren.push(clonedChild);
            currentMainPos += childMainSize + itemSpacing;
        });
        currentCrossPos += maxCrossSize + gap;
    });
    if (lines.length > 1 && hasContainerSize) {
        const totalCrossSize = crossSizes.reduce((sum, size) => sum + size, 0) +
            (lines.length - 1) * gap;
        const availableCrossSpace = (isRow ? containerHeight : containerWidth) - totalCrossSize;
        let crossOffset = 0;
        switch (alignContent) {
            case 'flex-end':
                crossOffset = availableCrossSpace;
                break;
            case 'center':
                crossOffset = availableCrossSpace / 2;
                break;
            case 'space-between':
                if (lines.length > 1) {
                    const lineSpacing = availableCrossSpace / (lines.length - 1);
                    let currentOffset = 0;
                    lines.forEach((line, lineIndex) => {
                        const lineStartIndex = lines
                            .slice(0, lineIndex)
                            .reduce((sum, l) => sum + l.children.length, 0);
                        const lineEndIndex = lineStartIndex + line.children.length;
                        for (let i = lineStartIndex; i < lineEndIndex; i++) {
                            const child = layoutChildren[i];
                            const newProps = Object.assign({}, child.props);
                            if (isRow) {
                                newProps.y = (newProps.y || 0) + currentOffset;
                            }
                            else {
                                newProps.x = (newProps.x || 0) + currentOffset;
                            }
                            layoutChildren[i] = (0, jsx_1.cloneElement)(child, newProps);
                        }
                        currentOffset +=
                            crossSizes[lineIndex] +
                                gap +
                                (lineIndex < lines.length - 1 ? lineSpacing : 0);
                    });
                    break;
                }
                break;
            default:
                crossOffset = 0;
                break;
        }
        if (crossOffset !== 0 && alignContent !== 'space-between') {
            layoutChildren.forEach((child, index) => {
                const newProps = Object.assign({}, child.props);
                if (isRow) {
                    newProps.y = (newProps.y || 0) + crossOffset;
                }
                else {
                    newProps.x = (newProps.x || 0) + crossOffset;
                }
                layoutChildren[index] = (0, jsx_1.cloneElement)(child, newProps);
            });
        }
    }
    if (!hasContainerSize) {
        if (alignItems === 'center') {
            if (isRow) {
                const maxHeight = Math.max(...childBounds.map((b) => b.height));
                layoutChildren.forEach((child, index) => {
                    const bounds = childBounds[index];
                    const centerOffset = (maxHeight - bounds.height) / 2;
                    const newProps = Object.assign({}, child.props);
                    newProps.y = (newProps.y || 0) + centerOffset;
                    layoutChildren[index] = (0, jsx_1.cloneElement)(child, newProps);
                });
            }
            else {
                const maxWidth = Math.max(...childBounds.map((b) => b.width));
                layoutChildren.forEach((child, index) => {
                    const bounds = childBounds[index];
                    const centerOffset = (maxWidth - bounds.width) / 2;
                    const newProps = Object.assign({}, child.props);
                    newProps.x = (newProps.x || 0) + centerOffset;
                    layoutChildren[index] = (0, jsx_1.cloneElement)(child, newProps);
                });
            }
        }
    }
    const finalBounds = (0, jsx_1.getElementsBounds)(layoutChildren);
    const containerProps = Object.assign(Object.assign({}, props), { x: (_d = props.x) !== null && _d !== void 0 ? _d : childrenBounds.x, y: (_e = props.y) !== null && _e !== void 0 ? _e : childrenBounds.y, width: (_f = props.width) !== null && _f !== void 0 ? _f : finalBounds.width, height: (_g = props.height) !== null && _g !== void 0 ? _g : finalBounds.height });
    return (0, jsx_runtime_1.jsx)(jsx_1.Group, Object.assign({}, containerProps, { children: layoutChildren }));
});
