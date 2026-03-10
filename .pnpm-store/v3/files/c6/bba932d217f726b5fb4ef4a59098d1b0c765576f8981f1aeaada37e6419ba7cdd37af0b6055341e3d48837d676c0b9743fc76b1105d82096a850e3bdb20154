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
exports.waitForSvgLoads = exports.getSvgLoadPromises = void 0;
exports.loadResource = loadResource;
const utils_1 = require("../utils");
const load_tracker_1 = require("./load-tracker");
const loaders_1 = require("./loaders");
const registry_1 = require("./registry");
const utils_2 = require("./utils");
function getResource(scene, config, datum) {
    return __awaiter(this, void 0, void 0, function* () {
        const cfg = (0, utils_2.parseResourceConfig)(config);
        if (!cfg)
            return null;
        cfg.scene || (cfg.scene = scene);
        const { source, data, format, encoding } = cfg;
        let resource = null;
        try {
            if (source === 'inline') {
                const isDataURI = data.startsWith('data:');
                if (format === 'svg' && encoding === 'raw') {
                    resource = (0, loaders_1.loadSVGResource)(data);
                }
                else if (format === 'svg' && isDataURI) {
                    resource = yield (0, loaders_1.loadImageBase64Resource)(data);
                }
                else if (isDataURI || format === 'image') {
                    resource = yield (0, loaders_1.loadImageBase64Resource)(data);
                }
                else {
                    resource = (0, loaders_1.loadSVGResource)(data);
                }
            }
            else if (source === 'remote') {
                resource = yield (0, loaders_1.loadRemoteResource)(data, format);
            }
            else if (source === 'search') {
                resource = yield (0, loaders_1.loadSearchResource)(data, format);
            }
            else {
                const customLoader = (0, registry_1.getCustomResourceLoader)();
                if (customLoader)
                    resource = yield customLoader(cfg);
            }
        }
        catch (_a) {
            resource = null;
        }
        if (resource)
            return resource;
        return yield (0, loaders_1.loadSearchResource)(getFallbackQuery(cfg, scene, datum), format);
    });
}
const RESOURCE_MAP = new Map();
const RESOURCE_LOAD_MAP = new WeakMap();
/**
 * load resource into svg defs
 * @returns resource ref id
 */
function loadResource(svg, scene, config, datum) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!svg)
            return null;
        const cfg = (0, utils_2.parseResourceConfig)(config);
        if (!cfg)
            return null;
        const id = (0, utils_2.getResourceId)(cfg);
        const promiseKey = `resource:${id}`;
        const loadedMap = RESOURCE_LOAD_MAP.get(svg);
        if (loadedMap === null || loadedMap === void 0 ? void 0 : loadedMap.has(id))
            return id;
        const existingPromise = (0, load_tracker_1.getSvgLoadPromise)(svg, promiseKey);
        if (existingPromise)
            return yield existingPromise;
        const loadPromise = (() => __awaiter(this, void 0, void 0, function* () {
            const resource = RESOURCE_MAP.has(id)
                ? RESOURCE_MAP.get(id) || null
                : yield getResource(scene, cfg, datum);
            if (!resource)
                return null;
            if (!RESOURCE_LOAD_MAP.has(svg))
                RESOURCE_LOAD_MAP.set(svg, new Map());
            const map = RESOURCE_LOAD_MAP.get(svg);
            if (map.has(id))
                return id;
            const defs = (0, utils_1.getOrCreateDefs)(svg);
            resource.id = id;
            defs.appendChild(resource);
            map.set(id, resource);
            return id;
        }))();
        (0, load_tracker_1.trackSvgLoadPromise)(svg, promiseKey, loadPromise);
        return yield loadPromise;
    });
}
var load_tracker_2 = require("./load-tracker");
Object.defineProperty(exports, "getSvgLoadPromises", { enumerable: true, get: function () { return load_tracker_2.getSvgLoadPromises; } });
Object.defineProperty(exports, "waitForSvgLoads", { enumerable: true, get: function () { return load_tracker_2.waitForSvgLoads; } });
function getFallbackQuery(cfg, scene, datum) {
    const defaultQuery = scene === 'illus' ? 'illustration' : 'icon';
    const datumQuery = normalizeQuery(cfg.data) ||
        normalizeQuery(datum === null || datum === void 0 ? void 0 : datum.label) ||
        normalizeQuery(datum === null || datum === void 0 ? void 0 : datum.desc);
    if (datumQuery)
        return datumQuery;
    const data = normalizeQuery(cfg.data);
    if (!data)
        return defaultQuery;
    if (cfg.source === 'inline')
        return defaultQuery;
    if (data.startsWith('data:'))
        return defaultQuery;
    if (data.startsWith('<svg') || data.startsWith('<symbol'))
        return defaultQuery;
    return data;
}
function normalizeQuery(value) {
    if (typeof value !== 'string')
        return null;
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
}
