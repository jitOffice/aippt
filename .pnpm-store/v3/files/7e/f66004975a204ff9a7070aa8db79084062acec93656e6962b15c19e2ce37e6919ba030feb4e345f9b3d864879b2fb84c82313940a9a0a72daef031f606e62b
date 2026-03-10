"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResourceConfig = parseResourceConfig;
const data_uri_1 = require("./data-uri");
const KNOWN_FORMATS = new Set(['svg', 'png', 'jpg', 'jpeg', 'webp', 'gif']);
function looksLikeSVG(resource) {
    const str = resource.trim();
    return str.startsWith('<svg') || str.startsWith('<symbol');
}
function inferFormatFromUrl(url) {
    const lower = url.toLowerCase();
    if (lower.endsWith('.svg') || lower.includes('.svg?'))
        return 'svg';
    if (lower.endsWith('.png') ||
        lower.endsWith('.jpg') ||
        lower.endsWith('.jpeg') ||
        lower.endsWith('.webp') ||
        lower.endsWith('.gif')) {
        return 'image';
    }
    return undefined;
}
function parseRefResource(resource) {
    var _a;
    if (!resource.startsWith('ref:'))
        return null;
    const rest = resource.slice(4);
    const [source, ...restParts] = rest.split(':');
    if (!source || restParts.length === 0)
        return null;
    let format;
    if (restParts.length > 1 && KNOWN_FORMATS.has(restParts[0].toLowerCase())) {
        format = (_a = restParts.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    }
    const payload = restParts.join(':');
    if (!payload)
        return null;
    const normalizedSource = source === 'url' ? 'remote' : source;
    if (normalizedSource === 'remote') {
        return {
            source: 'remote',
            format: format || inferFormatFromUrl(payload) || undefined,
            data: payload,
        };
    }
    if (normalizedSource === 'search') {
        return {
            source: 'search',
            format: format || 'svg',
            data: payload,
        };
    }
    if (normalizedSource === 'svg') {
        return { source: 'inline', format: 'svg', data: payload, encoding: 'raw' };
    }
    return { source: 'custom', data: resource, format };
}
function parseResourceConfig(config) {
    if (!config)
        return null;
    if (typeof config !== 'string') {
        if (config.source)
            return config;
        const legacy = config;
        if (legacy.type === 'image') {
            return { source: 'inline', format: 'image', data: legacy.data };
        }
        if (legacy.type === 'svg') {
            return {
                source: 'inline',
                format: 'svg',
                encoding: 'raw',
                data: legacy.data,
            };
        }
        if (legacy.type === 'remote') {
            return { source: 'remote', format: legacy.format, data: legacy.data };
        }
        if (legacy.type === 'search') {
            return {
                source: 'search',
                format: legacy.format || 'svg',
                data: legacy.data,
            };
        }
        if (legacy.type === 'custom') {
            return { source: 'custom', data: legacy.data };
        }
        return null;
    }
    const dataURIConfig = (0, data_uri_1.parseDataURI)(config);
    if (dataURIConfig)
        return dataURIConfig;
    const refConfig = parseRefResource(config);
    if (refConfig)
        return refConfig;
    if (looksLikeSVG(config)) {
        return { source: 'inline', format: 'svg', encoding: 'raw', data: config };
    }
    return { source: 'custom', data: config };
}
