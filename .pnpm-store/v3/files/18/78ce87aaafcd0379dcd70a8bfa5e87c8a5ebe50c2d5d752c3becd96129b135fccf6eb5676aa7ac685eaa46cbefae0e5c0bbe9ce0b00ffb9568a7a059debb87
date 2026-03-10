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
exports.AlignLayout = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
exports.AlignLayout = (0, jsx_1.createLayout)((children, _a) => {
    var _b, _c, _d, _e;
    var { horizontal, vertical } = _a, props = __rest(_a, ["horizontal", "vertical"]);
    if (!children || children.length === 0) {
        return (0, jsx_runtime_1.jsx)(jsx_1.Group, Object.assign({}, props));
    }
    const childBounds = children.map((child) => (0, jsx_1.getElementBounds)(child));
    const childrenBounds = (0, jsx_1.getElementsBounds)(children);
    // 容器尺寸和位置
    const containerX = (_b = props.x) !== null && _b !== void 0 ? _b : childrenBounds.x;
    const containerY = (_c = props.y) !== null && _c !== void 0 ? _c : childrenBounds.y;
    const containerWidth = (_d = props.width) !== null && _d !== void 0 ? _d : childrenBounds.width;
    const containerHeight = (_e = props.height) !== null && _e !== void 0 ? _e : childrenBounds.height;
    // 对齐子元素（使用相对于容器的坐标）
    const positionedChildren = children.map((child, index) => {
        const bounds = childBounds[index];
        const childProps = Object.assign({}, child.props);
        // 水平对齐（相对于容器左边界）
        if (horizontal !== undefined) {
            switch (horizontal) {
                case 'left':
                    childProps.x = -bounds.x; // 相对容器边界
                    break;
                case 'center':
                    childProps.x = (containerWidth - bounds.width) / 2 - bounds.x;
                    break;
                case 'right':
                    childProps.x = containerWidth - bounds.width - bounds.x;
                    break;
            }
        }
        else if (childProps.x === undefined) {
            // 保持相对位置
            childProps.x = bounds.x - containerX;
        }
        // 垂直对齐（相对于容器顶边界）
        if (vertical !== undefined) {
            switch (vertical) {
                case 'top':
                    childProps.y = -bounds.y;
                    break;
                case 'middle':
                    childProps.y = (containerHeight - bounds.height) / 2 - bounds.y;
                    break;
                case 'bottom':
                    childProps.y = containerHeight - bounds.height - bounds.y;
                    break;
            }
        }
        else if (childProps.y === undefined) {
            // 保持相对位置
            childProps.y = bounds.y - containerY;
        }
        return (0, jsx_1.cloneElement)(child, childProps);
    });
    const containerProps = Object.assign(Object.assign({}, props), { x: containerX, y: containerY, width: containerWidth, height: containerHeight });
    return (0, jsx_runtime_1.jsx)(jsx_1.Group, Object.assign({}, containerProps, { children: positionedChildren }));
});
