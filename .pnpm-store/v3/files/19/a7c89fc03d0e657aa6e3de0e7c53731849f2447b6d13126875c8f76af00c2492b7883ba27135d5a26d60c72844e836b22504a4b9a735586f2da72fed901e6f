"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = Path;
function Path(props) {
    const { x, y } = props;
    const finalProps = Object.assign({}, props);
    if (x !== undefined || y !== undefined) {
        finalProps.transform = `translate(${x !== null && x !== void 0 ? x : 0}, ${y !== null && y !== void 0 ? y : 0})`;
    }
    const node = {
        type: 'path',
        props: finalProps,
    };
    return node;
}
