"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderBaseElement = renderBaseElement;
const utils_1 = require("../../utils");
const utils_2 = require("../utils");
function renderBaseElement(svg, attrs) {
    if (attrs && Object.keys(attrs).length > 0) {
        (0, utils_1.traverse)(svg, (element) => {
            const parsedAttrs = (0, utils_2.parseDynamicAttributes)(element, attrs);
            (0, utils_1.setAttributes)(element, parsedAttrs);
        });
    }
}
