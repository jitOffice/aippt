"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectStyleOnce = injectStyleOnce;
function injectStyleOnce(id, styles) {
    if (document.getElementById(id))
        return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = styles;
    document.head.appendChild(style);
}
