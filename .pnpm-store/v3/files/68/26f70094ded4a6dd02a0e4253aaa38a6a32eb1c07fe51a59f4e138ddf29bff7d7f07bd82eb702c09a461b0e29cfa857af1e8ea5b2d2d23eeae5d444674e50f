var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getOrCreateDefs } from '../utils/index.js';
import { getSvgLoadPromise, trackSvgLoadPromise } from './load-tracker.js';
import { loadImageBase64Resource, loadRemoteResource, loadSearchResource, loadSVGResource, } from './loaders/index.js';
import { getCustomResourceLoader } from './registry.js';
import { getResourceId, parseResourceConfig } from './utils/index.js';
function getResource(scene, config, datum) {
    return __awaiter(this, void 0, void 0, function* () {
        const cfg = parseResourceConfig(config);
        if (!cfg)
            return null;
        cfg.scene || (cfg.scene = scene);
        const { source, data, format, encoding } = cfg;
        let resource = null;
        try {
            if (source === 'inline') {
                const isDataURI = data.startsWith('data:');
                if (format === 'svg' && encoding === 'raw') {
                    resource = loadSVGResource(data);
                }
                else if (format === 'svg' && isDataURI) {
                    resource = yield loadImageBase64Resource(data);
                }
                else if (isDataURI || format === 'image') {
                    resource = yield loadImageBase64Resource(data);
                }
                else {
                    resource = loadSVGResource(data);
                }
            }
            else if (source === 'remote') {
                resource = yield loadRemoteResource(data, format);
            }
            else if (source === 'search') {
                resource = yield loadSearchResource(data, format);
            }
            else {
                const customLoader = getCustomResourceLoader();
                if (customLoader)
                    resource = yield customLoader(cfg);
            }
        }
        catch (_a) {
            resource = null;
        }
        if (resource)
            return resource;
        return yield loadSearchResource(getFallbackQuery(cfg, scene, datum), format);
    });
}
const RESOURCE_MAP = new Map();
const RESOURCE_LOAD_MAP = new WeakMap();
/**
 * load resource into svg defs
 * @returns resource ref id
 */
export function loadResource(svg, scene, config, datum) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!svg)
            return null;
        const cfg = parseResourceConfig(config);
        if (!cfg)
            return null;
        const id = getResourceId(cfg);
        const promiseKey = `resource:${id}`;
        const loadedMap = RESOURCE_LOAD_MAP.get(svg);
        if (loadedMap === null || loadedMap === void 0 ? void 0 : loadedMap.has(id))
            return id;
        const existingPromise = getSvgLoadPromise(svg, promiseKey);
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
            const defs = getOrCreateDefs(svg);
            resource.id = id;
            defs.appendChild(resource);
            map.set(id, resource);
            return id;
        }))();
        trackSvgLoadPromise(svg, promiseKey, loadPromise);
        return yield loadPromise;
    });
}
export { getSvgLoadPromises, waitForSvgLoads } from './load-tracker.js';
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
