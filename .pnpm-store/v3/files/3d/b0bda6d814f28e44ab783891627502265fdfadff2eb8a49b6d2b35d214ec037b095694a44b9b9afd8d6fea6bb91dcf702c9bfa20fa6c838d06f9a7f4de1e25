"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = Group;
function Group(props) {
    const { x = 0, y = 0 } = props;
    if (x || y) {
        props.transform || (props.transform = `translate(${x}, ${y})`);
    }
    const node = {
        type: 'g',
        props,
    };
    return node;
}
