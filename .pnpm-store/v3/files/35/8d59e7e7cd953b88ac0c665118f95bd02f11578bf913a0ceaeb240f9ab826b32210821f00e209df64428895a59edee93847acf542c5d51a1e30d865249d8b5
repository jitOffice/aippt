import { jsx as _jsx, jsxs as _jsxs } from "../../jsx-runtime.js";
export const LinearGradient = (props) => {
    const { id = 'linear-gradient', startColor = 'black', stopColor = 'white', direction = 'left-right', } = props;
    const directionMap = {
        'left-right': { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
        'right-left': { x1: '100%', y1: '0%', x2: '0%', y2: '0%' },
        'top-bottom': { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
        'bottom-top': { x1: '0%', y1: '100%', x2: '0%', y2: '0%' },
    };
    return (_jsxs("linearGradient", Object.assign({ id: id }, directionMap[direction], { children: [_jsx("stop", { offset: "0%", stopColor: startColor }), _jsx("stop", { offset: "100%", stopColor: stopColor })] })));
};
