"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.join = join;
function join(...paths) {
    return paths
        .map((path) => path.replace(/^\/+|\/+$/g, ''))
        .filter((path) => path.trim().length > 0)
        .join('/');
}
