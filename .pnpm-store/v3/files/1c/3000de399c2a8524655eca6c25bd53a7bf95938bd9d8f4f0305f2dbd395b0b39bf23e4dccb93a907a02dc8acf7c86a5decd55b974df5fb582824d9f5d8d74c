"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPattern = registerPattern;
exports.applyPatternStyle = applyPatternStyle;
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const utils_1 = require("../../utils");
const utils_2 = require("../utils");
const builtInPatterns = __importStar(require("./patterns"));
const PATTERNS = new Map();
function registerPattern(name, generator) {
    if (PATTERNS.has(name))
        console.warn(`Pattern ${name} will be overwritten`);
    PATTERNS.set(name, generator);
}
for (const [name, generator] of Object.entries(builtInPatterns)) {
    registerPattern(name, generator);
}
function applyPatternStyle(node, svg, options) {
    const config = options.themeConfig.stylize;
    if (!config || config.type !== 'pattern')
        return;
    const { pattern } = config, restConfig = __rest(config, ["pattern"]);
    const generator = PATTERNS.get(pattern);
    if (!generator) {
        return console.warn(`Pattern ${pattern} not found`);
    }
    const { fill } = (0, utils_1.getAttributes)(node, ['fill', 'stroke']);
    const color = fill;
    const style = Object.assign({ backgroundColor: color
            ? (0, tinycolor2_1.default)(color).setAlpha(0.5).toRgbString()
            : color, foregroundColor: color }, restConfig);
    const id = getPatternId(Object.assign(Object.assign({}, config), style));
    upsertPattern(svg, id, generator(style));
    if ((0, utils_1.hasColor)(fill)) {
        node.setAttribute('fill', `url(#${id})`);
        if (!node.getAttribute('stroke') && fill) {
            node.setAttribute('stroke', fill);
        }
    }
}
function upsertPattern(svg, id, pattern) {
    const defs = (0, utils_1.getOrCreateDefs)(svg);
    pattern.setAttribute('id', id);
    const exist = defs.querySelector(`pattern#${id}`);
    if (exist)
        exist.replaceWith(pattern);
    else
        defs.appendChild(pattern);
}
function getPatternId(config) {
    const { pattern, foregroundColor = 'unset', backgroundColor = 'unset', scale = 'unset', } = config;
    return (0, utils_2.getSafetyId)(`pattern-${pattern}-${foregroundColor}-${backgroundColor}-${scale}`);
}
