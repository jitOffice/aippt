"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSvgLoadPromises = getSvgLoadPromises;
exports.getSvgLoadPromise = getSvgLoadPromise;
exports.trackSvgLoadPromise = trackSvgLoadPromise;
exports.waitForSvgLoads = waitForSvgLoads;
const SVG_LOAD_PROMISE_MAP = new WeakMap();
function getSvgLoadPromises(svg) {
    const map = SVG_LOAD_PROMISE_MAP.get(svg);
    return map ? Array.from(map.values()) : [];
}
function getSvgLoadPromise(svg, key) {
    var _a;
    return (_a = SVG_LOAD_PROMISE_MAP.get(svg)) === null || _a === void 0 ? void 0 : _a.get(key);
}
function trackSvgLoadPromise(svg, key, promise) {
    let map = SVG_LOAD_PROMISE_MAP.get(svg);
    if (!map) {
        map = new Map();
        SVG_LOAD_PROMISE_MAP.set(svg, map);
    }
    map.set(key, promise);
    promise.finally(() => {
        const map = SVG_LOAD_PROMISE_MAP.get(svg);
        if (!map)
            return;
        if (map.get(key) === promise)
            map.delete(key);
        if (map.size === 0)
            SVG_LOAD_PROMISE_MAP.delete(svg);
    });
    return promise;
}
function waitForSvgLoads(svg) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.resolve();
        while (true) {
            const promises = getSvgLoadPromises(svg);
            if (!promises.length)
                break;
            yield Promise.allSettled(promises);
            yield Promise.resolve();
        }
    });
}
