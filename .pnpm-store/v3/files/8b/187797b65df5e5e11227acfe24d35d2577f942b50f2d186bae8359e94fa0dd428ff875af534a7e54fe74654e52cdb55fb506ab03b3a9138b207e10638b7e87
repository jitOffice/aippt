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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithCache = fetchWithCache;
const flru_1 = __importDefault(require("flru"));
const nativeFetch = globalThis.fetch;
const CACHE_MAX_ENTRIES = 1024;
const responseCache = (0, flru_1.default)(CACHE_MAX_ENTRIES);
const pendingRequests = new Map();
function buildHeadersKey(request) {
    const entries = Array.from(request.headers.entries());
    if (entries.length === 0)
        return '';
    entries.sort(([nameA], [nameB]) => nameA.toLowerCase().localeCompare(nameB.toLowerCase()));
    return entries
        .map(([name, value]) => `${name.toLowerCase()}:${value}`)
        .join('|');
}
function buildCacheKey(request) {
    const headersKey = buildHeadersKey(request);
    return headersKey
        ? `${request.method}:${request.url}:${headersKey}`
        : `${request.method}:${request.url}`;
}
function buildResponse(entry) {
    return new Response(entry.body.slice(0), entry.init);
}
function fetchAndCache(request, key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield nativeFetch(request);
            const body = yield response.arrayBuffer();
            const entry = {
                body,
                init: {
                    status: response.status,
                    statusText: response.statusText,
                    headers: Array.from(response.headers.entries()),
                },
            };
            if (response.ok) {
                responseCache.set(key, entry);
            }
            return entry;
        }
        finally {
            pendingRequests.delete(key);
        }
    });
}
function fetchWithCache(input, init) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = new Request(input, init);
        if (request.method !== 'GET') {
            return nativeFetch(request);
        }
        const key = buildCacheKey(request);
        if (responseCache.has(key)) {
            return buildResponse(responseCache.get(key));
        }
        let pending = pendingRequests.get(key);
        if (!pending) {
            pending = fetchAndCache(request, key);
            pendingRequests.set(key, pending);
        }
        const entry = yield pending;
        return buildResponse(entry);
    });
}
