export function Ellipse(props) {
    var _a, _b, _c, _d;
    const { x = 0, y = 0, width = 0, height = 0 } = props;
    (_a = props.cx) !== null && _a !== void 0 ? _a : (props.cx = x + width / 2);
    (_b = props.cy) !== null && _b !== void 0 ? _b : (props.cy = y + height / 2);
    (_c = props.rx) !== null && _c !== void 0 ? _c : (props.rx = width / 2);
    (_d = props.ry) !== null && _d !== void 0 ? _d : (props.ry = height / 2);
    const node = {
        type: 'ellipse',
        props,
    };
    return node;
}
